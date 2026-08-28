import assert from 'node:assert/strict';
import { access, mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INSTALLER = path.join(ROOT, 'scripts/install-project-agent.mjs');

function run(args) {
  return spawnSync(process.execPath, [INSTALLER, ...args], { encoding: 'utf8' });
}

async function repository() {
  const directory = await mkdtemp(path.join(tmpdir(), 'project-agent-install-'));
  assert.equal(spawnSync('git', ['init', '-b', 'main', directory], { encoding: 'utf8' }).status, 0);
  assert.equal(spawnSync('git', ['-C', directory, 'commit', '--allow-empty', '-m', 'initial'], { encoding: 'utf8' }).status, 0);
  return directory;
}

test('installer is dry-run by default', async () => {
  const target = await repository();
  const result = run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /DRY_RUN_NO_WRITES/);
  await assert.rejects(access(path.join(target, 'AGENTS.md')));
});

test('installer applies an addressable, valid starter after explicit consent', async () => {
  const target = await repository();
  const result = run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']);
  assert.equal(result.status, 0, result.stderr);
  const current = JSON.parse(await readFile(path.join(target, 'agent/CURRENT.json'), 'utf8'));
  assert.equal(current.project, 'Trip App');
  assert.equal(current.agent_address, 'TRIP_APP_AGENT');
  const check = spawnSync(process.execPath, [path.join(target, 'scripts/project-agent.mjs'), 'check'], { cwd: target, encoding: 'utf8' });
  assert.equal(check.status, 0, check.stderr);
  assert.match(check.stdout, /PROJECT_AGENT_OK project=Trip App/);
});

test('installer refuses to overwrite an existing project-agent surface', async () => {
  const target = await repository();
  assert.equal(run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']).status, 0);
  const second = run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']);
  assert.equal(second.status, 1);
  assert.match(second.stderr, /refusing to overwrite/);
});

