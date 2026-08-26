"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const capture = require("../youtube-comment-capture.js");
const fixture = JSON.parse(
  fs.readFileSync(path.join(__dirname, "fixtures", "youtube-comment-dom-snapshots.json"), "utf8")
);

test("watch-page inference accepts a bounded YouTube video and refuses other surfaces", () => {
  assert.deepEqual(
    capture.parseWatchLocation({ hostname: "www.youtube.com", pathname: "/watch", search: "?v=abcDEF_1234&t=3" }),
    { videoId: "abcDEF_1234", url: "https://www.youtube.com/watch?v=abcDEF_1234" }
  );
  assert.equal(capture.parseWatchLocation({ hostname: "www.youtube.com", pathname: "/shorts/abcDEF_1234", search: "" }), null);
  assert.equal(capture.parseWatchLocation({ hostname: "example.com", pathname: "/watch", search: "?v=abcDEF_1234" }), null);
});

test("comment permalinks are canonicalized and bound to the selected video", () => {
  assert.deepEqual(
    capture.parseCommentPermalink("/watch?v=abcDEF_1234&lc=UgxRoot001&t=30", fixture.videoId),
    {
      id: "UgxRoot001",
      videoId: fixture.videoId,
      url: "https://www.youtube.com/watch?v=abcDEF_1234&lc=UgxRoot001"
    }
  );
  assert.equal(capture.parseCommentPermalink("/watch?v=otherVideo9&lc=UgxRoot001", fixture.videoId), null);
  assert.equal(capture.parseCommentPermalink("/watch?v=abcDEF_1234", fixture.videoId), null);
});

test("visible counts and observable sort labels are parsed without inventing state", () => {
  assert.equal(capture.parseCompactCount("1.2K"), 1200);
  assert.equal(capture.parseCompactCount("No likes"), null);
  assert.deepEqual(capture.inferSortMode(["Sort comments", "Newest first"]).mode, "NEWEST_FIRST");
  assert.deepEqual(capture.inferSortMode(["Sort comments"]).mode, "UNKNOWN");
});

test("default record construction pseudonymizes public commenter identity", () => {
  const record = capture.recordFromSnapshot(fixture.snapshots[0], {
    videoId: fixture.videoId,
    includePublicAuthors: false
  }, "2026-08-26T00:00:00.000Z");
  assert.equal(record.author.label, "author-001");
  assert.equal(record.author.anonymized, true);
  assert.equal(record.author.publicName, null);
  assert.equal(record.author.publicUrl, null);
  assert.doesNotMatch(JSON.stringify(record), /Visible Creator|visiblecreator/);
});

test("public commenter identity is preserved only under explicit opt-in", () => {
  const record = capture.recordFromSnapshot(fixture.snapshots[0], {
    videoId: fixture.videoId,
    includePublicAuthors: true
  }, "2026-08-26T00:00:00.000Z");
  assert.equal(record.author.anonymized, false);
  assert.equal(record.author.publicName, "Visible Creator");
  assert.equal(record.author.publicUrl, "https://www.youtube.com/@visiblecreator");
});

test("incremental merging retains expanded text, largest visible likes, and flags", () => {
  const first = capture.recordFromSnapshot(fixture.snapshots[0], {
    videoId: fixture.videoId,
    includePublicAuthors: false
  }, "2026-08-26T00:00:00.000Z");
  const fuller = capture.recordFromSnapshot(fixture.snapshots[2], {
    videoId: fixture.videoId,
    includePublicAuthors: false
  }, "2026-08-26T00:00:02.000Z");
  const merged = capture.mergeRecord(first, fuller);
  assert.match(merged.text, /now complete/);
  assert.equal(merged.likes, 1300);
  assert.equal(merged.creatorHeart, true);
  assert.equal(merged.pinned, true);
  assert.equal(merged.captureCount, 2);
});

test("thread construction and Markdown preserve parent relationships without leaking names", () => {
  const comments = [fixture.snapshots[0], fixture.snapshots[1], fixture.snapshots[3]].map((snapshot, index) =>
    capture.recordFromSnapshot(snapshot, {
      videoId: fixture.videoId,
      includePublicAuthors: false
    }, `2026-08-26T00:00:0${index}.000Z`)
  );
  const threads = capture.buildThreads(comments);
  assert.deepEqual(threads[0], { rootId: "UgxRoot001", replyIds: ["UgxReply002"] });
  assert.deepEqual(threads[1], { rootId: "UgxRoot003", replyIds: [] });

  const markdown = capture.payloadToMarkdown({
    schema: "morrow-youtube-comment-capture/v0.1",
    exportedAt: "2026-08-26T00:10:00.000Z",
    video: {
      videoId: fixture.videoId,
      url: `https://www.youtube.com/watch?v=${fixture.videoId}`,
      title: "Fixture video",
      channelName: "Fixture channel"
    },
    sort: { mode: "UNKNOWN", observedText: [] },
    capture: { includePublicAuthors: false },
    threads,
    comments
  });
  assert.match(markdown, /### Reply — author-002/);
  assert.match(markdown, /Parent comment ID: UgxRoot001/);
  assert.match(markdown, /best-effort rendered subset/);
  assert.doesNotMatch(markdown, /Visible Creator|Public Replier|Another Public Person/);
});
