/*
 * Morrow YouTube Comment Capture v0.1.0
 *
 * Paste this entire file into DevTools Console on a YouTube watch page.
 * It observes and expands only the rendered comments interface. It does not
 * call fetch/XHR, use the YouTube API, or read cookies, credentials, storage,
 * or non-rendered account data.
 */
(function installMorrowYouTubeCommentCapture(root) {
  "use strict";

  const VERSION = "0.1.0";
  const GLOBAL_NAME = "MorrowYouTubeCapture";
  const SCHEMA = "morrow-youtube-comment-capture/v0.1";
  const WATCH_HOSTS = new Set([
    "youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com"
  ]);

  function normalizeText(value) {
    return String(value || "").replace(/\u00a0/g, " ").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  }

  function parseWatchLocation(locationLike) {
    if (!locationLike || !WATCH_HOSTS.has(String(locationLike.hostname || "").toLowerCase())) return null;
    if (String(locationLike.pathname || "") !== "/watch") return null;
    try {
      const search = new URLSearchParams(String(locationLike.search || ""));
      const videoId = search.get("v");
      if (!videoId || !/^[A-Za-z0-9_-]{6,20}$/.test(videoId)) return null;
      return {
        videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`
      };
    } catch (_error) {
      return null;
    }
  }

  function parseCommentPermalink(href, expectedVideoId) {
    try {
      const url = new URL(String(href || ""), "https://www.youtube.com");
      if (!WATCH_HOSTS.has(url.hostname.toLowerCase()) || url.pathname !== "/watch") return null;
      const videoId = url.searchParams.get("v") || expectedVideoId || null;
      const commentId = url.searchParams.get("lc");
      if (!videoId || videoId !== expectedVideoId || !commentId || !/^[A-Za-z0-9_.-]{4,256}$/.test(commentId)) {
        return null;
      }
      return {
        id: commentId,
        videoId,
        url: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&lc=${encodeURIComponent(commentId)}`
      };
    } catch (_error) {
      return null;
    }
  }

  function parseCompactCount(value) {
    const normalized = normalizeText(value).replace(/,/g, "").toUpperCase();
    if (!normalized || /^(?:LIKE|LIKES|NO LIKES?)$/.test(normalized)) return null;
    const match = normalized.match(/^(\d+(?:\.\d+)?)\s*([KMB])?$/);
    if (!match) return null;
    const multiplier = { K: 1e3, M: 1e6, B: 1e9 }[match[2]] || 1;
    return Math.round(Number(match[1]) * multiplier);
  }

  function inferSortMode(observations) {
    const raw = Array.from(new Set((Array.isArray(observations) ? observations : [])
      .map(normalizeText)
      .filter(Boolean)));
    const joined = raw.join(" | ").toLowerCase();
    let mode = "UNKNOWN";
    if (/\bnewest first\b|\bmost recent\b/.test(joined)) mode = "NEWEST_FIRST";
    else if (/\btop comments\b/.test(joined)) mode = "TOP_COMMENTS";
    return { mode, observedText: raw };
  }

  function safeAuthor(author, includePublicAuthors) {
    const source = author || {};
    const label = /^author-\d+$/i.test(String(source.label || "")) ? String(source.label) : "author-unknown";
    return {
      label,
      anonymized: !includePublicAuthors,
      publicName: includePublicAuthors ? normalizeText(source.publicName) || null : null,
      publicUrl: includePublicAuthors ? String(source.publicUrl || "").trim() || null : null
    };
  }

  function recordFromSnapshot(snapshot, context, capturedAt) {
    const source = snapshot || {};
    const options = context || {};
    const permalink = parseCommentPermalink(source.permalink, options.videoId);
    if (!permalink) return null;
    const isReply = Boolean(source.isReply);
    const parentId = isReply && source.parentId && source.parentId !== permalink.id
      ? String(source.parentId)
      : null;
    const threadId = String(source.threadId || parentId || permalink.id);
    return {
      id: permalink.id,
      url: permalink.url,
      videoId: permalink.videoId,
      parentId,
      threadId,
      depth: parentId ? 1 : 0,
      text: normalizeText(source.text),
      author: safeAuthor(source.author, options.includePublicAuthors === true),
      visibleTimestamp: normalizeText(source.visibleTimestamp) || null,
      timestampTitle: normalizeText(source.timestampTitle) || null,
      likes: parseCompactCount(source.likesText),
      likesText: normalizeText(source.likesText) || null,
      creatorHeart: Boolean(source.creatorHeart),
      pinned: Boolean(source.pinned),
      edited: Boolean(source.edited || /\(edited\)/i.test(String(source.visibleTimestamp || ""))),
      firstSeenAt: capturedAt,
      lastSeenAt: capturedAt,
      captureCount: 1
    };
  }

  function mergeRecord(existing, incoming) {
    if (!existing) return Object.assign({}, incoming);
    const existingText = normalizeText(existing.text);
    const incomingText = normalizeText(incoming.text);
    const publicAuthor = incoming.author && incoming.author.publicName
      ? incoming.author
      : existing.author;
    return Object.assign({}, existing, incoming, {
      parentId: existing.parentId || incoming.parentId || null,
      threadId: existing.threadId || incoming.threadId || incoming.id,
      depth: Math.max(Number(existing.depth || 0), Number(incoming.depth || 0)),
      text: incomingText.length >= existingText.length ? incomingText : existingText,
      author: publicAuthor || incoming.author || existing.author,
      visibleTimestamp: incoming.visibleTimestamp || existing.visibleTimestamp || null,
      timestampTitle: incoming.timestampTitle || existing.timestampTitle || null,
      likes: Math.max(Number(existing.likes || 0), Number(incoming.likes || 0)) || null,
      likesText: incoming.likesText || existing.likesText || null,
      creatorHeart: Boolean(existing.creatorHeart || incoming.creatorHeart),
      pinned: Boolean(existing.pinned || incoming.pinned),
      edited: Boolean(existing.edited || incoming.edited),
      firstSeenAt: existing.firstSeenAt || incoming.firstSeenAt,
      lastSeenAt: incoming.lastSeenAt || existing.lastSeenAt,
      captureCount: Number(existing.captureCount || 1) + 1
    });
  }

  function buildThreads(comments) {
    const records = (Array.isArray(comments) ? comments : []).filter((comment) => comment && comment.id);
    const byId = new Map(records.map((comment) => [String(comment.id), comment]));
    const roots = records.filter((comment) => !comment.parentId || !byId.has(String(comment.parentId)));
    const orderedRoots = roots.slice().sort((a, b) => String(a.firstSeenAt || "").localeCompare(String(b.firstSeenAt || "")));
    return orderedRoots.map((root) => ({
      rootId: String(root.id),
      replyIds: records
        .filter((comment) => String(comment.parentId || "") === String(root.id))
        .sort((a, b) => String(a.firstSeenAt || "").localeCompare(String(b.firstSeenAt || "")))
        .map((comment) => String(comment.id))
    }));
  }

  function payloadToMarkdown(payload) {
    const comments = Array.isArray(payload.comments) ? payload.comments : [];
    const byId = new Map(comments.map((comment) => [String(comment.id), comment]));
    const threads = Array.isArray(payload.threads) ? payload.threads : buildThreads(comments);
    const video = payload.video || {};
    const capture = payload.capture || {};
    const lines = [
      `# YouTube rendered-comment capture — ${video.title || video.videoId || "unknown video"}`,
      "",
      `- Schema: \`${payload.schema || SCHEMA}\``,
      `- Video: ${video.url || "unavailable"}`,
      `- Channel: ${video.channelName || "unavailable"}`,
      `- Exported: ${payload.exportedAt || new Date().toISOString()}`,
      `- Sort mode observed: ${(payload.sort && payload.sort.mode) || "UNKNOWN"}`,
      `- Captured records: ${comments.length} across ${threads.length} observed threads`,
      `- Author mode: ${capture.includePublicAuthors ? "explicit public-author preservation" : "anonymized (default)"}`,
      `- Completeness: best-effort rendered subset; not proof of all video comments`,
      ""
    ];

    function appendComment(comment, reply) {
      if (!comment) return;
      const flags = [
        comment.pinned ? "pinned" : null,
        comment.creatorHeart ? "creator heart visible" : null,
        comment.edited ? "edited" : null
      ].filter(Boolean);
      const author = comment.author || {};
      const authorText = capture.includePublicAuthors && author.publicName
        ? `${author.publicName} (${author.label || "author"})`
        : author.label || "author-unknown";
      lines.push(`${reply ? "###" : "##"} ${reply ? "Reply" : "Comment"} — ${authorText}`);
      lines.push("");
      lines.push(comment.text || "_[No rendered comment text captured]_");
      lines.push("");
      lines.push(`- URL: ${comment.url}`);
      lines.push(`- Visible timestamp: ${comment.visibleTimestamp || "unavailable"}`);
      if (comment.likes !== null && comment.likes !== undefined) lines.push(`- Visible likes: ${comment.likes}`);
      if (flags.length) lines.push(`- Visible flags: ${flags.join(", ")}`);
      if (reply) lines.push(`- Parent comment ID: ${comment.parentId}`);
      lines.push("");
    }

    for (const thread of threads) {
      appendComment(byId.get(String(thread.rootId)), false);
      for (const replyId of thread.replyIds || []) appendComment(byId.get(String(replyId)), true);
    }
    return `${lines.join("\n")}\n`;
  }

  const testApi = {
    normalizeText,
    parseWatchLocation,
    parseCommentPermalink,
    parseCompactCount,
    inferSortMode,
    safeAuthor,
    recordFromSnapshot,
    mergeRecord,
    buildThreads,
    payloadToMarkdown
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = testApi;
    return;
  }

  if (!root || !root.document || !root.location) return;
  const watch = parseWatchLocation(root.location);
  if (!watch) throw new Error("MorrowYouTubeCapture installs only on a youtube.com/watch?v=... page.");
  if (root[GLOBAL_NAME]) {
    root[GLOBAL_NAME].status();
    return;
  }

  const state = {
    videoId: watch.videoId,
    sourceUrl: watch.url,
    comments: new Map(),
    authorAliases: new Map(),
    nextAuthorNumber: 1,
    includePublicAuthors: false,
    privacyLocked: false,
    running: false,
    busy: false,
    timer: null,
    scanPasses: 0,
    scrollPasses: 0,
    idlePasses: 0,
    expansionClicks: 0,
    clickedElements: new WeakSet(),
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

  function publicElementLabel(element) {
    return normalizeText(
      (element && element.getAttribute && element.getAttribute("aria-label")) ||
      (element && element.getAttribute && element.getAttribute("title")) ||
      (element && (element.innerText || element.textContent))
    );
  }

  function commentsRoot() {
    return root.document.querySelector("ytd-comments#comments, ytd-comments");
  }

  function safeClickTarget(element) {
    return element && (element.closest("button, tp-yt-paper-button, [role='button']") || element);
  }

  function clickVisibleExpansions(limit) {
    const region = commentsRoot();
    if (!region) return { textClicks: 0, replyClicks: 0, continuationClicks: 0 };
    const remaining = Math.max(0, Number(limit || 0));
    let total = 0;
    let textClicks = 0;
    let replyClicks = 0;
    let continuationClicks = 0;

    const comments = Array.from(region.querySelectorAll("ytd-comment-view-model, ytd-comment-renderer"));
    for (const comment of comments) {
      if (total >= remaining) break;
      const candidates = comment.querySelectorAll("#more, #more-button, button, tp-yt-paper-button, [role='button']");
      for (const candidate of candidates) {
        const target = safeClickTarget(candidate);
        const label = publicElementLabel(target);
        if (!/^(?:Read|Show) more$/i.test(label) || !isVisible(target) || state.clickedElements.has(target)) continue;
        state.clickedElements.add(target);
        target.click();
        textClicks += 1;
        total += 1;
        break;
      }
    }

    const controls = region.querySelectorAll("button, tp-yt-paper-button, [role='button']");
    for (const candidate of controls) {
      if (total >= remaining) break;
      const target = safeClickTarget(candidate);
      if (!target || state.clickedElements.has(target) || !isVisible(target)) continue;
      const label = publicElementLabel(target);
      const inReplyRegion = Boolean(target.closest("ytd-comment-thread-renderer, ytd-comment-replies-renderer, #replies"));
      const inContinuation = Boolean(target.closest("ytd-continuation-item-renderer"));
      const replyLabel = /^(?:(?:View|Show) (?:\d+ )?(?:more )?repl(?:y|ies)|Show more replies)$/i.test(label);
      const continuationLabel = /^(?:Show|Load) more comments$/i.test(label);
      if (replyLabel && inReplyRegion) {
        state.clickedElements.add(target);
        target.click();
        replyClicks += 1;
        total += 1;
      } else if (continuationLabel && inContinuation) {
        state.clickedElements.add(target);
        target.click();
        continuationClicks += 1;
        total += 1;
      }
    }
    return { textClicks, replyClicks, continuationClicks };
  }

  function visibleCommentElements(thread) {
    const modern = Array.from(thread.querySelectorAll("ytd-comment-view-model"));
    const candidates = modern.length ? modern : Array.from(thread.querySelectorAll("ytd-comment-renderer"));
    return candidates.filter((element, index) => {
      if (!isVisible(element)) return false;
      return candidates.findIndex((candidate) => candidate === element) === index;
    });
  }

  function commentIdFromElement(element) {
    const timeLinks = Array.from(element.querySelectorAll("#published-time-text a[href*='lc='], a[href*='lc=']"));
    for (const link of timeLinks) {
      const parsed = parseCommentPermalink(link.getAttribute("href") || link.href, state.videoId);
      if (parsed) return parsed;
    }
    const attributeId = element.getAttribute("comment-id") || element.getAttribute("data-comment-id");
    if (attributeId && /^[A-Za-z0-9_.-]{4,256}$/.test(attributeId)) {
      return {
        id: attributeId,
        videoId: state.videoId,
        url: `https://www.youtube.com/watch?v=${encodeURIComponent(state.videoId)}&lc=${encodeURIComponent(attributeId)}`
      };
    }
    return null;
  }

  function authorAlias(publicName, publicUrl) {
    const key = String(publicUrl || "").trim() || `name:${normalizeText(publicName).toLowerCase()}`;
    if (!state.authorAliases.has(key)) {
      const label = `author-${String(state.nextAuthorNumber).padStart(3, "0")}`;
      state.nextAuthorNumber += 1;
      state.authorAliases.set(key, label);
    }
    return state.authorAliases.get(key);
  }

  function commentElementSnapshot(element, relation) {
    const permalink = commentIdFromElement(element);
    if (!permalink) return null;
    const authorLink = element.querySelector("#author-text[href], #author-text a[href], a#author-text[href]");
    const authorText = element.querySelector("#author-text, #author-text span");
    const publicName = normalizeText(authorText && (authorText.innerText || authorText.textContent));
    let publicUrl = null;
    if (authorLink) {
      try {
        const candidate = new URL(authorLink.getAttribute("href") || authorLink.href, "https://www.youtube.com");
        if (WATCH_HOSTS.has(candidate.hostname.toLowerCase()) && /^\/(?:@|channel\/|c\/|user\/)/.test(candidate.pathname)) {
          publicUrl = `https://www.youtube.com${candidate.pathname}`;
        }
      } catch (_error) {
        publicUrl = null;
      }
    }
    const timestampLink = element.querySelector("#published-time-text a, a[href*='lc=']");
    const timestampText = normalizeText(timestampLink && (timestampLink.innerText || timestampLink.textContent));
    const timestampTitle = normalizeText(timestampLink && (timestampLink.getAttribute("title") || timestampLink.getAttribute("aria-label")));
    const textElement = element.querySelector("#content-text, yt-attributed-string#content-text");
    const likesElement = element.querySelector("#vote-count-middle, #vote-count-left");
    const creatorHeart = Array.from(element.querySelectorAll("#creator-heart, ytd-creator-heart-renderer, [id*='creator-heart']"))
      .some(isVisible);
    const pinned = Array.from(element.querySelectorAll("ytd-pinned-comment-badge-renderer, #pinned-comment-badge, [id*='pinned-comment-badge']"))
      .some(isVisible);
    return {
      permalink: permalink.url,
      text: normalizeText(textElement && (textElement.innerText || textElement.textContent)),
      author: {
        label: authorAlias(publicName, publicUrl),
        publicName,
        publicUrl
      },
      visibleTimestamp: timestampText,
      timestampTitle,
      likesText: normalizeText(likesElement && (likesElement.innerText || likesElement.textContent)),
      creatorHeart,
      pinned,
      edited: /\(edited\)/i.test(timestampText),
      isReply: Boolean(relation && relation.isReply),
      parentId: relation && relation.parentId,
      threadId: relation && relation.threadId
    };
  }

  function metadataSnapshot() {
    const titleElement = root.document.querySelector("ytd-watch-metadata h1 yt-formatted-string, h1.title yt-formatted-string, meta[itemprop='name']");
    const channelLink = root.document.querySelector("ytd-video-owner-renderer #channel-name a[href], #owner #channel-name a[href]");
    const channelElement = root.document.querySelector("ytd-video-owner-renderer #channel-name, #owner #channel-name");
    const title = titleElement && titleElement.tagName === "META"
      ? normalizeText(titleElement.getAttribute("content"))
      : normalizeText(titleElement && (titleElement.innerText || titleElement.textContent));
    let channelUrl = null;
    if (channelLink) {
      try {
        const candidate = new URL(channelLink.getAttribute("href") || channelLink.href, "https://www.youtube.com");
        if (WATCH_HOSTS.has(candidate.hostname.toLowerCase())) channelUrl = `https://www.youtube.com${candidate.pathname}`;
      } catch (_error) {
        channelUrl = null;
      }
    }
    const countElement = root.document.querySelector("ytd-comments-header-renderer #count, ytd-comments-header-renderer #count-text");
    return {
      videoId: state.videoId,
      url: state.sourceUrl,
      title: title || normalizeText(root.document.title).replace(/\s*-\s*YouTube\s*$/i, "") || null,
      channelName: normalizeText(channelElement && (channelElement.innerText || channelElement.textContent)) || null,
      channelUrl,
      visibleCommentCountText: normalizeText(countElement && (countElement.innerText || countElement.textContent)) || null
    };
  }

  function sortSnapshot() {
    const header = root.document.querySelector("ytd-comments-header-renderer");
    if (!header) return { mode: "UNKNOWN", observedText: [] };
    const observations = Array.from(header.querySelectorAll("#sort-menu, [aria-checked='true'], [aria-selected='true'], [aria-label*='comments' i]"))
      .flatMap((element) => [element.getAttribute("aria-label"), element.getAttribute("title"), element.innerText || element.textContent])
      .filter(Boolean);
    return inferSortMode(observations);
  }

  function currentPayload() {
    const comments = Array.from(state.comments.values());
    return {
      schema: SCHEMA,
      toolVersion: VERSION,
      exportedAt: new Date().toISOString(),
      video: metadataSnapshot(),
      sort: sortSnapshot(),
      capture: {
        provenance: "operator-triggered observation of the already-rendered YouTube watch-page interface",
        completeness: "best_effort_rendered_subset",
        includePublicAuthors: state.includePublicAuthors,
        startedAt: state.startedAt,
        updatedAt: state.updatedAt,
        scanPasses: state.scanPasses,
        scrollPasses: state.scrollPasses,
        expansionClicks: state.expansionClicks,
        stopReason: state.stopReason,
        constraints: [
          "no YouTube API, fetch, XMLHttpRequest, cookies, credentials, or browser storage",
          "no posting, replying, liking, subscribing, moderation, or account mutation",
          "only comments and replies actually rendered during this bounded run can be retained",
          "visible timestamps, counts, badges, sort state, and thread relationships are time-relative UI observations"
        ]
      },
      threads: buildThreads(comments),
      comments
    };
  }

  async function scanOnce(options) {
    const settings = Object.assign({ expansionDelayMs: 800, maxClicksPerPass: 12 }, options || {});
    if (state.busy) return { added: 0, total: state.comments.size, skipped: "scan already running" };
    state.busy = true;
    try {
      const clicksLeft = Math.max(0, Number(settings.maxTotalExpansionClicks || 2000) - state.expansionClicks);
      const expansion = clickVisibleExpansions(Math.min(settings.maxClicksPerPass, clicksLeft));
      const expansionCount = expansion.textClicks + expansion.replyClicks + expansion.continuationClicks;
      state.expansionClicks += expansionCount;
      if (expansionCount) await new Promise((resolve) => root.setTimeout(resolve, settings.expansionDelayMs));

      const capturedAt = new Date().toISOString();
      let added = 0;
      const region = commentsRoot();
      const threads = region ? Array.from(region.querySelectorAll("ytd-comment-thread-renderer")) : [];
      for (const thread of threads) {
        const elements = visibleCommentElements(thread);
        const topElement = elements.find((element) => !element.closest("ytd-comment-replies-renderer")) || elements[0];
        if (!topElement) continue;
        const topPermalink = commentIdFromElement(topElement);
        if (!topPermalink) continue;
        for (const element of elements) {
          const isReply = element !== topElement && Boolean(element.closest("ytd-comment-replies-renderer, #replies"));
          const snapshot = commentElementSnapshot(element, {
            isReply,
            parentId: isReply ? topPermalink.id : null,
            threadId: topPermalink.id
          });
          const incoming = recordFromSnapshot(snapshot, {
            videoId: state.videoId,
            includePublicAuthors: state.includePublicAuthors
          }, capturedAt);
          if (!incoming) continue;
          const existing = state.comments.get(incoming.id);
          if (!existing) added += 1;
          state.comments.set(incoming.id, mergeRecord(existing, incoming));
        }
      }
      state.scanPasses += 1;
      state.updatedAt = capturedAt;
      return {
        added,
        total: state.comments.size,
        renderedThreads: threads.length,
        expansion,
        commentsRegionPresent: Boolean(region)
      };
    } finally {
      state.busy = false;
    }
  }

  function stop(reason) {
    if (state.timer) root.clearTimeout(state.timer);
    state.timer = null;
    state.running = false;
    state.stopReason = reason || "operator stop";
    console.info(`[MorrowYouTubeCapture] stopped: ${state.stopReason}; ${state.comments.size} rendered records retained.`);
    return api.status();
  }

  function scheduleTick() {
    if (!state.running) return;
    state.timer = root.setTimeout(async () => {
      const result = await scanOnce(state.settings);
      const clicks = result.expansion
        ? result.expansion.textClicks + result.expansion.replyClicks + result.expansion.continuationClicks
        : 0;
      state.idlePasses = result.added > 0 || clicks > 0 ? 0 : state.idlePasses + 1;
      if (!state.running) return;
      if ((state.scanPasses - state.settings.startingScanPasses) >= state.settings.maxPasses) {
        return stop("maximum scan passes reached");
      }
      if (state.idlePasses >= state.settings.idlePasses) return stop("no new rendered comments in recent passes");
      if (state.expansionClicks >= state.settings.maxTotalExpansionClicks) return stop("maximum visible expansion clicks reached");
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
    const requestedPublicAuthors = Object.prototype.hasOwnProperty.call(supplied, "includePublicAuthors")
      ? supplied.includePublicAuthors === true
      : state.includePublicAuthors;
    if (state.privacyLocked && requestedPublicAuthors !== state.includePublicAuthors) {
      throw new Error("Author mode is locked for this in-memory capture. Export/reset before changing it.");
    }
    state.includePublicAuthors = requestedPublicAuthors;
    state.privacyLocked = true;
    state.settings = {
      autoScroll: supplied.autoScroll === true,
      includePublicAuthors: state.includePublicAuthors,
      intervalMs: Math.max(1000, Number(supplied.intervalMs || 1800)),
      expansionDelayMs: Math.max(300, Number(supplied.expansionDelayMs || 800)),
      maxPasses: Math.max(1, Number(supplied.maxPasses || 400)),
      idlePasses: Math.max(3, Number(supplied.idlePasses || 20)),
      scrollStepPx: Math.max(200, Number(supplied.scrollStepPx || Math.round(root.innerHeight * 0.8))),
      maxClicksPerPass: Math.min(25, Math.max(1, Number(supplied.maxClicksPerPass || 12))),
      maxTotalExpansionClicks: Math.min(5000, Math.max(1, Number(supplied.maxTotalExpansionClicks || 2000))),
      startingScanPasses: state.scanPasses
    };
    state.idlePasses = 0;
    state.startedAt = state.startedAt || new Date().toISOString();
    state.stopReason = null;
    state.running = true;
    console.info(
      `[MorrowYouTubeCapture] started for video ${state.videoId}. ` +
      `${state.includePublicAuthors ? "PUBLIC AUTHOR NAMES/URLS WILL BE EXPORTED by explicit request." : "Commenter identities are anonymized."} ` +
      `${state.settings.autoScroll ? "Bounded auto-scroll is ON." : "Scroll manually."} ` +
      `Run MorrowYouTubeCapture.stop() at any time.`
    );
    scanOnce(state.settings).then(() => scheduleTick());
    return api.status();
  }

  function status() {
    const summary = {
      version: VERSION,
      videoId: state.videoId,
      running: state.running,
      retainedCommentsAndReplies: state.comments.size,
      includePublicAuthors: state.includePublicAuthors,
      scanPasses: state.scanPasses,
      scrollPasses: state.scrollPasses,
      expansionClicks: state.expansionClicks,
      idlePasses: state.idlePasses,
      stopReason: state.stopReason
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
    return `youtube-comments-${state.videoId}-${new Date().toISOString().replace(/[:.]/g, "-")}`;
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
    if (!payload || payload.schema !== SCHEMA || !payload.video || payload.video.videoId !== state.videoId) {
      throw new Error(`Resume data must use ${SCHEMA} and belong to video ${state.videoId}.`);
    }
    const importedPublic = Boolean(payload.capture && payload.capture.includePublicAuthors);
    if (!state.privacyLocked) {
      state.includePublicAuthors = importedPublic;
      state.privacyLocked = true;
    }
    if (state.includePublicAuthors !== importedPublic) {
      throw new Error("Resume author mode differs from this in-memory capture. Reset before importing it.");
    }
    let added = 0;
    for (const comment of Array.isArray(payload.comments) ? payload.comments : []) {
      if (!comment) continue;
      const permalink = parseCommentPermalink(comment.url, state.videoId);
      if (!permalink || permalink.id !== String(comment.id || "")) continue;
      const cleaned = Object.assign({}, comment, {
        id: permalink.id,
        url: permalink.url,
        videoId: permalink.videoId,
        author: safeAuthor(comment.author, state.includePublicAuthors)
      });
      const aliasMatch = String(cleaned.author && cleaned.author.label || "").match(/^author-(\d+)$/i);
      if (aliasMatch) state.nextAuthorNumber = Math.max(state.nextAuthorNumber, Number(aliasMatch[1]) + 1);
      const existing = state.comments.get(String(cleaned.id));
      if (!existing) added += 1;
      state.comments.set(String(cleaned.id), mergeRecord(existing, cleaned));
    }
    console.info(`[MorrowYouTubeCapture] imported ${added} new records; ${state.comments.size} total retained.`);
    return api.status();
  }

  function reset(confirmText) {
    if (confirmText !== "RESET") {
      throw new Error('Reset is destructive. Run MorrowYouTubeCapture.reset("RESET") to confirm.');
    }
    stop("operator reset");
    state.comments.clear();
    state.authorAliases.clear();
    state.nextAuthorNumber = 1;
    state.includePublicAuthors = false;
    state.privacyLocked = false;
    state.scanPasses = 0;
    state.scrollPasses = 0;
    state.idlePasses = 0;
    state.expansionClicks = 0;
    state.clickedElements = new WeakSet();
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
    `[MorrowYouTubeCapture] installed for video ${state.videoId}. Nothing is running yet.\n` +
    `Anonymized manual capture: MorrowYouTubeCapture.start()\n` +
    `Anonymized bounded auto-scroll: MorrowYouTubeCapture.start({ autoScroll: true })\n` +
    `Explicit public-author mode: MorrowYouTubeCapture.start({ includePublicAuthors: true })`
  );
})(typeof window !== "undefined" ? window : undefined);
