import assert from 'node:assert/strict';
import { mkdtemp, cp, mkdir, readFile, rename, symlink, unlink, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(ROOT, 'scripts/project-agent.mjs');
const SURFACE = ['AGENTS.md', 'CLAUDE.md', 'agent', 'schemas', 'scripts/project-agent.mjs'];

function run(root, command = 'check', options = []) {
  return spawnSync(process.execPath, [CLI, command, ...options], {
    cwd: root,
    env: { ...process.env, PROJECT_AGENT_ROOT: root },
    encoding: 'utf8',
  });
}

async function copySurface(destination) {
  await mkdir(destination, { recursive: true });
  for (const relative of SURFACE) {
    const target = path.join(destination, relative);
    await mkdir(path.dirname(target), { recursive: true });
    await cp(path.join(ROOT, relative), target, { recursive: true });
  }
}

async function repository() {
  const copy = await mkdtemp(path.join(tmpdir(), 'project-agent-repository-'));
  await copySurface(copy);
  assert.equal(spawnSync('git', ['init', '-b', 'main', copy], { encoding: 'utf8' }).status, 0);
  assert.equal(spawnSync('git', ['-C', copy, 'add', '.'], { encoding: 'utf8' }).status, 0);
  const commit = spawnSync('git', ['-C', copy, '-c', 'user.name=Project Agent Test', '-c', 'user.email=project-agent@example.invalid', 'commit', '-m', 'initial'], { encoding: 'utf8' });
  assert.equal(commit.status, 0, commit.stderr);
  return copy;
}

test('the untouched starter validates', () => {
  const result = run(ROOT);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PROJECT_AGENT_OK/);
});

test('status exposes the stable agent address and active requests', async () => {
  const current = JSON.parse(await readFile(path.join(ROOT, 'agent/CURRENT.json'), 'utf8'));
  const result = run(ROOT, 'status');
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, new RegExp(`agent: ${current.agent_address}`));
  assert.match(result.stdout, /active requests: none/);
});

test('wake emits a deterministic authority-inert receipt from exact local state', async () => {
  const root = await repository();
  const currentBytes = await readFile(path.join(root, 'agent/CURRENT.json'));
  const head = spawnSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
  const first = run(root, 'wake', ['--json']);
  const second = run(root, 'wake', ['--json']);
  assert.equal(first.status, 0, first.stderr);
  assert.equal(second.status, 0, second.stderr);
  assert.equal(first.stdout, second.stdout);

  const receipt = JSON.parse(first.stdout);
  assert.equal(receipt.schema_version, 'project-agent-wake/v1');
  assert.equal(receipt.receipt_type, 'AUTHORITY_INERT');
  assert.equal(receipt.ready, true);
  assert.deepEqual(receipt.repository, { branch: 'main', head_sha: head, dirty: false });
  assert.equal(receipt.current_state.path, 'agent/CURRENT.json');
  assert.equal(receipt.current_state.sha256, createHash('sha256').update(currentBytes).digest('hex'));
  assert.deepEqual(receipt.validated, { contacts: 0, requests: 0, receipts: 0 });
  assert.equal(receipt.authority_granted, false);
  assert.equal(receipt.private_memory_transferred, false);
  assert.equal(receipt.credentials_transferred, false);
  assert.equal(first.stdout.includes(root), false);
  assert.equal('timestamp' in receipt, false);
});

test('wake requires JSON mode and an exact Git worktree root', async () => {
  const missingOption = run(ROOT, 'wake');
  assert.equal(missingOption.status, 1);
  assert.match(missingOption.stderr, /wake requires exactly --json/);

  const root = await repository();
  const nested = path.join(root, 'nested');
  await copySurface(nested);
  const nestedRoot = run(nested, 'wake', ['--json']);
  assert.equal(nestedRoot.status, 1);
  assert.match(nestedRoot.stderr, /project-agent root must be the exact Git worktree root/);
});

test('unknown current-state fields fail closed', async () => {
  const copy = await mkdtemp(path.join(tmpdir(), 'project-agent-'));
  await copySurface(copy);
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
  await copySurface(copy);
  const currentPath = path.join(copy, 'agent/CURRENT.json');
  const current = JSON.parse(await readFile(currentPath, 'utf8'));
  current.active_request_ids = ['REQUEST-404'];
  await writeFile(currentPath, `${JSON.stringify(current, null, 2)}\n`);
  const result = run(copy);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing request REQUEST-404/);
});

test('request expiry matches the strict RFC 3339 schema and calendar rules', async () => {
  const schema = JSON.parse(await readFile(path.join(ROOT, 'schemas/request.schema.json'), 'utf8'));
  const expirySchema = schema.properties.authority.properties.expires_at;
  const expiryPattern = new RegExp(expirySchema.pattern);
  assert.equal(expirySchema.format, 'date-time');
  assert.equal(expiryPattern.test('2028-02-29T23:59:59.123+05:30'), true);
  assert.equal(expiryPattern.test('2028-02-29'), false);

  const copy = await mkdtemp(path.join(tmpdir(), 'project-agent-request-'));
  await copySurface(copy);
  const request = JSON.parse(await readFile(path.join(copy, 'agent/requests/REQUEST.example.json'), 'utf8'));
  request.request_id = 'REQUEST_EXPIRY';
  const requestPath = path.join(copy, 'agent/requests/REQUEST_EXPIRY.json');

  request.authority.expires_at = '2028-02-29';
  await writeFile(requestPath, `${JSON.stringify(request, null, 2)}\n`);
  const dateOnly = run(copy);
  assert.equal(dateOnly.status, 1);
  assert.match(dateOnly.stderr, /must be a strict RFC 3339 date-time or null/);

  request.authority.expires_at = '2026-02-30T12:00:00Z';
  await writeFile(requestPath, `${JSON.stringify(request, null, 2)}\n`);
  const normalizedInvalid = run(copy);
  assert.equal(normalizedInvalid.status, 1);
  assert.match(normalizedInvalid.stderr, /must be a calendar-valid RFC 3339 date-time or null/);

  request.authority.expires_at = '2028-02-29T23:59:59.123+05:30';
  await writeFile(requestPath, `${JSON.stringify(request, null, 2)}\n`);
  const valid = run(copy);
  assert.equal(valid.status, 0, valid.stderr);
  assert.match(valid.stdout, /requests=1/);
});

test('receipt pull-request URLs match the HTTPS-only URI schema and runtime parser', async () => {
  const schema = JSON.parse(await readFile(path.join(ROOT, 'schemas/receipt.schema.json'), 'utf8'));
  const urlBranches = schema.properties.pull_request_url.anyOf;
  const stringBranch = urlBranches.find((branch) => branch.type === 'string');
  assert.equal(stringBranch.format, 'uri');
  assert.equal(new RegExp(stringBranch.pattern).test('https://example.invalid/pull/1'), true);
  assert.equal(new RegExp(stringBranch.pattern).test('http://example.invalid/pull/1'), false);
  assert.equal(new RegExp(stringBranch.pattern).test('https://example.invalid\\not-a-uri'), false);
  assert.equal(new RegExp(stringBranch.pattern).test('https://example.invalid/{raw}'), false);

  const copy = await mkdtemp(path.join(tmpdir(), 'project-agent-receipt-'));
  await copySurface(copy);
  const request = JSON.parse(await readFile(path.join(copy, 'agent/requests/REQUEST.example.json'), 'utf8'));
  request.request_id = 'REQUEST_URL';
  await writeFile(path.join(copy, 'agent/requests/REQUEST_URL.json'), `${JSON.stringify(request, null, 2)}\n`);
  const receipt = JSON.parse(await readFile(path.join(copy, 'agent/receipts/RECEIPT.example.json'), 'utf8'));
  receipt.receipt_id = 'RECEIPT_URL';
  receipt.request_id = request.request_id;
  const receiptPath = path.join(copy, 'agent/receipts/RECEIPT_URL.json');

  for (const invalidUrl of [
    'http://example.invalid/pull/1',
    'urn:example:pull:1',
    'https://',
    'https://example.invalid/%zz',
    'https://example.invalid\\not-a-uri',
    'https://example.invalid/{raw}',
  ]) {
    receipt.pull_request_url = invalidUrl;
    await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
    const invalid = run(copy);
    assert.equal(invalid.status, 1, `${invalidUrl}\n${invalid.stderr}`);
    assert.match(invalid.stderr, /pull_request_url must be a well-formed HTTPS URL or null/);
  }

  receipt.pull_request_url = 'https://example.invalid/pull/1';
  await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
  const valid = run(copy);
  assert.equal(valid.status, 0, valid.stderr);
  assert.match(valid.stdout, /receipts=1/);
});

test('check refuses symlinked or broken CURRENT state files', async (context) => {
  await context.test('external CURRENT symlink', async () => {
    const copy = await mkdtemp(path.join(tmpdir(), 'project-agent-symlink-'));
    await copySurface(copy);
    const external = await mkdtemp(path.join(tmpdir(), 'project-agent-external-'));
    const currentPath = path.join(copy, 'agent/CURRENT.json');
    const externalCurrent = path.join(external, 'CURRENT.json');
    await cp(currentPath, externalCurrent);
    await unlink(currentPath);
    await symlink(externalCurrent, currentPath);
    const result = run(copy);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /state path contains a forbidden symlink component: agent\/CURRENT\.json/);
  });

  await context.test('broken CURRENT symlink', async () => {
    const copy = await mkdtemp(path.join(tmpdir(), 'project-agent-symlink-'));
    await copySurface(copy);
    const currentPath = path.join(copy, 'agent/CURRENT.json');
    await unlink(currentPath);
    await symlink(path.join(copy, 'missing-current.json'), currentPath);
    const result = run(copy);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /state path contains a forbidden symlink component: agent\/CURRENT\.json/);
  });
});

test('check refuses symlinked state directories and live JSON files', async (context) => {
  await context.test('external requests directory', async () => {
    const copy = await mkdtemp(path.join(tmpdir(), 'project-agent-symlink-'));
    await copySurface(copy);
    const external = await mkdtemp(path.join(tmpdir(), 'project-agent-external-'));
    const requests = path.join(copy, 'agent/requests');
    const externalRequests = path.join(external, 'requests');
    await rename(requests, externalRequests);
    await symlink(externalRequests, requests, 'dir');
    const result = run(copy);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /state path contains a forbidden symlink component: agent\/requests/);
  });

  await context.test('external live contact file', async () => {
    const copy = await mkdtemp(path.join(tmpdir(), 'project-agent-symlink-'));
    await copySurface(copy);
    const external = await mkdtemp(path.join(tmpdir(), 'project-agent-external-'));
    const example = JSON.parse(await readFile(path.join(copy, 'agent/contacts/CONTACT.example.json'), 'utf8'));
    example.contact_id = 'CONTACT_LINK';
    const externalContact = path.join(external, 'CONTACT_LINK.json');
    await writeFile(externalContact, `${JSON.stringify(example, null, 2)}\n`);
    await symlink(externalContact, path.join(copy, 'agent/contacts/CONTACT_LINK.json'));
    const result = run(copy);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /state path contains a forbidden symlink component: agent\/contacts\/CONTACT_LINK\.json/);
  });
});

test('check validates non-example contacts and counts a valid inert envelope', async () => {
  const copy = await mkdtemp(path.join(tmpdir(), 'project-agent-contact-'));
  await copySurface(copy);
  const example = JSON.parse(await readFile(path.join(copy, 'agent/contacts/CONTACT.example.json'), 'utf8'));
  example.contact_id = 'CONTACT_VALID';
  await writeFile(path.join(copy, 'agent/contacts/CONTACT_VALID.json'), `${JSON.stringify(example, null, 2)}\n`);
  const result = run(copy);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /contacts=1/);
});

test('a live contact must address the current stable project agent', async () => {
  const copy = await mkdtemp(path.join(tmpdir(), 'project-agent-contact-'));
  await copySurface(copy);
  const example = JSON.parse(await readFile(path.join(copy, 'agent/contacts/CONTACT.example.json'), 'utf8'));
  example.contact_id = 'CONTACT_WRONG_TARGET';
  example.addressed_to = 'ANOTHER_PROJECT_AGENT';
  await writeFile(path.join(copy, 'agent/contacts/CONTACT_WRONG_TARGET.json'), `${JSON.stringify(example, null, 2)}\n`);
  const result = run(copy);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /addresses another agent/);
});

test('contact claim and evidence IDs are unique and references resolve', async () => {
  const copy = await mkdtemp(path.join(tmpdir(), 'project-agent-contact-'));
  await copySurface(copy);
  const examplePath = path.join(copy, 'agent/contacts/CONTACT.example.json');
  const contactPath = path.join(copy, 'agent/contacts/CONTACT_RELATIONS.json');
  const original = JSON.parse(await readFile(examplePath, 'utf8'));
  original.contact_id = 'CONTACT_RELATIONS';

  const duplicateClaim = structuredClone(original);
  duplicateClaim.claims.push({ ...duplicateClaim.claims[0], statement: 'A different statement with the same ID.' });
  await writeFile(contactPath, `${JSON.stringify(duplicateClaim, null, 2)}\n`);
  const claim = run(copy);
  assert.equal(claim.status, 1);
  assert.match(claim.stderr, /claim_id values must be unique/);

  const duplicateEvidence = structuredClone(original);
  duplicateEvidence.evidence.push({ ...duplicateEvidence.evidence[0], locator: 'commit:1111111111111111111111111111111111111111' });
  await writeFile(contactPath, `${JSON.stringify(duplicateEvidence, null, 2)}\n`);
  const evidence = run(copy);
  assert.equal(evidence.status, 1);
  assert.match(evidence.stderr, /evidence_id values must be unique/);

  const missingEvidence = structuredClone(original);
  missingEvidence.claims[0].evidence_ids = ['EVIDENCE_MISSING'];
  await writeFile(contactPath, `${JSON.stringify(missingEvidence, null, 2)}\n`);
  const missing = run(copy);
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /references missing evidence EVIDENCE_MISSING/);
});

test('contact transfer flags and fields fail closed in both schema and validator', async () => {
  const schema = JSON.parse(await readFile(path.join(ROOT, 'schemas/contact.schema.json'), 'utf8'));
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.authority_transfer.const, false);
  assert.equal(schema.properties.private_memory_transfer.const, false);
  assert.equal(schema.properties.credential_transfer.const, false);
  const sourceAgentPattern = new RegExp(schema.properties.source.properties.agent_address.pattern);
  const addressedToPattern = new RegExp(schema.properties.addressed_to.pattern);
  assert.equal(sourceAgentPattern.test('SOURCE_PROJECT_AGENT'), true);
  assert.equal(sourceAgentPattern.test('SOURCE-PROJECT-AGENT'), false);
  assert.equal(addressedToPattern.test('EXAMPLE_PROJECT_AGENT'), true);
  assert.equal(addressedToPattern.test('EXAMPLE-PROJECT-AGENT'), false);
  const locatorPattern = new RegExp(schema.properties.evidence.items.properties.locator.pattern);
  assert.equal(locatorPattern.test('../secret'), false);
  assert.equal(locatorPattern.test('evidence/../secret'), false);
  assert.equal(locatorPattern.test('evidence\\secret'), false);
  assert.equal(locatorPattern.test('file:///private/secret'), false);

  const copy = await mkdtemp(path.join(tmpdir(), 'project-agent-contact-'));
  await copySurface(copy);
  const example = JSON.parse(await readFile(path.join(copy, 'agent/contacts/CONTACT.example.json'), 'utf8'));
  example.contact_id = 'CONTACT_UNSAFE';
  example.authority_transfer = true;
  await writeFile(path.join(copy, 'agent/contacts/CONTACT_UNSAFE.json'), `${JSON.stringify(example, null, 2)}\n`);
  const result = run(copy);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /authority_transfer must be false/);
});

test('contacts reject absolute local evidence locators and unknown fields', async () => {
  const copy = await mkdtemp(path.join(tmpdir(), 'project-agent-contact-'));
  await copySurface(copy);
  const example = JSON.parse(await readFile(path.join(copy, 'agent/contacts/CONTACT.example.json'), 'utf8'));
  example.contact_id = 'CONTACT_LOCAL_PATH';
  example.evidence[0].locator = '/private/source/evidence';
  await writeFile(path.join(copy, 'agent/contacts/CONTACT_LOCAL_PATH.json'), `${JSON.stringify(example, null, 2)}\n`);
  const absolute = run(copy);
  assert.equal(absolute.status, 1);
  assert.match(absolute.stderr, /must not be an absolute local path/);

  example.evidence[0].locator = 'evidence/../secret';
  await writeFile(path.join(copy, 'agent/contacts/CONTACT_LOCAL_PATH.json'), `${JSON.stringify(example, null, 2)}\n`);
  const traversal = run(copy);
  assert.equal(traversal.status, 1);
  assert.match(traversal.stderr, /must not contain parent traversal segments/);

  example.evidence[0].locator = 'commit:0000000000000000000000000000000000000000';
  example.unexpected = true;
  await writeFile(path.join(copy, 'agent/contacts/CONTACT_LOCAL_PATH.json'), `${JSON.stringify(example, null, 2)}\n`);
  const unknown = run(copy);
  assert.equal(unknown.status, 1);
  assert.match(unknown.stderr, /fields must be exactly/);
});
