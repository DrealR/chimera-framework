#!/usr/bin/env node

import {
  access,
  lstat,
  mkdir,
  mkdtemp,
  open,
  readFile,
  realpath,
  rm,
  rmdir,
  unlink,
  writeFile,
} from 'node:fs/promises';
import { constants } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const FRAMEWORK_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE_ROOT = path.join(FRAMEWORK_ROOT, 'templates/project-agent');
const FILES = [
  'AGENTS.md',
  'CLAUDE.md',
  'agent/ENTRY.md',
  'agent/WAKE.md',
  'agent/CURRENT.json',
  'agent/contacts/README.md',
  'agent/contacts/CONTACT.example.json',
  'agent/requests/README.md',
  'agent/requests/REQUEST.example.json',
  'agent/receipts/README.md',
  'agent/receipts/RECEIPT.example.json',
  'agent/handoffs/HANDOFF.example.md',
  'schemas/current.schema.json',
  'schemas/contact.schema.json',
  'schemas/request.schema.json',
  'schemas/receipt.schema.json',
  'scripts/project-agent.mjs',
  'tests/project-agent.test.mjs',
  '.github/PULL_REQUEST_TEMPLATE.md',
];

function fail(message) {
  console.error(`PROJECT_AGENT_INSTALL_BLOCKED ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const values = { apply: false, mode: 'pollinate' };
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === '--apply') {
      values.apply = true;
      continue;
    }
    if (!['--mode', '--target', '--project', '--agent', '--default-branch', '--expected-head', '--expected-current-sha256'].includes(item)) {
      fail(`unknown argument ${item}`);
    }
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) fail(`${item} requires a value`);
    values[item.slice(2).replaceAll('-', '_')] = value;
    index += 1;
  }
  if (!values.target || !values.project || !values.agent) {
    fail('usage: install-project-agent.mjs [--mode pollinate|rebind] --target PATH --project NAME --agent ADDRESS [--default-branch BRANCH] [--expected-head SHA] [--expected-current-sha256 SHA256] [--apply]');
  }
  if (!['pollinate', 'rebind'].includes(values.mode)) {
    fail('--mode must be pollinate or rebind');
  }
  if (!/^[A-Z][A-Z0-9_]{2,63}$/.test(values.agent)) {
    fail('--agent must match ^[A-Z][A-Z0-9_]{2,63}$');
  }
  if (values.mode === 'rebind' && values.apply) {
    fail('REBIND forbids --apply; it is read-only');
  }
  if (values.mode === 'rebind' && values.default_branch) {
    fail('REBIND does not accept --default-branch; it verifies existing state');
  }
  if (values.mode === 'pollinate' && (values.expected_head || values.expected_current_sha256)) {
    fail('POLLINATE does not accept REBIND lineage expectations');
  }
  if (values.expected_head && !/^[0-9a-f]{40}$/.test(values.expected_head)) {
    fail('--expected-head must be a 40-character lowercase Git SHA');
  }
  if (values.expected_current_sha256 && !/^[0-9a-f]{64}$/.test(values.expected_current_sha256)) {
    fail('--expected-current-sha256 must be a 64-character lowercase SHA-256');
  }
  return values;
}

async function exists(target) {
  try {
    await access(target, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function lstatIfPresent(target) {
  try {
    return await lstat(target);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function isContained(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`));
}

function relativeSegments(relative) {
  if (path.isAbsolute(relative) || relative.includes('\\') || relative.split('/').some((part) => !part || part === '.' || part === '..')) {
    throw new Error(`unsafe installer path ${relative}`);
  }
  return relative.split('/');
}

async function inspectContainedPath(root, relative, { requireLeaf = false, leafType = null } = {}) {
  const rootReal = await realpath(root);
  let cursor = root;
  let leafStat = null;
  const segments = relativeSegments(relative);

  for (const [index, segment] of segments.entries()) {
    cursor = path.join(cursor, segment);
    const info = await lstatIfPresent(cursor);
    if (!info) {
      if (requireLeaf) throw new Error(`missing path ${relative}`);
      return { exists: false, path: cursor, stat: null };
    }
    const component = segments.slice(0, index + 1).join('/');
    if (info.isSymbolicLink()) throw new Error(`symlink component is forbidden: ${component}`);
    if (index < segments.length - 1 && !info.isDirectory()) {
      throw new Error(`non-directory path component is forbidden: ${component}`);
    }
    const componentReal = await realpath(cursor);
    if (!isContained(rootReal, componentReal)) throw new Error(`path escapes the target worktree: ${component}`);
    leafStat = info;
  }

  if (leafType === 'file' && !leafStat.isFile()) throw new Error(`path is not a regular file: ${relative}`);
  if (leafType === 'directory' && !leafStat.isDirectory()) throw new Error(`path is not a directory: ${relative}`);
  return { exists: true, path: cursor, stat: leafStat };
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

function runGit(target, args) {
  const nullDevice = process.platform === 'win32' ? 'NUL' : '/dev/null';
  return spawnSync('git', [
    '-c', 'core.fsmonitor=false',
    '-c', `core.hooksPath=${nullDevice}`,
    '-c', 'protocol.allow=never',
    '-c', 'protocol.ext.allow=never',
    '-C', target,
    ...args,
  ], {
    env: gitEnvironment(),
    encoding: 'utf8',
  });
}

function git(target, args) {
  const result = runGit(target, args);
  if (result.status !== 0) fail(result.stderr.trim() || `git ${args.join(' ')} failed`);
  return result.stdout.trim();
}

function tryGit(target, args) {
  const result = runGit(target, args);
  return result.status === 0 ? result.stdout.trim() : null;
}

function canonicalProjectAgent(target, args) {
  // REBIND validates target state with this framework's trusted, read-only
  // validator. It never executes JavaScript controlled by the target worktree.
  const script = path.join(TEMPLATE_ROOT, 'scripts/project-agent.mjs');
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: target,
    env: { ...gitEnvironment(), PROJECT_AGENT_ROOT: target },
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    fail(`REBIND existing surface ${args.join(' ')} failed: ${result.stderr.trim() || result.stdout.trim() || 'unknown error'}`);
  }
  return result.stdout.trim();
}

function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function instantiate(relative, raw, values) {
  if (relative === 'agent/CURRENT.json') {
    const document = JSON.parse(raw);
    document.project = values.project;
    document.agent_address = values.agent;
    document.default_branch = values.default_branch;
    document.base_sha = values.base_sha;
    return formatJson(document);
  }
  if (relative === 'agent/requests/REQUEST.example.json') {
    const document = JSON.parse(raw);
    document.addressed_to = values.agent;
    return formatJson(document);
  }
  if (relative === 'agent/contacts/CONTACT.example.json') {
    const document = JSON.parse(raw);
    document.addressed_to = values.agent;
    return formatJson(document);
  }
  if (relative === 'agent/receipts/RECEIPT.example.json') {
    const document = JSON.parse(raw);
    document.head_sha = values.base_sha;
    return formatJson(document);
  }
  if (relative === 'agent/handoffs/HANDOFF.example.md') {
    return raw
      .replace('- Addressed agent: `EXAMPLE_PROJECT_AGENT`', `- Addressed agent: \`${values.agent}\``)
      .replace('- Verified base: `0000000000000000000000000000000000000000`', `- Verified base: \`${values.base_sha}\``)
      .replace('- Exact head: `0000000000000000000000000000000000000000`', `- Exact head: \`${values.base_sha}\``);
  }
  if (relative === '.github/PULL_REQUEST_TEMPLATE.md') {
    return raw.replace(
      '## Addressed project agent\n\n`EXAMPLE_PROJECT_AGENT`',
      `## Addressed project agent\n\n\`${values.agent}\``,
    );
  }
  return raw;
}

function validateBranchName(target, branch) {
  if (tryGit(target, ['check-ref-format', '--branch', branch]) === null) {
    fail(`invalid default branch ${JSON.stringify(branch)}`);
  }
}

function exactCommit(target, ref) {
  return tryGit(target, ['rev-parse', '--verify', `${ref}^{commit}`]);
}

function resolvePollinateBase(target, requestedBranch) {
  if (requestedBranch) {
    validateBranchName(target, requestedBranch);
    const baseSha = exactCommit(target, `refs/remotes/origin/${requestedBranch}`)
      ?? exactCommit(target, `refs/heads/${requestedBranch}`);
    if (!baseSha) fail(`default branch ref is unavailable: ${requestedBranch}`);
    return { defaultBranch: requestedBranch, baseSha };
  }

  const originHead = tryGit(target, ['symbolic-ref', '--quiet', '--short', 'refs/remotes/origin/HEAD']);
  if (originHead?.startsWith('origin/')) {
    const defaultBranch = originHead.slice('origin/'.length);
    validateBranchName(target, defaultBranch);
    const baseSha = exactCommit(target, 'refs/remotes/origin/HEAD');
    if (baseSha) return { defaultBranch, baseSha };
  }

  const currentBranch = tryGit(target, ['branch', '--show-current']);
  if (!currentBranch) fail('cannot infer a default branch from origin/HEAD or the current branch; pass --default-branch');
  validateBranchName(target, currentBranch);
  const baseSha = exactCommit(target, `refs/heads/${currentBranch}`);
  if (!baseSha) fail(`current branch ref is unavailable: ${currentBranch}`);
  return { defaultBranch: currentBranch, baseSha };
}

async function stageSurface(values) {
  const staging = await mkdtemp(path.join(tmpdir(), 'project-agent-stage-'));
  try {
    for (const relative of FILES) {
      const source = path.join(TEMPLATE_ROOT, relative);
      const destination = path.join(staging, ...relative.split('/'));
      await mkdir(path.dirname(destination), { recursive: true });
      const raw = await readFile(source, 'utf8');
      await writeFile(destination, instantiate(relative, raw, values), { encoding: 'utf8', flag: 'wx' });
    }
    return staging;
  } catch (error) {
    await rm(staging, { recursive: true, force: true });
    throw error;
  }
}

async function rollbackInstall(createdFiles, createdDirectories) {
  const errors = [];
  for (const filename of [...createdFiles].reverse()) {
    try {
      await unlink(filename);
    } catch (error) {
      if (error.code !== 'ENOENT') errors.push(`${path.basename(filename)}: ${error.message}`);
    }
  }
  for (const directory of [...createdDirectories].reverse()) {
    try {
      await rmdir(directory);
    } catch (error) {
      if (!['ENOENT', 'ENOTEMPTY'].includes(error.code)) errors.push(`${path.basename(directory)}: ${error.message}`);
    }
  }
  return errors;
}

async function commitStagedSurface(target, staging) {
  const createdFiles = [];
  const createdDirectories = [];
  const directories = [...new Set(FILES
    .map((relative) => path.posix.dirname(relative))
    .filter((relative) => relative !== '.'))]
    .sort((left, right) => left.split('/').length - right.split('/').length || left.localeCompare(right));
  const injectedFailureAfter = process.env.PROJECT_AGENT_INSTALL_TEST_FAIL_AFTER
    ? Number(process.env.PROJECT_AGENT_INSTALL_TEST_FAIL_AFTER)
    : null;
  const injectedCollisionAt = process.env.PROJECT_AGENT_INSTALL_TEST_COLLIDE_AT
    ? Number(process.env.PROJECT_AGENT_INSTALL_TEST_COLLIDE_AT)
    : null;
  if (injectedFailureAfter !== null && (!Number.isSafeInteger(injectedFailureAfter) || injectedFailureAfter < 1)) {
    throw new Error('PROJECT_AGENT_INSTALL_TEST_FAIL_AFTER must be a positive integer');
  }
  if (injectedCollisionAt !== null && (!Number.isSafeInteger(injectedCollisionAt) || injectedCollisionAt < 1)) {
    throw new Error('PROJECT_AGENT_INSTALL_TEST_COLLIDE_AT must be a positive integer');
  }

  try {
    for (const relative of directories) {
      const inspection = await inspectContainedPath(target, relative);
      if (inspection.exists) {
        if (!inspection.stat.isDirectory()) throw new Error(`installation directory is not a directory: ${relative}`);
        continue;
      }
      const directory = path.join(target, ...relative.split('/'));
      await mkdir(directory);
      createdDirectories.push(directory);
      await inspectContainedPath(target, relative, { requireLeaf: true, leafType: 'directory' });
    }

    for (const relative of FILES) {
      const parent = path.posix.dirname(relative);
      if (parent !== '.') await inspectContainedPath(target, parent, { requireLeaf: true, leafType: 'directory' });
      const inspection = await inspectContainedPath(target, relative);
      if (inspection.exists) throw new Error(`refusing to overwrite: ${relative}`);

      const destination = path.join(target, ...relative.split('/'));
      const source = path.join(staging, ...relative.split('/'));
      const flags = constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | (constants.O_NOFOLLOW ?? 0);
      if (injectedCollisionAt === createdFiles.length + 1) {
        const collisionHandle = await open(destination, flags, 0o666);
        try {
          await collisionHandle.writeFile('injected concurrent collision\n');
        } finally {
          await collisionHandle.close();
        }
      }
      const handle = await open(destination, flags, 0o666);
      createdFiles.push(destination);
      try {
        await handle.writeFile(await readFile(source));
      } finally {
        await handle.close();
      }
      await inspectContainedPath(target, relative, { requireLeaf: true, leafType: 'file' });
      if (injectedFailureAfter === createdFiles.length) throw new Error('injected installation failure');
    }
  } catch (error) {
    const rollbackErrors = await rollbackInstall(createdFiles, createdDirectories);
    const suffix = rollbackErrors.length ? `; rollback incomplete: ${rollbackErrors.join('; ')}` : '';
    throw new Error(`POLLINATE installation rolled back: ${error.message}${suffix}`);
  }
}

async function main() {
  const values = parseArgs(process.argv.slice(2));
  const requestedTarget = path.resolve(values.target);
  if (!(await exists(requestedTarget))) fail('target does not exist');
  const target = await realpath(requestedTarget);
  const worktreeRoot = await realpath(git(target, ['rev-parse', '--show-toplevel']));
  if (target !== worktreeRoot) fail('target must be the exact Git worktree root');
  const objectFormat = tryGit(target, ['rev-parse', '--show-object-format']);
  if (objectFormat !== 'sha1') {
    fail(`unsupported Git object format ${JSON.stringify(objectFormat ?? 'unknown')}; project-agent v2 requires sha1`);
  }

  if (values.mode === 'rebind') {
    for (const relative of FILES) {
      try {
        await inspectContainedPath(target, relative, { requireLeaf: true, leafType: 'file' });
      } catch (error) {
        fail(`REBIND missing existing surface file or found unsafe path ${relative}: ${error.message}`);
      }
    }
    canonicalProjectAgent(target, ['check']);
    const wakeOutput = canonicalProjectAgent(target, ['wake', '--json']);
    let wake;
    try {
      wake = JSON.parse(wakeOutput);
    } catch {
      fail('REBIND existing surface wake --json did not return JSON');
    }
    if (wake.project !== values.project) {
      fail(`REBIND project mismatch: expected ${JSON.stringify(values.project)}, found ${JSON.stringify(wake.project)}`);
    }
    if (wake.agent_address !== values.agent) {
      fail(`REBIND agent mismatch: expected ${values.agent}, found ${String(wake.agent_address)}`);
    }
    if (wake.ready !== true) fail('REBIND wake receipt is not ready');
    if (values.expected_head && wake.repository.head_sha !== values.expected_head) {
      fail(`REBIND head mismatch: expected ${values.expected_head}, found ${wake.repository.head_sha}`);
    }
    if (values.expected_current_sha256 && wake.current_state.sha256 !== values.expected_current_sha256) {
      fail(`REBIND current-state hash mismatch: expected ${values.expected_current_sha256}, found ${wake.current_state.sha256}`);
    }
    const verificationScope = values.expected_head || values.expected_current_sha256
      ? 'EXPECTED_LOCAL_STATE_VERIFIED'
      : 'LOCAL_STATE_ONLY';
    console.log('mode: REBIND');
    console.log('boundary: reconnects only to this verified existing project role; creates, copies, and overwrites nothing; transfers no identity, private memory, credentials, current state, or authority');
    console.log(`PROJECT_AGENT_REBIND_READY ${JSON.stringify({ verification_scope: verificationScope, ...wake })}`);
    return;
  }

  const base = resolvePollinateBase(target, values.default_branch);
  values.base_sha = base.baseSha;
  values.default_branch = base.defaultBranch;

  const collisions = [];
  for (const relative of FILES) {
    let inspection;
    try {
      inspection = await inspectContainedPath(target, relative);
    } catch (error) {
      fail(`POLLINATE unsafe destination ${relative}: ${error.message}`);
    }
    if (inspection.exists) collisions.push(relative);
  }
  if (collisions.length) fail(`refusing to overwrite: ${collisions.join(', ')}`);

  console.log('mode: POLLINATE');
  console.log('boundary: creates a new project-native agent role; imports no donor-agent, donor-human, or other-project identity, private memory, credentials, authority, or current state');
  console.log(`target: ${target}`);
  console.log(`project: ${values.project}`);
  console.log(`agent: ${values.agent}`);
  console.log(`base: ${values.default_branch}@${values.base_sha}`);
  for (const relative of FILES) console.log(`${values.apply ? 'create' : 'would create'}: ${relative}`);
  if (!values.apply) {
    console.log('DRY_RUN_NO_WRITES rerun with --apply after reviewing this exact plan');
    return;
  }

  const staging = await stageSurface(values);
  try {
    await commitStagedSurface(target, staging);
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
  console.log('PROJECT_AGENT_INSTALLED');
}

main().catch((error) => fail(error.message));
