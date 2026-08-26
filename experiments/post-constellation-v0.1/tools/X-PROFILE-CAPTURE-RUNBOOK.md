# X Profile Capture — Minimal DevTools Runbook

> **Classification:** local, user-triggered utility. It is not an X API client, background scraper, posting tool, analytics authority, or credential instrument.

## Why this is the smallest useful path

X virtualizes its profile timeline: older post elements disappear from the DOM as the page scrolls. Copying the page after scrolling therefore loses material. This console utility collects each rendered authored post into an in-memory map before X removes its element.

Package an extension only if this local path proves useful repeatedly and its remaining friction is observable. The current progression is:

```text
desired result
-> use the open profile's existing interface
-> run one bounded local collector
-> export and inspect the result
-> repeat before packaging
```

## Safety properties

The script:

- installs only on `x.com` or `twitter.com` profile pages;
- infers the profile handle from the open URL and keeps only status permalinks authored by that handle;
- reads only rendered page elements;
- does not read cookies, credentials, `localStorage`, or `sessionStorage`;
- does not call `fetch`, `XMLHttpRequest`, an API, or an external service;
- clicks only visible elements whose exact English label is `Show more` and that are inside rendered post articles;
- does not like, reply, repost, follow, publish, or modify the account;
- retains records in the current tab's JavaScript memory until reset or reload;
- exports only when the operator explicitly invokes a copy or download method.

Scrolling the already-open timeline can cause X itself to load its next ordinary timeline page. The utility does not create that request or obtain any credential; it only observes what the existing page renders.

## Start

1. Open your own X profile in the timeline tab you want to capture. Start near the top. The profile root, Posts, or Replies tab is acceptable; the export marks rendered replies when X exposes the `Replying to` label.
2. Open browser DevTools and select **Console**.
3. Read `x-profile-capture.js`, then paste the complete file into the Console and press Enter.
4. Confirm the installation message names the correct `@handle`. Nothing runs merely because the file was pasted.

Choose one mode:

```js
// You control the scrolling. The collector rescans the rendered window.
MorrowXCapture.start()
```

```js
// The collector advances by about 80% of a viewport per pass.
// It stops after 300 passes or 16 passes without a new authored post.
MorrowXCapture.start({ autoScroll: true })
```

The automatic mode is bounded but may take several minutes on a long profile. Keep the tab active enough for the browser to execute timers. X can change its page structure; watch the retained count rather than assuming complete capture.

## Pause, inspect, and resume

```js
MorrowXCapture.stop()
MorrowXCapture.status()

// Existing records remain in memory, so either mode resumes from them.
MorrowXCapture.start()
MorrowXCapture.start({ autoScroll: true })
```

The map deduplicates by the numeric X status ID. Seeing the same virtualized element again updates longer text and the largest visible metric counts without duplicating the post.

## Export

Download one file at a time:

```js
MorrowXCapture.downloadJSON()
MorrowXCapture.downloadMarkdown()
```

Or copy one representation:

```js
await MorrowXCapture.copyJSON()
await MorrowXCapture.copyMarkdown()
```

The JSON is the resume format and preserves URL, timestamp, rendered text, reply classification, visible metrics, raw metric labels, and capture times. The Markdown is ordered oldest-to-newest when timestamps are available, making profile progression easier to inspect.

## Resume after a reload

The safest durable resume state is the JSON you explicitly downloaded. After a reload:

1. paste `x-profile-capture.js` again;
2. load the JSON as text yourself (for example by opening it locally and copying it);
3. import it, then resume:

```js
MorrowXCapture.importResume(`PASTE THE COMPLETE JSON HERE`)
MorrowXCapture.start({ autoScroll: true })
```

The import refuses data with a different schema or profile handle.

## Stop and clear

```js
MorrowXCapture.stop()

// Only after exporting anything you want to retain:
MorrowXCapture.reset("RESET")
```

Closing or reloading the tab also clears the in-memory accumulator. It does not delete an explicitly downloaded export.

## Evidence ceiling

- The capture is a best-effort record of posts that X actually rendered during the run, not proof of profile completeness.
- Deleted, withheld, rate-limited, search-excluded, or never-rendered posts cannot be recovered by this tool.
- Visible counters are time-relative UI observations, not audited analytics.
- English `Show more` expansion is supported in v0.1. Other interface languages may export truncated text until a localized label is added deliberately.
- A profile export is input for operator review. It does not authorize automatic analysis, publication, deletion, or engagement optimization.

