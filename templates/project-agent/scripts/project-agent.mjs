#!/usr/bin/env node

import { readFile, readdir } from 'node:fs/promises';
import { realpathSync } from 'node:fs';
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

function id(value, label) {
  assert(typeof value === 'string' && /^[A-Z][A-Z0-9_-]{2,63}$/.test(value), `${label} is invalid`);
}

function sha(value, label) {
  assert(typeof value === 'string' && /^[0-9a-f]{40}$/.test(value), `${label} must be a 40-character lowercase Git SHA`);
}

async function json(relativePath) {
  const raw = await readFile(path.join(ROOT, relativePath), 'utf8');
  assert(!raw.includes('\r'), `${relativePath} must use LF newlines`);
  return JSON.parse(raw);
}

async function jsonFiles(relativeDirectory) {
  const directory = path.join(ROOT, relativeDirectory);
  const entries = await readdir(directory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json') && !entry.name.endsWith('.example.json'))
    .map((entry) => path.join(relativeDirectory, entry.name))
    .sort();
}

function validateCurrent(value) {
  exactKeys(value, ['schema_version', 'project', 'agent_address', 'default_branch', 'base_sha', 'status', 'active_request_ids', 'last_receipt_id', 'verified_facts', 'next_actions'], 'CURRENT');
  assert(value.schema_version === 'project-agent-current/v1', 'CURRENT schema_version is invalid');
  assert(typeof value.project === 'string' && value.project.length > 0, 'CURRENT project is required');
  id(value.agent_address, 'CURRENT agent_address');
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
  id(value.addressed_to, `${filename} addressed_to`);
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
  assert(value.authority.expires_at === null || !Number.isNaN(Date.parse(value.authority.expires_at)), `${filename} authority.expires_at is invalid`);
  stringArray(value.dependencies, `${filename} dependencies`);
  stringArray(value.evidence_required, `${filename} evidence_required`);
  assert(['OPEN', 'CLAIMED', 'BLOCKED', 'COMPLETE', 'CANCELLED'].includes(value.status), `${filename} status is invalid`);
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
  assert(value.pull_request_url === null || /^https:\/\//.test(value.pull_request_url), `${filename} pull_request_url must be HTTPS or null`);
  assert(value.next_request === null || typeof value.next_request === 'string', `${filename} next_request must be a string or null`);
}

export async function loadAndValidate() {
  const current = await json('agent/CURRENT.json');
  validateCurrent(current);

  const requestPaths = await jsonFiles('agent/requests');
  const receiptPaths = await jsonFiles('agent/receipts');
  const requests = new Map();
  const receipts = new Map();

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

  return { current, requests, receipts };
}

async function main() {
  const command = process.argv[2] ?? 'check';
  assert(['check', 'status'].includes(command), 'usage: project-agent.mjs [check|status]');
  const state = await loadAndValidate();
  if (command === 'check') {
    console.log(`PROJECT_AGENT_OK project=${state.current.project} requests=${state.requests.size} receipts=${state.receipts.size}`);
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
