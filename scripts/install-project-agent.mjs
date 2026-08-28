#!/usr/bin/env node

import { access, cp, mkdir, readFile, realpath, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const FRAMEWORK_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE_ROOT = path.join(FRAMEWORK_ROOT, 'templates/project-agent');
const FILES = [
  'AGENTS.md',
  'CLAUDE.md',
  'agent/WAKE.md',
  'agent/CURRENT.json',
  'agent/requests/README.md',
  'agent/requests/REQUEST.example.json',
  'agent/receipts/README.md',
  'agent/receipts/RECEIPT.example.json',
  'agent/handoffs/HANDOFF.example.md',
  'schemas/current.schema.json',
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
  const values = { apply: false };
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item === '--apply') {
      values.apply = true;
      continue;
    }
    if (!['--target', '--project', '--agent', '--default-branch'].includes(item)) {
      fail(`unknown argument ${item}`);
    }
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) fail(`${item} requires a value`);
    values[item.slice(2).replace('-', '_')] = value;
    index += 1;
  }
  if (!values.target || !values.project || !values.agent) {
    fail('usage: install-project-agent.mjs --target PATH --project NAME --agent ADDRESS [--default-branch BRANCH] [--apply]');
  }
  if (!/^[A-Z][A-Z0-9_]{2,63}$/.test(values.agent)) {
    fail('--agent must match ^[A-Z][A-Z0-9_]{2,63}$');
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

function git(target, args) {
  const result = spawnSync('git', ['-C', target, ...args], { encoding: 'utf8' });
  if (result.status !== 0) fail(result.stderr.trim() || `git ${args.join(' ')} failed`);
  return result.stdout.trim();
}

function instantiate(raw, values) {
  return raw
    .replaceAll('EXAMPLE_PROJECT_AGENT', values.agent)
    .replaceAll('EXAMPLE_PROJECT', values.project)
    .replaceAll('0000000000000000000000000000000000000000', values.base_sha)
    .replace('"default_branch": "main"', `"default_branch": ${JSON.stringify(values.default_branch)}`);
}

async function main() {
  const values = parseArgs(process.argv.slice(2));
  const requestedTarget = path.resolve(values.target);
  if (!(await exists(requestedTarget))) fail('target does not exist');
  const target = await realpath(requestedTarget);
  const worktreeRoot = await realpath(git(target, ['rev-parse', '--show-toplevel']));
  if (target !== worktreeRoot) fail('target must be the exact Git worktree root');
  values.base_sha = git(target, ['rev-parse', 'HEAD']);
  values.default_branch = values.default_branch ?? (git(target, ['branch', '--show-current']) || 'main');

  const collisions = [];
  for (const relative of FILES) {
    if (await exists(path.join(target, relative))) collisions.push(relative);
  }
  if (collisions.length) fail(`refusing to overwrite: ${collisions.join(', ')}`);

  console.log(`target: ${target}`);
  console.log(`project: ${values.project}`);
  console.log(`agent: ${values.agent}`);
  console.log(`base: ${values.default_branch}@${values.base_sha}`);
  for (const relative of FILES) console.log(`${values.apply ? 'create' : 'would create'}: ${relative}`);
  if (!values.apply) {
    console.log('DRY_RUN_NO_WRITES rerun with --apply after reviewing this exact plan');
    return;
  }

  for (const relative of FILES) {
    const source = path.join(TEMPLATE_ROOT, relative);
    const destination = path.join(target, relative);
    await mkdir(path.dirname(destination), { recursive: true });
    const raw = await readFile(source, 'utf8');
    await writeFile(destination, instantiate(raw, values), 'utf8');
  }
  console.log('PROJECT_AGENT_INSTALLED');
}

main().catch((error) => fail(error.message));
