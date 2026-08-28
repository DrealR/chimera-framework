import assert from 'node:assert/strict';
import {
  access,
  chmod,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  symlink,
  unlink,
  writeFile,
} from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INSTALLER = path.join(ROOT, 'scripts/install-project-agent.mjs');
const TEMPLATE_ROOT = path.join(ROOT, 'templates/project-agent');

function run(args, environment = {}) {
  return spawnSync(process.execPath, [INSTALLER, ...args], {
    encoding: 'utf8',
    env: { ...process.env, ...environment },
  });
}

async function repository() {
  const directory = await mkdtemp(path.join(tmpdir(), 'project-agent-install-'));
  assert.equal(spawnSync('git', ['init', '-b', 'main', directory], { encoding: 'utf8' }).status, 0);
  assert.equal(spawnSync('git', ['-C', directory, 'commit', '--allow-empty', '-m', 'initial'], { encoding: 'utf8' }).status, 0);
  return directory;
}

async function snapshot(directory, relative = '') {
  const result = [];
  const entries = await readdir(path.join(directory, relative), { withFileTypes: true });
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) {
      result.push(...await snapshot(directory, child));
      continue;
    }
    const bytes = await readFile(path.join(directory, child));
    result.push([child, createHash('sha256').update(bytes).digest('hex')]);
  }
  return result;
}

async function files(directory, relative = '') {
  const result = [];
  const entries = await readdir(path.join(directory, relative), { withFileTypes: true });
  for (const entry of entries) {
    const child = path.join(relative, entry.name);
    if (entry.isDirectory()) result.push(...await files(directory, child));
    else result.push(path.join(directory, child));
  }
  return result;
}

test('public starter and installer contain no donor-specific name canaries', async () => {
  const canaries = [
    ['m', 'o'],
    ['m', 'orrow'],
    ['r', 'eemy'],
    ['r', 'eemifai'],
  ].map((parts) => parts.join(''));
  const pattern = new RegExp(`\\b(?:${canaries.join('|')})\\b`, 'i');
  for (const filename of [INSTALLER, ...await files(TEMPLATE_ROOT)]) {
    const content = await readFile(filename, 'utf8');
    assert.equal(pattern.test(content), false, `${path.relative(ROOT, filename)} contains a donor-specific name`);
  }
});

test('public contract keeps authority with the current human operator', async () => {
  const contract = await readFile(path.join(TEMPLATE_ROOT, 'AGENTS.md'), 'utf8');
  assert.match(contract, /Repository request files never grant authority/);
  assert.match(contract, /authority\.actions` is only an upper bound/);
  assert.doesNotMatch(contract, /A request grants only/);
});

test('installer is dry-run by default', async () => {
  const target = await repository();
  const result = run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /mode: POLLINATE/);
  assert.match(result.stdout, /imports no donor-agent, donor-human, or other-project identity/);
  assert.match(result.stdout, /DRY_RUN_NO_WRITES/);
  await assert.rejects(access(path.join(target, 'AGENTS.md')));
});

test('installer rejects unsupported Git object formats before staging', async (context) => {
  const target = await mkdtemp(path.join(tmpdir(), 'project-agent-sha256-'));
  const initialized = spawnSync('git', ['init', '--object-format=sha256', '-b', 'main', target], { encoding: 'utf8' });
  if (initialized.status !== 0) {
    context.skip(`Git does not support SHA-256 repositories: ${initialized.stderr.trim()}`);
    return;
  }
  const committed = spawnSync(
    'git',
    ['-C', target, '-c', 'user.name=Project Agent Test', '-c', 'user.email=project-agent@example.invalid', 'commit', '--allow-empty', '-m', 'initial'],
    { encoding: 'utf8' },
  );
  assert.equal(committed.status, 0, committed.stderr);

  const result = run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /unsupported Git object format "sha256"; project-agent v2 requires sha1/);
  await assert.rejects(access(path.join(target, 'AGENTS.md')));
  assert.deepEqual(await readdir(target), ['.git']);
});

test('installer applies an addressable, valid starter after explicit consent', async () => {
  const target = await repository();
  const result = run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']);
  assert.equal(result.status, 0, result.stderr);
  const current = JSON.parse(await readFile(path.join(target, 'agent/CURRENT.json'), 'utf8'));
  assert.equal(current.project, 'Trip App');
  assert.equal(current.agent_address, 'TRIP_APP_AGENT');
  await access(path.join(target, 'agent/ENTRY.md'));
  await access(path.join(target, 'agent/contacts/CONTACT.example.json'));
  await access(path.join(target, 'schemas/contact.schema.json'));
  const pullRequestTemplate = await readFile(path.join(target, '.github/PULL_REQUEST_TEMPLATE.md'), 'utf8');
  assert.match(pullRequestTemplate, /## Addressed project agent\n\n`TRIP_APP_AGENT`/);
  assert.doesNotMatch(pullRequestTemplate, /EXAMPLE_PROJECT_AGENT/);
  const check = spawnSync(process.execPath, [path.join(target, 'scripts/project-agent.mjs'), 'check'], { cwd: target, encoding: 'utf8' });
  assert.equal(check.status, 0, check.stderr);
  assert.match(check.stdout, /PROJECT_AGENT_OK project=Trip App/);
});

test('pollinate serializes project values safely and preserves contact source sentinels', async () => {
  const target = await repository();
  const project = 'Trip "Quoted" \\ Project\nSecond Line';
  const result = run(['--target', target, '--project', project, '--agent', 'TRIP_APP_AGENT', '--apply']);
  assert.equal(result.status, 0, result.stderr);
  const current = JSON.parse(await readFile(path.join(target, 'agent/CURRENT.json'), 'utf8'));
  const contact = JSON.parse(await readFile(path.join(target, 'agent/contacts/CONTACT.example.json'), 'utf8'));
  assert.equal(current.project, project);
  assert.equal(contact.addressed_to, 'TRIP_APP_AGENT');
  assert.equal(contact.source.agent_address, 'SOURCE_PROJECT_AGENT');
  assert.equal(contact.source.head_sha, '0'.repeat(40));
  assert.equal(contact.source.current_state_sha256, '0'.repeat(64));
  assert.equal(contact.evidence[0].locator, `commit:${'0'.repeat(40)}`);
  assert.equal(contact.evidence[0].digest, `git:${'0'.repeat(40)}`);
});

test('explicit default branch stamps its exact branch ref instead of the feature HEAD', async () => {
  const target = await repository();
  const mainHead = spawnSync('git', ['-C', target, 'rev-parse', 'refs/heads/main'], { encoding: 'utf8' }).stdout.trim();
  assert.equal(spawnSync('git', ['-C', target, 'switch', '-c', 'feature/install'], { encoding: 'utf8' }).status, 0);
  assert.equal(spawnSync('git', ['-C', target, 'commit', '--allow-empty', '-m', 'feature'], { encoding: 'utf8' }).status, 0);
  const featureHead = spawnSync('git', ['-C', target, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
  assert.notEqual(featureHead, mainHead);

  const result = run([
    '--target', target,
    '--project', 'Trip App',
    '--agent', 'TRIP_APP_AGENT',
    '--default-branch', 'main',
    '--apply',
  ]);
  assert.equal(result.status, 0, result.stderr);
  const current = JSON.parse(await readFile(path.join(target, 'agent/CURRENT.json'), 'utf8'));
  assert.equal(current.default_branch, 'main');
  assert.equal(current.base_sha, mainHead);
  assert.notEqual(current.base_sha, featureHead);
});

test('explicit default branch prefers a divergent origin ref over the local ref', async () => {
  const target = await repository();
  const localMain = spawnSync('git', ['-C', target, 'rev-parse', 'refs/heads/main'], { encoding: 'utf8' }).stdout.trim();
  assert.equal(spawnSync('git', ['-C', target, 'switch', '-c', 'remote-candidate'], { encoding: 'utf8' }).status, 0);
  assert.equal(spawnSync('git', ['-C', target, 'commit', '--allow-empty', '-m', 'remote main'], { encoding: 'utf8' }).status, 0);
  const remoteMain = spawnSync('git', ['-C', target, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
  assert.equal(spawnSync('git', ['-C', target, 'update-ref', 'refs/remotes/origin/main', remoteMain], { encoding: 'utf8' }).status, 0);
  assert.equal(spawnSync('git', ['-C', target, 'switch', 'main'], { encoding: 'utf8' }).status, 0);

  const result = run([
    '--target', target,
    '--project', 'Trip App',
    '--agent', 'TRIP_APP_AGENT',
    '--default-branch', 'main',
    '--apply',
  ]);
  assert.equal(result.status, 0, result.stderr);
  const current = JSON.parse(await readFile(path.join(target, 'agent/CURRENT.json'), 'utf8'));
  assert.equal(current.base_sha, remoteMain);
  assert.notEqual(current.base_sha, localMain);
});

test('omitted default branch prefers the exact origin HEAD ref', async () => {
  const target = await repository();
  const remoteHead = spawnSync('git', ['-C', target, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
  assert.equal(spawnSync('git', ['-C', target, 'update-ref', 'refs/remotes/origin/trunk', remoteHead], { encoding: 'utf8' }).status, 0);
  assert.equal(spawnSync('git', ['-C', target, 'symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/remotes/origin/trunk'], { encoding: 'utf8' }).status, 0);
  assert.equal(spawnSync('git', ['-C', target, 'switch', '-c', 'feature/install'], { encoding: 'utf8' }).status, 0);
  assert.equal(spawnSync('git', ['-C', target, 'commit', '--allow-empty', '-m', 'feature'], { encoding: 'utf8' }).status, 0);

  const result = run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']);
  assert.equal(result.status, 0, result.stderr);
  const current = JSON.parse(await readFile(path.join(target, 'agent/CURRENT.json'), 'utf8'));
  assert.equal(current.default_branch, 'trunk');
  assert.equal(current.base_sha, remoteHead);
});

test('installer modes ignore caller Git repository-selector and trace environment', async () => {
  const target = await repository();
  const other = await repository();
  const traceFile = path.join(other, 'git-trace.log');
  const targetHead = spawnSync('git', ['-C', target, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
  assert.equal(spawnSync('git', ['-C', other, 'commit', '--allow-empty', '-m', 'other'], { encoding: 'utf8' }).status, 0);

  const poisonedEnvironment = {
    GIT_DIR: path.join(other, '.git'),
    GIT_WORK_TREE: other,
    GIT_EXEC_PATH: path.join(other, 'commands'),
    GIT_TRACE: traceFile,
  };
  const result = run(
    ['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply'],
    poisonedEnvironment,
  );
  assert.equal(result.status, 0, result.stderr);
  const current = JSON.parse(await readFile(path.join(target, 'agent/CURRENT.json'), 'utf8'));
  assert.equal(current.base_sha, targetHead);
  await assert.rejects(access(path.join(other, 'AGENTS.md')));
  await assert.rejects(access(traceFile));

  const rebind = run(
    ['--mode', 'rebind', '--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT'],
    poisonedEnvironment,
  );
  assert.equal(rebind.status, 0, rebind.stderr);
  assert.match(rebind.stdout, /PROJECT_AGENT_REBIND_READY/);
  await assert.rejects(access(traceFile));
});

test('explicit pollinate mode has the same safe apply behavior', async () => {
  const target = await repository();
  const result = run(['--mode', 'pollinate', '--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PROJECT_AGENT_INSTALLED/);
});

test('installer refuses to overwrite an existing project-agent surface', async () => {
  const target = await repository();
  assert.equal(run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']).status, 0);
  const second = run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']);
  assert.equal(second.status, 1);
  assert.match(second.stderr, /refusing to overwrite/);
});

test('pollinate rejects symlink ancestors and broken leaf symlinks without external writes', async (context) => {
  await context.test('symlinked agent directory', async () => {
    const target = await repository();
    const external = await mkdtemp(path.join(tmpdir(), 'project-agent-external-'));
    await symlink(external, path.join(target, 'agent'), 'dir');
    const result = run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /symlink component is forbidden/);
    assert.deepEqual(await readdir(external), []);
    await assert.rejects(access(path.join(target, 'AGENTS.md')));
  });

  await context.test('broken destination symlink', async () => {
    const target = await repository();
    const external = await mkdtemp(path.join(tmpdir(), 'project-agent-external-'));
    const escaped = path.join(external, 'escaped.md');
    await symlink(escaped, path.join(target, 'AGENTS.md'));
    const result = run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /symlink component is forbidden/);
    await assert.rejects(access(escaped));
  });
});

test('pollinate preflights all collisions and rolls back an injected mid-install failure', async () => {
  const collisionTarget = await repository();
  await mkdir(path.join(collisionTarget, '.github'));
  await writeFile(path.join(collisionTarget, '.github/PULL_REQUEST_TEMPLATE.md'), 'existing\n');
  const collision = run(['--target', collisionTarget, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']);
  assert.equal(collision.status, 1);
  assert.match(collision.stderr, /refusing to overwrite/);
  await assert.rejects(access(path.join(collisionTarget, 'AGENTS.md')));
  assert.equal(await readFile(path.join(collisionTarget, '.github/PULL_REQUEST_TEMPLATE.md'), 'utf8'), 'existing\n');

  const failureTarget = await repository();
  const failure = run(
    ['--target', failureTarget, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply'],
    { PROJECT_AGENT_INSTALL_TEST_FAIL_AFTER: '3' },
  );
  assert.equal(failure.status, 1);
  assert.match(failure.stderr, /installation rolled back: injected installation failure/);
  assert.deepEqual(await readdir(failureTarget), ['.git']);

  const raceTarget = await repository();
  await mkdir(path.join(raceTarget, 'agent'));
  const race = run(
    ['--target', raceTarget, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply'],
    { PROJECT_AGENT_INSTALL_TEST_COLLIDE_AT: '3' },
  );
  assert.equal(race.status, 1);
  assert.match(race.stderr, /installation rolled back:.*EEXIST/);
  await assert.rejects(access(path.join(raceTarget, 'AGENTS.md')));
  await assert.rejects(access(path.join(raceTarget, 'CLAUDE.md')));
  assert.equal(await readFile(path.join(raceTarget, 'agent/ENTRY.md'), 'utf8'), 'injected concurrent collision\n');
});

test('rebind verifies an existing exact role and performs no writes', async () => {
  const target = await repository();
  assert.equal(run(['--mode', 'pollinate', '--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']).status, 0);
  const before = await snapshot(target);
  const first = run(['--mode', 'rebind', '--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT']);
  const second = run(['--mode', 'rebind', '--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT']);
  assert.equal(first.status, 0, first.stderr);
  assert.equal(second.status, 0, second.stderr);
  assert.equal(first.stdout, second.stdout);
  assert.match(first.stdout, /mode: REBIND/);
  assert.match(first.stdout, /PROJECT_AGENT_REBIND_READY/);
  assert.match(first.stdout, /"verification_scope":"LOCAL_STATE_ONLY"/);
  assert.match(first.stdout, /"receipt_type":"AUTHORITY_INERT"/);
  assert.deepEqual(await snapshot(target), before);
});

test('rebind can bind readiness to expected local lineage', async () => {
  const target = await repository();
  assert.equal(run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']).status, 0);
  const head = spawnSync('git', ['-C', target, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
  const currentHash = createHash('sha256').update(await readFile(path.join(target, 'agent/CURRENT.json'))).digest('hex');
  const result = run([
    '--mode', 'rebind',
    '--target', target,
    '--project', 'Trip App',
    '--agent', 'TRIP_APP_AGENT',
    '--expected-head', head,
    '--expected-current-sha256', currentHash,
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /"verification_scope":"EXPECTED_LOCAL_STATE_VERIFIED"/);
});

test('rebind blocks exact expected lineage mismatches', async () => {
  const target = await repository();
  assert.equal(run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']).status, 0);
  const wrongHead = '0000000000000000000000000000000000000000';
  const wrongCurrent = '0000000000000000000000000000000000000000000000000000000000000000';

  const head = run(['--mode', 'rebind', '--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--expected-head', wrongHead]);
  assert.equal(head.status, 1);
  assert.match(head.stderr, /REBIND head mismatch/);

  const current = run(['--mode', 'rebind', '--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--expected-current-sha256', wrongCurrent]);
  assert.equal(current.status, 1);
  assert.match(current.stderr, /REBIND current-state hash mismatch/);
});

test('rebind never executes a target-controlled project-agent script', async () => {
  const target = await repository();
  assert.equal(run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']).status, 0);
  const marker = path.join(target, 'TARGET_SCRIPT_EXECUTED');
  await writeFile(
    path.join(target, 'scripts/project-agent.mjs'),
    `import { writeFileSync } from 'node:fs';\nwriteFileSync(${JSON.stringify(marker)}, 'executed');\n`,
  );
  const result = run(['--mode', 'rebind', '--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT']);
  assert.equal(result.status, 0, result.stderr);
  await assert.rejects(access(marker));
});

test('rebind refuses an existing surface whose state directory escapes through a symlink', async () => {
  const target = await repository();
  assert.equal(run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']).status, 0);
  const externalRoot = await mkdtemp(path.join(tmpdir(), 'project-agent-external-state-'));
  const externalAgent = path.join(externalRoot, 'agent');
  await rename(path.join(target, 'agent'), externalAgent);
  await symlink(externalAgent, path.join(target, 'agent'), 'dir');

  const result = run(['--mode', 'rebind', '--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /REBIND missing existing surface file or found unsafe path agent\/ENTRY\.md: symlink component is forbidden/);
});

test('rebind refuses a broken CURRENT symlink without reading it', async () => {
  const target = await repository();
  assert.equal(run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']).status, 0);
  const currentPath = path.join(target, 'agent/CURRENT.json');
  await unlink(currentPath);
  await symlink(path.join(target, 'missing-current.json'), currentPath);
  const result = run(['--mode', 'rebind', '--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /REBIND missing existing surface file or found unsafe path agent\/CURRENT\.json: symlink component is forbidden/);
});

test('rebind disables repository-configured fsmonitor execution', async () => {
  const target = await repository();
  assert.equal(run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']).status, 0);
  const marker = path.join(target, 'FSMONITOR_EXECUTED');
  const monitor = path.join(target, 'fsmonitor-test.mjs');
  await writeFile(
    monitor,
    `#!/usr/bin/env node\nimport { writeFileSync } from 'node:fs';\nwriteFileSync(${JSON.stringify(marker)}, 'executed');\n`,
  );
  await chmod(monitor, 0o755);
  assert.equal(spawnSync('git', ['-C', target, 'config', 'core.fsmonitor', monitor], { encoding: 'utf8' }).status, 0);

  const unsafeProbe = spawnSync('git', ['-C', target, 'status', '--porcelain=v1'], { encoding: 'utf8' });
  assert.equal(unsafeProbe.status, 0, unsafeProbe.stderr);
  await access(marker);
  await unlink(marker);

  const result = run(['--mode', 'rebind', '--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT']);
  assert.equal(result.status, 0, result.stderr);
  await assert.rejects(access(marker));
});

test('rebind disables partial-clone lazy fetch and target-configured transport', async () => {
  const target = await repository();
  assert.equal(run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']).status, 0);
  const marker = path.join(target, 'PROMISOR_TRANSPORT_EXECUTED');
  const transport = path.join(target, 'promisor-transport.mjs');
  await writeFile(
    transport,
    `#!/usr/bin/env node\nimport { writeFileSync } from 'node:fs';\nwriteFileSync(${JSON.stringify(marker)}, 'executed');\nprocess.exit(1);\n`,
  );
  await chmod(transport, 0o755);
  for (const [key, value] of [
    ['remote.origin.url', `ext::${transport}`],
    ['remote.origin.promisor', 'true'],
    ['remote.origin.partialclonefilter', 'blob:none'],
    ['protocol.ext.allow', 'always'],
  ]) {
    const configured = spawnSync('git', ['-C', target, 'config', key, value], { encoding: 'utf8' });
    assert.equal(configured.status, 0, configured.stderr);
  }

  const head = spawnSync('git', ['-C', target, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
  const headObject = path.join(target, '.git/objects', head.slice(0, 2), head.slice(2));
  await rename(headObject, path.join(target, '.git/promised-head-object'));

  const unsafeProbe = spawnSync('git', ['-C', target, 'status', '--porcelain=v1'], { encoding: 'utf8' });
  assert.notEqual(unsafeProbe.status, 0);
  await access(marker);
  await unlink(marker);

  const result = run(['--mode', 'rebind', '--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /REBIND existing surface wake --json failed/);
  await assert.rejects(access(marker));
});

test('rebind forbids apply and blocks project or agent mismatches precisely', async () => {
  const target = await repository();
  assert.equal(run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']).status, 0);

  const apply = run(['--mode', 'rebind', '--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']);
  assert.equal(apply.status, 1);
  assert.match(apply.stderr, /REBIND forbids --apply/);

  const project = run(['--mode', 'rebind', '--target', target, '--project', 'Other App', '--agent', 'TRIP_APP_AGENT']);
  assert.equal(project.status, 1);
  assert.match(project.stderr, /REBIND project mismatch/);

  const agent = run(['--mode', 'rebind', '--target', target, '--project', 'Trip App', '--agent', 'OTHER_APP_AGENT']);
  assert.equal(agent.status, 1);
  assert.match(agent.stderr, /REBIND agent mismatch/);
});

test('rebind refuses a subdirectory and a repository without an existing surface', async () => {
  const target = await repository();
  const missing = run(['--mode', 'rebind', '--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT']);
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /REBIND missing existing surface file/);

  assert.equal(run(['--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT', '--apply']).status, 0);
  const nested = path.join(target, 'agent');
  const subdirectory = run(['--mode', 'rebind', '--target', nested, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT']);
  assert.equal(subdirectory.status, 1);
  assert.match(subdirectory.stderr, /target must be the exact Git worktree root/);
});

test('installer rejects unknown entry modes', async () => {
  const target = await repository();
  const result = run(['--mode', 'clone', '--target', target, '--project', 'Trip App', '--agent', 'TRIP_APP_AGENT']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /--mode must be pollinate or rebind/);
});

test('pollinate rejects rebind-only lineage expectations', async () => {
  const target = await repository();
  const result = run([
    '--mode', 'pollinate',
    '--target', target,
    '--project', 'Trip App',
    '--agent', 'TRIP_APP_AGENT',
    '--expected-head', '0000000000000000000000000000000000000000',
  ]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /POLLINATE does not accept REBIND lineage expectations/);
});
