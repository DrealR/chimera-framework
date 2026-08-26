# YouTube Rendered-Comment Capture — Minimal DevTools Runbook

> **Classification:** local, user-triggered observation utility. It is not a YouTube API client, account automation tool, exhaustive scraper, identity dossier, moderation instrument, or engagement bot.

## Why this is the smallest useful path

YouTube loads comments and reply branches incrementally. It can also replace rendered elements as the watch page moves. Copying the page once therefore misses unloaded replies and can lose comments that were previously visible.

This utility keeps each rendered comment or reply in an in-memory map before the page changes. It can click the ordinary visible controls needed to expand comment text and reply branches, move through the already-open page at a bounded pace, and export the observed tree.

The progression remains:

```text
desired evidence
-> use the open watch page's ordinary interface
-> run one bounded local collector
-> inspect the export and its gaps
-> repeat before deciding whether packaging is warranted
```

## Safety and privacy properties

The script:

- installs only on a `youtube.com/watch?v=...` page;
- reads only elements the watch page renders;
- does not call `fetch`, `XMLHttpRequest`, the YouTube API, or an external service;
- does not read cookies, credentials, `localStorage`, or `sessionStorage`;
- does not post, reply, like, dislike, heart, pin, subscribe, report, moderate, or change the selected comment sort;
- clicks only visible comment-local text expanders and visible reply/comment continuation controls with narrow English labels;
- retains data only in the current tab's JavaScript memory until the operator explicitly copies, downloads, resets, or reloads;
- defaults to pseudonymous labels such as `author-001`; public commenter names and channel URLs are excluded unless the operator explicitly enables them before capture;
- stops after bounded scan, idle, or expansion-click limits.

Scrolling and clicking an ordinary reply/continuation control can cause the YouTube page itself to request and render more comments. That is the same page behavior the operator would trigger manually. The utility neither constructs those requests nor obtains their credentials.

## Start from the intended view

1. Open the exact YouTube video and choose the comment sort you want using YouTube's normal interface. The collector observes a recognizable sort label when the rendered page exposes one; it never changes the sort.
2. Scroll until the comments region first appears.
3. Open browser DevTools and select **Console**.
4. Read `youtube-comment-capture.js`, paste the complete file into the Console, and press Enter.
5. Confirm the installation message names the expected video ID. Pasting the file does not start capture.

### Default: anonymized authors, manual scrolling

```js
MorrowYouTubeCapture.start()
```

Scroll normally. The collector rescans the rendered comment window, expands visible `Read more` / `Show more` text, and opens visible reply branches.

### Default: anonymized authors, bounded automatic scrolling

```js
MorrowYouTubeCapture.start({ autoScroll: true })
```

The default automatic run:

- waits at least 1.8 seconds between passes;
- moves roughly 80% of one viewport per pass;
- clicks no more than 12 safe visible expanders per pass;
- stops after at most 400 passes, 20 idle passes, or 2,000 expansion clicks.

These bounds are ceilings, not recommendations to maximize collection. Stop as soon as the evidence you need is present.

### Optional: preserve displayed public author identity

Only use this when public names and channel links materially matter to the analysis:

```js
MorrowYouTubeCapture.start({
  autoScroll: true,
  includePublicAuthors: true
})
```

The Console prints a warning when this mode is active. It preserves only the public author name and public channel path visible beside the rendered comment. It does not inspect an author's channel, infer a real identity, or collect hidden account identifiers.

Author mode locks as soon as a capture begins. This prevents accidentally mixing a supposedly anonymized run with records containing names. Export and reset before changing modes.

## Pause, inspect, and resume

```js
MorrowYouTubeCapture.stop()
MorrowYouTubeCapture.status()

// Records remain in memory.
MorrowYouTubeCapture.start()
MorrowYouTubeCapture.start({ autoScroll: true })
```

If public-author mode was explicitly enabled, it remains active when resuming unless reset. The map deduplicates by the public YouTube comment ID. Re-rendering a comment updates longer expanded text, the largest visible like count, creator-heart status, pinned status, and last-seen time without duplicating the record.

## What the export records

Each JSON export includes:

- video ID, canonical watch URL, rendered title, channel name/URL, and visible comment-count text when observable;
- observed sort mode (`TOP_COMMENTS`, `NEWEST_FIRST`, or `UNKNOWN`) and the rendered text supporting it;
- flat comment records with public comment IDs and canonical deep links;
- `parentId`, `threadId`, and `depth` for the rendered top-level/reply relationship;
- a derived `threads` index containing each observed root and its observed reply IDs;
- rendered text, displayed timestamp, timestamp tooltip/title when present, visible like count, creator-heart, pinned, and edited indicators;
- first-seen, last-seen, and recapture count;
- run provenance, bounds, stop reason, and evidence constraints.

The default export substitutes session-local aliases for authors. Aliases remain consistent for an author during one in-memory run. After an anonymized JSON is imported into a fresh tab, existing labels are preserved and new labels avoid collisions, but a newly rendered comment from the same person may receive a new alias because the identifying name-to-alias map was deliberately not exported.

## Export

Download one representation at a time:

```js
MorrowYouTubeCapture.downloadJSON()
MorrowYouTubeCapture.downloadMarkdown()
```

Or copy it explicitly:

```js
await MorrowYouTubeCapture.copyJSON()
await MorrowYouTubeCapture.copyMarkdown()
```

JSON is the resume/evidence format. Markdown is the readable review surface: root comments are headings and observed replies are nested beneath their parent with direct links and visible flags.

## Resume after a reload

1. Paste `youtube-comment-capture.js` into the same video's watch page again.
2. Open the previously downloaded JSON locally and copy it as text.
3. Import it before restarting:

```js
MorrowYouTubeCapture.importResume(`PASTE THE COMPLETE JSON HERE`)
MorrowYouTubeCapture.start({ autoScroll: true })
```

Import refuses a different schema, video ID, or author-privacy mode.

## Stop and clear

```js
MorrowYouTubeCapture.stop()

// Only after exporting anything you intend to keep:
MorrowYouTubeCapture.reset("RESET")
```

Closing or reloading the tab also removes the in-memory accumulator. It does not delete files that the operator explicitly downloaded.

## Evidence ceiling

- The result is a best-effort subset of comments and replies YouTube actually rendered during this run. It is never proof of completeness.
- Ranking, personalization, region, authentication state, moderation, deletion, held-for-review status, age restrictions, network failures, interface experiments, and reply pagination can all alter what becomes visible.
- Reply relationships are recorded from the rendered thread container. The tool does not infer missing ancestors or hidden descendants.
- Displayed timestamps and counts are time-relative interface observations, not audited event times or analytics.
- Creator-heart and pinned flags are captured only when their rendered badges are visible during a scan.
- Sort mode remains `UNKNOWN` if the current selection is not visible in the rendered DOM. The script does not open or manipulate the sort menu to force an answer.
- The narrow expansion labels are English in v0.1. Other interface languages may leave text or reply branches collapsed until localized labels are reviewed and added deliberately.
- DOM changes can break selectors. A count of zero is a diagnostic result, not evidence that a video has no comments.
- An export is input for human review. It does not authorize automatic profiling, harassment, outreach, publication, moderation, or engagement optimization.
