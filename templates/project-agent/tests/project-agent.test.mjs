import assert from 'node:assert/strict';
import { mkdtemp, cp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(ROOT, 'scripts/project-agent.mjs');

function run(root, command = 'check') {
  return spawnSync(process.execPath, [CLI, command], {
    cwd: root,
    env: { ...process.env, PROJECT_AGENT_ROOT: root },
    encoding: 'utf8',
  });
}

test('the untouched starter validates', () => {
  const result = run(ROOT);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PROJECT_AGENT_OK/);
});

test('status exposes the stable agent address and active requests', () => {
  const result = run(ROOT, 'status');
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /agent: EXAMPLE_PROJECT_AGENT/);
  assert.match(result.stdout, /active requests: none/);
});

test('unknown current-state fields fail closed', async () => {
  const copy = await mkdtemp(path.join(tmpdir(), 'project-agent-'));
  await cp(ROOT, copy, { recursive: true });
  const currentPath = path.join(copy, 'agent/CURRENT.json');
  const current = JSON.parse(await readFile(currentPath, 'utf8'));
  current.unearned_authority = true;
  await writeFile(currentPath, `${JSON.stringify(current, null, 2)}\n`);
  const result = run(copy);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /CURRENT fields must be exactly/);
});

test('an active request must exist and address the current project agent', async () => {
  const copy = await mkdtemp(path.join(tmpdir(), 'project-agent-'));
  await cp(ROOT, copy, { recursive: true });
  const currentPath = path.join(copy, 'agent/CURRENT.json');
  const current = JSON.parse(await readFile(currentPath, 'utf8'));
  current.active_request_ids = ['REQUEST-404'];
  await writeFile(currentPath, `${JSON.stringify(current, null, 2)}\n`);
  const result = run(copy);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing request REQUEST-404/);
});

