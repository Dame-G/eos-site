/**
 * The library's CHANGELOG.md (Changesets output) as the body of the /changelog page: newest first, each release with its
 * date, its breaking changes pulled out first, then its other changes and fixes. Dependency-only lines are dropped and each
 * commit hash moves to the end of its entry as a link. Releases after the newest few fold into disclosures.
 */

const REPO = "https://github.com/Dame-G/eos";

/**
 * Wording that marks a change you may have to act on. Changesets has no "breaking" heading: before 1.0 a breaking change is
 * a minor entry, and from 0.12 on the notes never say "breaking", so the entry's own words are the only signal. A patch
 * entry is never counted.
 */
const BREAKING = /\b(?:breaking|removed?|renamed?|(?:is|are) gone|no longer|now requires|old spellings?|is now `|are now `|becomes `|moved to `|instead of `|in place of `)/i;

/** "Updated dependencies [abc1234]" with its "  - @eos-ui/tokens@x" lines, and a bare "- @eos-ui/tokens@x". */
const isDependencyOnly = (entry) => /^- (?:Updated dependencies\b|@eos-ui\/[\w-]+@\d)/.test(entry);

/** Splits a section's lines into entries: each starts with "- " at the start of a line and runs to the next. */
function entriesOf(lines) {
  const entries = [];
  for (const line of lines) {
    if (line.startsWith("- ")) entries.push([line]);
    else if (entries.length) entries.at(-1).push(line);
  }
  return entries.map((e) => e.join("\n").replace(/\s+$/, ""));
}

/** The entry with its leading commit hash moved to the end of its first line, as a link. */
function linkHash(entry) {
  const m = /^- ([0-9a-f]{7}): /.exec(entry);
  if (!m) return entry;
  const [first, ...rest] = entry.slice(m[0].length).split("\n");
  return [`- ${first} ([${m[1]}](${REPO}/commit/${m[1]}))`, ...rest].join("\n");
}

/** The releases in the changelog, newest first: [{ version, breaking, changes, fixes }], each a list of entries. */
export function parseChangelog(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const releases = [];
  let release;
  let kind;
  let buffer = [];
  const flush = () => {
    if (!release || !kind) return;
    for (const entry of entriesOf(buffer)) {
      if (isDependencyOnly(entry)) continue;
      if (kind === "minor" && BREAKING.test(entry)) release.breaking.push(entry);
      else release[kind === "minor" ? "changes" : "fixes"].push(entry);
    }
    buffer = [];
  };
  for (const line of lines) {
    const version = /^## (\S+)/.exec(line);
    if (version) {
      flush();
      release = { version: version[1], breaking: [], changes: [], fixes: [] };
      releases.push(release);
      kind = undefined;
      continue;
    }
    const heading = /^### (Major|Minor|Patch) Changes/.exec(line);
    if (heading) {
      flush();
      kind = heading[1] === "Patch" ? "patch" : "minor";
      continue;
    }
    if (kind) buffer.push(line);
  }
  flush();
  return releases;
}

/** A release as markdown, its headings at `level` (the release title one above it). */
function releaseBody(release, level) {
  const h = "#".repeat(level);
  const part = (title, entries) => (entries.length ? [`${h} ${title}`, "", ...entries.map(linkHash)].join("\n") : "");
  const parts = [
    part("Breaking", release.breaking),
    part("Changes", release.changes),
    part("Fixes", release.fixes),
  ].filter(Boolean);
  return parts.length ? parts.join("\n\n") : "No changes to this package beyond its dependencies.";
}

/**
 * The page body. `dates` maps a version to its release date (YYYY-MM-DD); a version without one shows none. The newest
 * `recent` releases are sections of their own; the rest are disclosures under "Older releases".
 */
export function changelogBody(markdown, { dates = {}, recent = 5 } = {}) {
  const releases = parseChangelog(markdown);
  const title = (r) => (dates[r.version] ? `${r.version} · ${dates[r.version]}` : r.version);
  const newest = releases.slice(0, recent).map((r) => [`## ${title(r)}`, "", releaseBody(r, 3)].join("\n"));
  const older = releases.slice(recent);
  const folded = older.length
    ? [
        "## Older releases",
        "",
        ...older.map((r) => [`<EDisclosure title="${title(r)}${r.breaking.length ? " · breaking changes" : ""}">`, "", releaseBody(r, 4), "", "</EDisclosure>", ""].join("\n")),
      ].join("\n")
    : "";
  return [...newest, folded].filter(Boolean).join("\n\n").trim();
}
