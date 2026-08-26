"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const capture = require("../x-profile-capture.js");
const fixture = JSON.parse(
  fs.readFileSync(path.join(__dirname, "fixtures", "x-profile-dom-snapshots.json"), "utf8")
);

test("profile inference accepts profile tabs and refuses reserved or status pages", () => {
  assert.equal(capture.inferOwnerHandle({ hostname: "x.com", pathname: "/Morrow_Test/with_replies" }), "morrow_test");
  assert.equal(capture.inferOwnerHandle({ hostname: "x.com", pathname: "/home" }), null);
  assert.equal(capture.inferOwnerHandle({ hostname: "x.com", pathname: "/morrow_test/status/101" }), null);
  assert.equal(capture.inferOwnerHandle({ hostname: "example.com", pathname: "/morrow_test" }), null);
});

test("owned permalink wins over a quoted post and foreign reposts are excluded", () => {
  const first = capture.recordFromSnapshot(fixture.snapshots[0], fixture.ownerHandle, "2026-08-26T00:00:00.000Z");
  const repost = capture.recordFromSnapshot(fixture.snapshots[1], fixture.ownerHandle, "2026-08-26T00:00:00.000Z");
  assert.equal(first.id, "101");
  assert.equal(first.url, "https://x.com/morrow_test/status/101");
  assert.equal(repost, null);
});

test("metric labels parse compact and comma-separated counts", () => {
  assert.deepEqual(
    capture.parseMetricsLabels(["4 replies, 1 repost, 12 likes, 1.2K views"]).parsed,
    { replies: 4, reposts: 1, likes: 12, views: 1200 }
  );
  assert.equal(capture.parseCount("1,500"), 1500);
});

test("incremental accumulation deduplicates virtualized posts and keeps fuller observations", () => {
  const posts = new Map();
  fixture.snapshots.forEach((snapshot, index) => {
    const record = capture.recordFromSnapshot(snapshot, fixture.ownerHandle, `2026-08-26T00:00:0${index}.000Z`);
    if (record) posts.set(record.id, capture.mergeRecord(posts.get(record.id), record));
  });
  assert.equal(posts.size, 2);
  assert.equal(posts.get("101").captureCount, 2);
  assert.match(posts.get("101").text, /full text/);
  assert.equal(posts.get("101").metrics.likes, 15);
  assert.equal(posts.get("101").metrics.views, 1500);
  assert.equal(posts.get("103").isReply, true);
});

test("Markdown export is chronological and retains URLs", () => {
  const posts = [fixture.snapshots[2], fixture.snapshots[0]].map((snapshot, index) =>
    capture.recordFromSnapshot(snapshot, fixture.ownerHandle, `2026-08-26T00:00:0${index}.000Z`)
  );
  const markdown = capture.payloadToMarkdown({
    schema: "morrow-x-profile-capture/v0.1",
    ownerHandle: fixture.ownerHandle,
    exportedAt: "2026-08-26T00:00:00.000Z",
    posts
  });
  assert.ok(markdown.indexOf("2026-08-24") < markdown.indexOf("2026-08-25"));
  assert.match(markdown, /https:\/\/x\.com\/morrow_test\/status\/101/);
  assert.match(markdown, /2026-08-25T12:30:00\.000Z — reply/);
});

