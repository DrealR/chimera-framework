/*
 * Morrow X Profile Capture v0.1.0
 *
 * Paste this entire file into DevTools Console while viewing your own X profile.
 * It observes only the rendered page, makes no fetch/XHR calls, and never reads
 * cookies, credentials, localStorage, or sessionStorage.
 */
(function installMorrowXProfileCapture(root) {
  "use strict";

  const VERSION = "0.1.0";
  const GLOBAL_NAME = "MorrowXCapture";
  const SCHEMA = "morrow-x-profile-capture/v0.1";
  const STATUS_HOSTS = new Set(["x.com", "www.x.com", "twitter.com", "www.twitter.com"]);
  const RESERVED_PATHS = new Set([
    "compose", "explore", "home", "i", "login", "messages", "notifications",
    "search", "settings", "share", "tos"
  ]);

  function normalizeHandle(value) {
    const handle = String(value || "").trim().replace(/^@/, "").toLowerCase();
    return /^[a-z0-9_]{1,15}$/.test(handle) ? handle : null;
  }

  function inferOwnerHandle(locationLike) {
    if (!locationLike || !STATUS_HOSTS.has(String(locationLike.hostname || "").toLowerCase())) {
      return null;
    }
    const parts = String(locationLike.pathname || "").split("/").filter(Boolean);
    if (!parts.length || RESERVED_PATHS.has(parts[0].toLowerCase()) || parts[1] === "status") {
      return null;
    }
    return normalizeHandle(parts[0]);
  }

  function parseStatusHref(href, expectedOwner) {
    try {
      const url = new URL(String(href || ""), "https://x.com");
      if (!STATUS_HOSTS.has(url.hostname.toLowerCase())) return null;
      const match = url.pathname.match(/^\/([^/]+)\/status\/(\d+)/i);
      if (!match) return null;
      const owner = normalizeHandle(match[1]);
      if (!owner || (expectedOwner && owner !== normalizeHandle(expectedOwner))) return null;
      return {
        owner,
        id: match[2],
        url: `https://x.com/${owner}/status/${match[2]}`
      };
    } catch (_error) {
      return null;
    }
  }

  function chooseOwnedPermalink(links, ownerHandle) {
    const candidates = (Array.isArray(links) ? links : [])
      .map((link, index) => ({
        parsed: parseStatusHref(link && link.href, ownerHandle),
        hasTime: Boolean(link && link.hasTime),
        index
      }))
      .filter((candidate) => candidate.parsed);
    candidates.sort((a, b) => Number(b.hasTime) - Number(a.hasTime) || a.index - b.index);
    return candidates.length ? candidates[0].parsed : null;
  }

  function parseCount(value) {
    const compact = String(value || "").trim().replace(/,/g, "").toUpperCase();
    const match = compact.match(/^(\d+(?:\.\d+)?)\s*([KMB])?$/);
    if (!match) return null;
    const multiplier = { K: 1e3, M: 1e6, B: 1e9 }[match[2]] || 1;
    return Math.round(Number(match[1]) * multiplier);
  }

  function parseMetricsLabels(labels) {
    const result = {};
    const raw = (Array.isArray(labels) ? labels : []).map(String).filter(Boolean);
    const metricNames = {
      reply: "replies",
      replies: "replies",
      repost: "reposts",
      reposts: "reposts",
      like: "likes",
      likes: "likes",
      bookmark: "bookmarks",
      bookmarks: "bookmarks",
      view: "views",
      views: "views"
    };
    for (const label of raw) {
      const pattern = /([\d,.]+\s*[KMB]?)\s+(reply|replies|repost|reposts|like|likes|bookmark|bookmarks|view|views)\b/gi;
      let match;
      while ((match = pattern.exec(label)) !== null) {
        const count = parseCount(match[1]);
        const key = metricNames[match[2].toLowerCase()];
        if (key && count !== null) result[key] = Math.max(result[key] || 0, count);
      }
    }
    return { parsed: result, raw };
  }

  function recordFromSnapshot(snapshot, ownerHandle, capturedAt) {
    const permalink = chooseOwnedPermalink(snapshot && snapshot.links, ownerHandle);
    if (!permalink) return null;
    const metrics = parseMetricsLabels(snapshot.metricLabels);
    const text = String(snapshot.text || "").trim();
    return {
      id: permalink.id,
      ownerHandle: permalink.owner,
      url: permalink.url,
      datetime: snapshot.datetime || null,
      text,
      isReply: Boolean(snapshot.isReply),
      metrics: metrics.parsed,
      metricsRaw: metrics.raw,
      firstSeenAt: capturedAt,
      lastSeenAt: capturedAt,
      captureCount: 1
    };
  }

  function mergeRecord(existing, incoming) {
    if (!existing) return Object.assign({}, incoming);
    const mergedMetrics = Object.assign({}, existing.metrics || {});
    for (const [key, value] of Object.entries(incoming.metrics || {})) {
      mergedMetrics[key] = Math.max(mergedMetrics[key] || 0, value || 0);
    }
    const existingText = String(existing.text || "");
    const incomingText = String(incoming.text || "");
    return Object.assign({}, existing, incoming, {
      text: incomingText.length >= existingText.length ? incomingText : existingText,
      datetime: incoming.datetime || existing.datetime || null,
      metrics: mergedMetrics,
      metricsRaw: Array.from(new Set([...(existing.metricsRaw || []), ...(incoming.metricsRaw || [])])),
      firstSeenAt: existing.firstSeenAt || incoming.firstSeenAt,
      lastSeenAt: incoming.lastSeenAt || existing.lastSeenAt,
      captureCount: Number(existing.captureCount || 1) + 1
    });
  }

  function sortPosts(posts) {
    return posts.slice().sort((a, b) => {
      const aTime = a.datetime ? Date.parse(a.datetime) : NaN;
      const bTime = b.datetime ? Date.parse(b.datetime) : NaN;
      if (Number.isFinite(aTime) && Number.isFinite(bTime) && aTime !== bTime) return aTime - bTime;
      return String(a.id).localeCompare(String(b.id));
    });
  }

  function payloadToMarkdown(payload) {
    const posts = sortPosts(Array.isArray(payload.posts) ? payload.posts : []);
    const lines = [
      `# X profile capture — @${payload.ownerHandle}`,
      "",
      `- Schema: \`${payload.schema || SCHEMA}\``,
      `- Exported: ${payload.exportedAt || new Date().toISOString()}`,
      `- Posts: ${posts.length}`,
      ""
    ];
    for (const post of posts) {
      const timestamp = post.datetime || "time unavailable";
      const metrics = Object.entries(post.metrics || {})
        .map(([key, value]) => `${key}=${value}`)
        .join(", ");
      lines.push(`## ${timestamp}${post.isReply ? " — reply" : ""}`);
      lines.push("");
      lines.push(post.text || "_[No rendered text captured]_ ".trim());
      lines.push("");
      lines.push(`- URL: ${post.url}`);
      if (metrics) lines.push(`- Visible metrics at capture: ${metrics}`);
      lines.push("");
    }
    return `${lines.join("\n")}\n`;
  }

  const testApi = {
    normalizeHandle,
    inferOwnerHandle,
    parseStatusHref,
    chooseOwnedPermalink,
    parseCount,
    parseMetricsLabels,
    recordFromSnapshot,
    mergeRecord,
    sortPosts,
    payloadToMarkdown
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = testApi;
    return;
  }

  if (!root || !root.document || !root.location) return;
  if (!STATUS_HOSTS.has(String(root.location.hostname || "").toLowerCase())) {
    throw new Error("MorrowXCapture only installs on x.com or twitter.com.");
  }
  if (root[GLOBAL_NAME]) {
    root[GLOBAL_NAME].status();
    return;
  }

  const inferredOwner = inferOwnerHandle(root.location);
  if (!inferredOwner) {
    throw new Error("Open an X profile page (not Home, Search, or a single status) before installing MorrowXCapture.");
  }

  const state = {
    ownerHandle: inferredOwner,
    posts: new Map(),
    running: false,
    busy: false,
    timer: null,
    scanPasses: 0,
    scrollPasses: 0,
    idlePasses: 0,
    startedAt: null,
    updatedAt: null,
    stopReason: null,
    settings: null
  };

  function isVisible(element) {
    if (!element || typeof element.getBoundingClientRect !== "function") return false;
    const rect = element.getBoundingClientRect();
    const style = root.getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
  }

  function clickVisibleShowMore(article) {
    const textRegion = article.querySelector('[data-testid="tweetText"]');
    if (!textRegion) return 0;
    const candidates = textRegion.querySelectorAll('button, [role="button"], a, span');
    const clickedTargets = new Set();
    let clicks = 0;
    for (const candidate of candidates) {
      const label = String(candidate.innerText || candidate.textContent || "").trim().replace(/\s+/g, " ");
      if (label === "Show more" && isVisible(candidate)) {
        const target = candidate.closest('button, [role="button"], a') || candidate;
        if (clickedTargets.has(target)) continue;
        clickedTargets.add(target);
        target.click();
        clicks += 1;
      }
    }
    return clicks;
  }

  function elementSnapshot(article) {
    const links = Array.from(article.querySelectorAll('a[href*="/status/"]')).map((link) => ({
      href: link.getAttribute("href") || link.href,
      hasTime: Boolean(link.querySelector("time"))
    }));
    const ownedPermalink = chooseOwnedPermalink(links, state.ownerHandle);
    let datetime = null;
    if (ownedPermalink) {
      const timeLink = Array.from(article.querySelectorAll('a[href*="/status/"]')).find((link) => {
        const parsed = parseStatusHref(link.getAttribute("href") || link.href, state.ownerHandle);
        return parsed && parsed.id === ownedPermalink.id && link.querySelector("time[datetime]");
      });
      const time = timeLink && timeLink.querySelector("time[datetime]");
      datetime = time ? time.getAttribute("datetime") : null;
    }
    const tweetText = article.querySelector('[data-testid="tweetText"]');
    const articleText = String(article.innerText || article.textContent || "");
    const metricLabels = Array.from(article.querySelectorAll('[role="group"][aria-label], [data-testid][aria-label]'))
      .map((element) => element.getAttribute("aria-label"))
      .filter(Boolean);
    return {
      links,
      datetime,
      text: tweetText ? String(tweetText.innerText || tweetText.textContent || "") : "",
      isReply: /\bReplying to\b/i.test(articleText),
      metricLabels
    };
  }

  function currentPayload() {
    return {
      schema: SCHEMA,
      toolVersion: VERSION,
      ownerHandle: state.ownerHandle,
      source: `https://x.com/${state.ownerHandle}`,
      exportedAt: new Date().toISOString(),
      capture: {
        startedAt: state.startedAt,
        updatedAt: state.updatedAt,
        scanPasses: state.scanPasses,
        scrollPasses: state.scrollPasses,
        stopReason: state.stopReason
      },
      posts: sortPosts(Array.from(state.posts.values()))
    };
  }

  async function scanOnce(options) {
    const settings = Object.assign({ expansionDelayMs: 350 }, options || {});
    if (state.busy) return { added: 0, total: state.posts.size, skipped: "scan already running" };
    state.busy = true;
    try {
      const articles = Array.from(root.document.querySelectorAll("article"));
      let showMoreClicks = 0;
      for (const article of articles) showMoreClicks += clickVisibleShowMore(article);
      if (showMoreClicks) {
        await new Promise((resolve) => root.setTimeout(resolve, settings.expansionDelayMs));
      }
      const capturedAt = new Date().toISOString();
      let added = 0;
      for (const article of Array.from(root.document.querySelectorAll("article"))) {
        const incoming = recordFromSnapshot(elementSnapshot(article), state.ownerHandle, capturedAt);
        if (!incoming) continue;
        const existing = state.posts.get(incoming.id);
        if (!existing) added += 1;
        state.posts.set(incoming.id, mergeRecord(existing, incoming));
      }
      state.scanPasses += 1;
      state.updatedAt = capturedAt;
      return { added, total: state.posts.size, articles: articles.length, showMoreClicks };
    } finally {
      state.busy = false;
    }
  }

  function stop(reason) {
    if (state.timer) root.clearTimeout(state.timer);
    state.timer = null;
    state.running = false;
    state.stopReason = reason || "operator stop";
    console.info(`[MorrowXCapture] stopped: ${state.stopReason}; ${state.posts.size} posts retained in memory.`);
    return api.status();
  }

  function scheduleTick() {
    if (!state.running) return;
    state.timer = root.setTimeout(async () => {
      const result = await scanOnce(state.settings);
      state.idlePasses = result.added > 0 ? 0 : state.idlePasses + 1;
      if (!state.running) return;
      if ((state.scanPasses - state.settings.startingScanPasses) >= state.settings.maxPasses) {
        return stop("maximum scan passes reached");
      }
      if (state.idlePasses >= state.settings.idlePasses) return stop("no new authored posts in recent passes");
      if (state.settings.autoScroll) {
        root.scrollBy({ top: state.settings.scrollStepPx, left: 0, behavior: "auto" });
        state.scrollPasses += 1;
      }
      scheduleTick();
    }, state.settings.intervalMs);
  }

  function start(options) {
    if (state.running) return api.status();
    const supplied = options || {};
    state.settings = {
      autoScroll: supplied.autoScroll === true,
      intervalMs: Math.max(750, Number(supplied.intervalMs || 1400)),
      expansionDelayMs: Math.max(100, Number(supplied.expansionDelayMs || 350)),
      maxPasses: Math.max(1, Number(supplied.maxPasses || 300)),
      idlePasses: Math.max(2, Number(supplied.idlePasses || 16)),
      scrollStepPx: Math.max(200, Number(supplied.scrollStepPx || Math.round(root.innerHeight * 0.8))),
      startingScanPasses: state.scanPasses
    };
    state.idlePasses = 0;
    state.startedAt = state.startedAt || new Date().toISOString();
    state.stopReason = null;
    state.running = true;
    console.info(
      `[MorrowXCapture] capturing @${state.ownerHandle}. ` +
      `${state.settings.autoScroll ? "Bounded auto-scroll is ON." : "Scroll manually."} ` +
      `Run MorrowXCapture.stop() at any time.`
    );
    scanOnce(state.settings).then(() => scheduleTick());
    return api.status();
  }

  function status() {
    const summary = {
      version: VERSION,
      ownerHandle: state.ownerHandle,
      running: state.running,
      retainedPosts: state.posts.size,
      scanPasses: state.scanPasses,
      scrollPasses: state.scrollPasses,
      idlePasses: state.idlePasses,
      stopReason: state.stopReason,
      settings: state.settings
    };
    console.table(summary);
    return summary;
  }

  function download(filename, text, type) {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const link = root.document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    root.document.body.appendChild(link);
    link.click();
    link.remove();
    root.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function safeFileStem() {
    return `x-profile-${state.ownerHandle}-${new Date().toISOString().replace(/[:.]/g, "-")}`;
  }

  async function copyText(text) {
    if (!root.navigator.clipboard || !root.navigator.clipboard.writeText) {
      throw new Error("Clipboard API unavailable. Use downloadJSON() or downloadMarkdown().");
    }
    await root.navigator.clipboard.writeText(text);
    return text.length;
  }

  function importResume(value) {
    const payload = typeof value === "string" ? JSON.parse(value) : value;
    if (!payload || payload.schema !== SCHEMA || normalizeHandle(payload.ownerHandle) !== state.ownerHandle) {
      throw new Error(`Resume data must use ${SCHEMA} and belong to @${state.ownerHandle}.`);
    }
    let added = 0;
    for (const post of Array.isArray(payload.posts) ? payload.posts : []) {
      if (!post || !/^\d+$/.test(String(post.id || ""))) continue;
      const permalink = parseStatusHref(post.url, state.ownerHandle);
      if (!permalink || permalink.id !== String(post.id)) continue;
      const existing = state.posts.get(String(post.id));
      if (!existing) added += 1;
      state.posts.set(String(post.id), mergeRecord(existing, post));
    }
    console.info(`[MorrowXCapture] imported ${added} new records; ${state.posts.size} total retained.`);
    return api.status();
  }

  function reset(confirmText) {
    if (confirmText !== "RESET") throw new Error('Reset is destructive. Run MorrowXCapture.reset("RESET") to confirm.');
    stop("operator reset");
    state.posts.clear();
    state.scanPasses = 0;
    state.scrollPasses = 0;
    state.idlePasses = 0;
    state.startedAt = null;
    state.updatedAt = null;
    state.stopReason = null;
    return api.status();
  }

  const api = {
    version: VERSION,
    start,
    stop,
    scanOnce,
    status,
    exportJSON: () => `${JSON.stringify(currentPayload(), null, 2)}\n`,
    exportMarkdown: () => payloadToMarkdown(currentPayload()),
    copyJSON: () => copyText(`${JSON.stringify(currentPayload(), null, 2)}\n`),
    copyMarkdown: () => copyText(payloadToMarkdown(currentPayload())),
    downloadJSON: () => download(`${safeFileStem()}.json`, `${JSON.stringify(currentPayload(), null, 2)}\n`, "application/json"),
    downloadMarkdown: () => download(`${safeFileStem()}.md`, payloadToMarkdown(currentPayload()), "text/markdown"),
    importResume,
    reset
  };

  root[GLOBAL_NAME] = api;
  console.info(
    `[MorrowXCapture] installed for @${state.ownerHandle}. Nothing is running yet.\n` +
    `Manual scroll: MorrowXCapture.start()\n` +
    `Bounded auto-scroll: MorrowXCapture.start({ autoScroll: true })\n` +
    `Stop: MorrowXCapture.stop()`
  );
})(typeof window !== "undefined" ? window : undefined);
