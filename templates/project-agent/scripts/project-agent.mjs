#!/usr/bin/env node

import { lstat, open, readdir, realpath } from 'node:fs/promises';
import { constants, realpathSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const CLASSIFICATIONS = new Set([
  'ALREADY_SETTLED',
  'NEW_MATERIAL_DELTA',
  'STALE_LINEAGE',
  'CONTRADICTION',
  'LOCAL_ONLY_OBSERVATION',
  'UNVERIFIED_CLAIM',
]);
const RFC3986_ASCII_URI = /^[A-Za-z0-9._~:/?#@!$&'()*+,;=%\x5B\x5D\x2D]+$/;

const ROOT = process.env.PROJECT_AGENT_ROOT
  ? path.resolve(process.env.PROJECT_AGENT_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function exactKeys(value, expected, label) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${label} must be an object`);
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  assert(JSON.stringify(actual) === JSON.stringify(wanted), `${label} fields must be exactly: ${wanted.join(', ')}`);
}

function stringArray(value, label, { nonEmpty = false } = {}) {
  assert(Array.isArray(value), `${label} must be an array`);
  if (nonEmpty) assert(value.length > 0, `${label} must not be empty`);
  assert(value.every((item) => typeof item === 'string' && item.length > 0), `${label} must contain non-empty strings`);
}

function uniqueItems(value, label) {
  function canonical(item) {
    if (Array.isArray(item)) return item.map(canonical);
    if (item && typeof item === 'object') {
      return Object.fromEntries(Object.keys(item).sort().map((key) => [key, canonical(item[key])]));
    }
    return item;
  }
  assert(new Set(value.map((item) => JSON.stringify(canonical(item)))).size === value.length, `${label} must contain unique items`);
}

function id(value, label) {
  assert(typeof value === 'string' && /^[A-Z][A-Z0-9_-]{2,63}$/.test(value), `${label} is invalid`);
}

function agentAddress(value, label) {
  assert(typeof value === 'string' && /^[A-Z][A-Z0-9_]{2,63}$/.test(value), `${label} is invalid`);
}

function sha(value, label) {
  assert(typeof value === 'string' && /^[0-9a-f]{40}$/.test(value), `${label} must be a 40-character lowercase Git SHA`);
}

function sha256(value, label) {
  assert(typeof value === 'string' && /^[0-9a-f]{64}$/.test(value), `${label} must be a 64-character lowercase SHA-256`);
}

function rfc3339DateTime(value, label) {
  const match = typeof value === 'string' && /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.exec(value);
  assert(match, `${label} must be a strict RFC 3339 date-time or null`);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const monthDays = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  assert(day <= monthDays[month - 1], `${label} must be a calendar-valid RFC 3339 date-time or null`);
}

function httpsUrl(value, label) {
  assert(typeof value === 'string' && value.startsWith('https://'), `${label} must be a well-formed HTTPS URL or null`);
  assert(RFC3986_ASCII_URI.test(value) && !/%(?![0-9a-fA-F]{2})/.test(value), `${label} must be a well-formed HTTPS URL or null`);
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${label} must be a well-formed HTTPS URL or null`);
  }
  assert(parsed.protocol === 'https:' && parsed.hostname.length > 0, `${label} must be a well-formed HTTPS URL or null`);
}

function portableLocator(value, label) {
  assert(typeof value === 'string' && value.length > 0, `${label} is required`);
  assert(!value.startsWith('/') && !/^[A-Za-z]:[\\/]/.test(value) && !/^file:/i.test(value), `${label} must not be an absolute local path`);
  assert(!value.includes('\\') && !/[\u0000-\u001f\u007f]/.test(value), `${label} must not contain backslashes or control characters`);
  assert(!value.split('/').includes('..'), `${label} must not contain parent traversal segments`);
}

function isContained(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`));
}

function stateSegments(relativePath) {
  assert(!path.isAbsolute(relativePath), `${relativePath} must be relative to the project-agent root`);
  assert(!relativePath.includes('\\'), `${relativePath} must not contain backslashes`);
  const segments = relativePath.split('/');
  assert(segments.every((segment) => segment && segment !== '.' && segment !== '..'), `${relativePath} contains an unsafe path segment`);
  return segments;
}

async function checkedStatePath(relativePath, leafType) {
  const rootInfo = await lstat(ROOT);
  assert(!rootInfo.isSymbolicLink(), 'project-agent root must not be a symlink');
  assert(rootInfo.isDirectory(), 'project-agent root must be a directory');
  const rootReal = await realpath(ROOT);
  const segments = stateSegments(relativePath);
  let cursor = ROOT;
  let leafInfo = null;

  for (const [index, segment] of segments.entries()) {
    cursor = path.join(cursor, segment);
    let info;
    try {
      info = await lstat(cursor);
    } catch (error) {
      if (error.code === 'ENOENT') throw new Error(`state path is missing: ${relativePath}`);
      throw error;
    }
    const component = segments.slice(0, index + 1).join('/');
    assert(!info.isSymbolicLink(), `state path contains a forbidden symlink component: ${component}`);
    if (index < segments.length - 1) assert(info.isDirectory(), `state path component is not a directory: ${component}`);
    const componentReal = await realpath(cursor);
    assert(isContained(rootReal, componentReal), `state path escapes the project-agent root: ${component}`);
    leafInfo = info;
  }

  if (leafType === 'file') assert(leafInfo.isFile(), `state path is not a regular file: ${relativePath}`);
  if (leafType === 'directory') assert(leafInfo.isDirectory(), `state path is not a directory: ${relativePath}`);
  return cursor;
}

async function readCheckedStateFile(relativePath) {
  const filename = await checkedStatePath(relativePath, 'file');
  const flags = constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0);
  let handle;
  try {
    handle = await open(filename, flags);
  } catch (error) {
    throw new Error(`cannot safely open state file ${relativePath}: ${error.message}`);
  }
  try {
    const info = await handle.stat();
    assert(info.isFile(), `state path is not a regular file: ${relativePath}`);
    const bytes = await handle.readFile();
    await checkedStatePath(relativePath, 'file');
    return bytes;
  } finally {
    await handle.close();
  }
}

async function jsonWithBytes(relativePath) {
  const bytes = await readCheckedStateFile(relativePath);
  const raw = bytes.toString('utf8');
  assert(!raw.includes('\r'), `${relativePath} must use LF newlines`);
  return { value: JSON.parse(raw), bytes };
}

async function json(relativePath) {
  return (await jsonWithBytes(relativePath)).value;
}

async function jsonFiles(relativeDirectory) {
  const directory = await checkedStatePath(relativeDirectory, 'directory');
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = [];
  for (const entry of entries) {
    if (!entry.name.endsWith('.json') || entry.name.endsWith('.example.json')) continue;
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    await checkedStatePath(relativePath, 'file');
    paths.push(relativePath);
  }
  await checkedStatePath(relativeDirectory, 'directory');
  return paths.sort();
}

function validateCurrent(value) {
  exactKeys(value, ['schema_version', 'project', 'agent_address', 'default_branch', 'base_sha', 'status', 'active_request_ids', 'last_receipt_id', 'verified_facts', 'next_actions'], 'CURRENT');
  assert(value.schema_version === 'project-agent-current/v1', 'CURRENT schema_version is invalid');
  assert(typeof value.project === 'string' && value.project.length > 0, 'CURRENT project is required');
  agentAddress(value.agent_address, 'CURRENT agent_address');
  assert(typeof value.default_branch === 'string' && value.default_branch.length > 0, 'CURRENT default_branch is required');
  sha(value.base_sha, 'CURRENT base_sha');
  assert(['BOOTSTRAP', 'ACTIVE', 'BLOCKED', 'IDLE'].includes(value.status), 'CURRENT status is invalid');
  stringArray(value.active_request_ids, 'CURRENT active_request_ids');
  assert(new Set(value.active_request_ids).size === value.active_request_ids.length, 'CURRENT active_request_ids must be unique');
  assert(value.last_receipt_id === null || typeof value.last_receipt_id === 'string', 'CURRENT last_receipt_id must be a string or null');
  stringArray(value.verified_facts, 'CURRENT verified_facts');
  stringArray(value.next_actions, 'CURRENT next_actions');
}

function validateRequest(value, filename) {
  exactKeys(value, ['schema_version', 'request_id', 'addressed_to', 'created_by', 'source', 'intent', 'scope', 'acceptance', 'authority', 'dependencies', 'evidence_required', 'status'], filename);
  assert(value.schema_version === 'project-agent-request/v1', `${filename} schema_version is invalid`);
  id(value.request_id, `${filename} request_id`);
  agentAddress(value.addressed_to, `${filename} addressed_to`);
  assert(path.basename(filename, '.json') === value.request_id, `${filename} must be named ${value.request_id}.json`);
  assert(typeof value.created_by === 'string' && value.created_by.length > 0, `${filename} created_by is required`);
  exactKeys(value.source, ['kind', 'locator', 'revision'], `${filename} source`);
  assert(['human', 'agent', 'repository'].includes(value.source.kind), `${filename} source.kind is invalid`);
  assert(typeof value.source.locator === 'string' && value.source.locator.length > 0, `${filename} source.locator is required`);
  assert(value.source.revision === null || typeof value.source.revision === 'string', `${filename} source.revision must be a string or null`);
  assert(typeof value.intent === 'string' && value.intent.length > 0, `${filename} intent is required`);
  exactKeys(value.scope, ['allowed', 'forbidden'], `${filename} scope`);
  stringArray(value.scope.allowed, `${filename} scope.allowed`, { nonEmpty: true });
  stringArray(value.scope.forbidden, `${filename} scope.forbidden`);
  stringArray(value.acceptance, `${filename} acceptance`, { nonEmpty: true });
  exactKeys(value.authority, ['actions', 'expires_at'], `${filename} authority`);
  stringArray(value.authority.actions, `${filename} authority.actions`);
  if (value.authority.expires_at !== null) rfc3339DateTime(value.authority.expires_at, `${filename} authority.expires_at`);
  stringArray(value.dependencies, `${filename} dependencies`);
  stringArray(value.evidence_required, `${filename} evidence_required`);
  assert(['OPEN', 'CLAIMED', 'BLOCKED', 'COMPLETE', 'CANCELLED'].includes(value.status), `${filename} status is invalid`);
}

function validateContact(value, filename) {
  exactKeys(value, ['schema_version', 'contact_id', 'source', 'addressed_to', 'purpose', 'related_request_id', 'claims', 'evidence', 'authority_transfer', 'private_memory_transfer', 'credential_transfer'], filename);
  assert(value.schema_version === 'project-agent-contact/v1', `${filename} schema_version is invalid`);
  id(value.contact_id, `${filename} contact_id`);
  assert(path.basename(filename, '.json') === value.contact_id, `${filename} must be named ${value.contact_id}.json`);
  exactKeys(value.source, ['project', 'agent_address', 'repository', 'head_sha', 'current_state_sha256'], `${filename} source`);
  assert(typeof value.source.project === 'string' && value.source.project.length > 0, `${filename} source.project is required`);
  agentAddress(value.source.agent_address, `${filename} source.agent_address`);
  portableLocator(value.source.repository, `${filename} source.repository`);
  sha(value.source.head_sha, `${filename} source.head_sha`);
  sha256(value.source.current_state_sha256, `${filename} source.current_state_sha256`);
  agentAddress(value.addressed_to, `${filename} addressed_to`);
  assert(typeof value.purpose === 'string' && value.purpose.length > 0, `${filename} purpose is required`);
  assert(value.related_request_id === null || (typeof value.related_request_id === 'string' && /^[A-Z][A-Z0-9_-]{2,63}$/.test(value.related_request_id)), `${filename} related_request_id is invalid`);

  assert(Array.isArray(value.claims) && value.claims.length > 0, `${filename} claims must be a non-empty array`);
  uniqueItems(value.claims, `${filename} claims`);
  for (const [index, claim] of value.claims.entries()) {
    exactKeys(claim, ['claim_id', 'statement', 'evidence_ids'], `${filename} claims[${index}]`);
    id(claim.claim_id, `${filename} claims[${index}].claim_id`);
    assert(typeof claim.statement === 'string' && claim.statement.length > 0, `${filename} claims[${index}].statement is required`);
    stringArray(claim.evidence_ids, `${filename} claims[${index}].evidence_ids`, { nonEmpty: true });
    uniqueItems(claim.evidence_ids, `${filename} claims[${index}].evidence_ids`);
    for (const evidenceId of claim.evidence_ids) id(evidenceId, `${filename} claims[${index}].evidence_ids item`);
  }

  assert(Array.isArray(value.evidence) && value.evidence.length > 0, `${filename} evidence must be a non-empty array`);
  uniqueItems(value.evidence, `${filename} evidence`);
  for (const [index, evidence] of value.evidence.entries()) {
    exactKeys(evidence, ['evidence_id', 'kind', 'locator', 'digest'], `${filename} evidence[${index}]`);
    id(evidence.evidence_id, `${filename} evidence[${index}].evidence_id`);
    assert(['git', 'file', 'test', 'pull_request', 'issue', 'other'].includes(evidence.kind), `${filename} evidence[${index}].kind is invalid`);
    portableLocator(evidence.locator, `${filename} evidence[${index}].locator`);
    assert(evidence.digest === null || (typeof evidence.digest === 'string' && /^(git:[0-9a-f]{40}|sha256:[0-9a-f]{64})$/.test(evidence.digest)), `${filename} evidence[${index}].digest is invalid`);
  }

  const claimIds = value.claims.map((claim) => claim.claim_id);
  assert(new Set(claimIds).size === claimIds.length, `${filename} claim_id values must be unique`);
  const evidenceIds = value.evidence.map((item) => item.evidence_id);
  assert(new Set(evidenceIds).size === evidenceIds.length, `${filename} evidence_id values must be unique`);
  const declaredEvidence = new Set(evidenceIds);
  for (const claim of value.claims) {
    for (const evidenceId of claim.evidence_ids) {
      assert(declaredEvidence.has(evidenceId), `${filename} claim ${claim.claim_id} references missing evidence ${evidenceId}`);
    }
  }

  assert(value.authority_transfer === false, `${filename} authority_transfer must be false`);
  assert(value.private_memory_transfer === false, `${filename} private_memory_transfer must be false`);
  assert(value.credential_transfer === false, `${filename} credential_transfer must be false`);
}

function validateReceipt(value, filename) {
  exactKeys(value, ['schema_version', 'receipt_id', 'request_id', 'actor', 'result', 'summary', 'classification', 'changes', 'tests', 'head_sha', 'pull_request_url', 'next_request'], filename);
  assert(value.schema_version === 'project-agent-receipt/v1', `${filename} schema_version is invalid`);
  id(value.receipt_id, `${filename} receipt_id`);
  id(value.request_id, `${filename} request_id`);
  assert(path.basename(filename, '.json') === value.receipt_id, `${filename} must be named ${value.receipt_id}.json`);
  assert(typeof value.actor === 'string' && value.actor.length > 0, `${filename} actor is required`);
  assert(['COMPLETE', 'PARTIAL', 'BLOCKED', 'NO_MATERIAL_DELTA'].includes(value.result), `${filename} result is invalid`);
  assert(typeof value.summary === 'string' && value.summary.length > 0, `${filename} summary is required`);
  assert(CLASSIFICATIONS.has(value.classification), `${filename} classification is invalid`);
  stringArray(value.changes, `${filename} changes`);
  assert(Array.isArray(value.tests), `${filename} tests must be an array`);
  for (const [index, test] of value.tests.entries()) {
    exactKeys(test, ['command', 'result'], `${filename} tests[${index}]`);
    assert(typeof test.command === 'string' && test.command.length > 0, `${filename} tests[${index}].command is required`);
    assert(['PASS', 'FAIL', 'NOT_RUN'].includes(test.result), `${filename} tests[${index}].result is invalid`);
  }
  sha(value.head_sha, `${filename} head_sha`);
  if (value.pull_request_url !== null) httpsUrl(value.pull_request_url, `${filename} pull_request_url`);
  assert(value.next_request === null || typeof value.next_request === 'string', `${filename} next_request must be a string or null`);
}

export async function loadAndValidate() {
  const currentDocument = await jsonWithBytes('agent/CURRENT.json');
  const current = currentDocument.value;
  validateCurrent(current);

  const contactPaths = await jsonFiles('agent/contacts');
  const requestPaths = await jsonFiles('agent/requests');
  const receiptPaths = await jsonFiles('agent/receipts');
  const requests = new Map();
  const receipts = new Map();
  const contacts = new Map();

  for (const contactPath of contactPaths) {
    const value = await json(contactPath);
    validateContact(value, contactPath);
    assert(value.addressed_to === current.agent_address, `${contactPath} addresses another agent`);
    assert(!contacts.has(value.contact_id), `duplicate contact_id ${value.contact_id}`);
    contacts.set(value.contact_id, value);
  }

  for (const requestPath of requestPaths) {
    const value = await json(requestPath);
    validateRequest(value, requestPath);
    assert(!requests.has(value.request_id), `duplicate request_id ${value.request_id}`);
    requests.set(value.request_id, value);
  }

  for (const receiptPath of receiptPaths) {
    const value = await json(receiptPath);
    validateReceipt(value, receiptPath);
    assert(!receipts.has(value.receipt_id), `duplicate receipt_id ${value.receipt_id}`);
    assert(requests.has(value.request_id), `${receiptPath} references missing request ${value.request_id}`);
    receipts.set(value.receipt_id, value);
  }

  for (const requestId of current.active_request_ids) {
    assert(requests.has(requestId), `CURRENT references missing request ${requestId}`);
    assert(['OPEN', 'CLAIMED', 'BLOCKED'].includes(requests.get(requestId).status), `CURRENT request ${requestId} is not active`);
    assert(requests.get(requestId).addressed_to === current.agent_address, `CURRENT request ${requestId} addresses another agent`);
  }

  if (current.last_receipt_id !== null) {
    assert(receipts.has(current.last_receipt_id), `CURRENT references missing receipt ${current.last_receipt_id}`);
  }

  return { current, currentBytes: currentDocument.bytes, contacts, requests, receipts };
}

function gitEnvironment() {
  const environment = { ...process.env };
  for (const key of Object.keys(environment)) {
    if (/^GIT_CONFIG_(?:KEY|VALUE)_\d+$/.test(key) || /^GIT_TRACE/.test(key)) delete environment[key];
  }
  for (const key of [
    'GIT_CONFIG_PARAMETERS',
    'GIT_EXTERNAL_DIFF',
    'GIT_EDITOR',
    'GIT_SEQUENCE_EDITOR',
    'GIT_SSH',
    'GIT_SSH_COMMAND',
    'GIT_ASKPASS',
    'SSH_ASKPASS',
    'GIT_DIR',
    'GIT_WORK_TREE',
    'GIT_COMMON_DIR',
    'GIT_INDEX_FILE',
    'GIT_OBJECT_DIRECTORY',
    'GIT_ALTERNATE_OBJECT_DIRECTORIES',
    'GIT_EXEC_PATH',
    'GIT_NAMESPACE',
    'GIT_REPLACE_REF_BASE',
    'GIT_SHALLOW_FILE',
    'GIT_GRAFT_FILE',
  ]) delete environment[key];
  const nullDevice = process.platform === 'win32' ? 'NUL' : '/dev/null';
  return {
    ...environment,
    GIT_CONFIG_COUNT: '0',
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_SYSTEM: nullDevice,
    GIT_CONFIG_GLOBAL: nullDevice,
    GIT_NO_LAZY_FETCH: '1',
    GIT_OPTIONAL_LOCKS: '0',
    GIT_TERMINAL_PROMPT: '0',
    GIT_PAGER: '',
  };
}

function git(args) {
  const nullDevice = process.platform === 'win32' ? 'NUL' : '/dev/null';
  const result = spawnSync('git', [
    '-c', 'core.fsmonitor=false',
    '-c', `core.hooksPath=${nullDevice}`,
    '-c', 'protocol.allow=never',
    '-c', 'protocol.ext.allow=never',
    '-C', ROOT,
    ...args,
  ], {
    env: gitEnvironment(),
    encoding: 'utf8',
  });
  assert(result.status === 0, result.stderr.trim() || `git ${args.join(' ')} failed`);
  return result.stdout.trim();
}

function wakeReceipt(state) {
  const worktreeRoot = realpathSync(git(['rev-parse', '--show-toplevel']));
  assert(realpathSync(ROOT) === worktreeRoot, 'project-agent root must be the exact Git worktree root');
  const branchValue = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  return {
    schema_version: 'project-agent-wake/v1',
    receipt_type: 'AUTHORITY_INERT',
    ready: true,
    project: state.current.project,
    agent_address: state.current.agent_address,
    repository: {
      branch: branchValue === 'HEAD' ? null : branchValue,
      head_sha: git(['rev-parse', 'HEAD']),
      dirty: git(['status', '--porcelain=v1', '--untracked-files=all']).length > 0,
    },
    current_state: {
      path: 'agent/CURRENT.json',
      sha256: createHash('sha256').update(state.currentBytes).digest('hex'),
    },
    validated: {
      contacts: state.contacts.size,
      requests: state.requests.size,
      receipts: state.receipts.size,
    },
    authority_granted: false,
    private_memory_transferred: false,
    credentials_transferred: false,
  };
}

async function main() {
  const command = process.argv[2] ?? 'check';
  const options = process.argv.slice(3);
  assert(['check', 'status', 'wake'].includes(command), 'usage: project-agent.mjs [check|status|wake --json]');
  if (command === 'wake') {
    assert(options.length === 1 && options[0] === '--json', 'wake requires exactly --json');
  } else {
    assert(options.length === 0, `${command} accepts no options`);
  }
  const state = await loadAndValidate();
  if (command === 'check') {
    console.log(`PROJECT_AGENT_OK project=${state.current.project} contacts=${state.contacts.size} requests=${state.requests.size} receipts=${state.receipts.size}`);
    return;
  }
  if (command === 'wake') {
    console.log(JSON.stringify(wakeReceipt(state), null, 2));
    return;
  }
  console.log(`project: ${state.current.project}`);
  console.log(`agent: ${state.current.agent_address}`);
  console.log(`status: ${state.current.status}`);
  console.log(`base: ${state.current.default_branch}@${state.current.base_sha}`);
  console.log(`active requests: ${state.current.active_request_ids.length ? state.current.active_request_ids.join(', ') : 'none'}`);
  for (const requestId of state.current.active_request_ids) {
    console.log(`- ${requestId}: ${state.requests.get(requestId).intent}`);
  }
}

if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  main().catch((error) => {
    console.error(`PROJECT_AGENT_BLOCKED ${error.message}`);
    process.exitCode = 1;
  });
}
