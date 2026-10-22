import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { GROUP_OF } from "./groups.mjs";

const here = dirname(fileURLToPath(import.meta.url));
export const siteRoot = resolve(here, "../..");
const eosRoot = resolve(process.env.EOS_DIR || join(siteRoot, "../eos"));
/** The published version of the library the site is built against. */
const libraryVersion = JSON.parse(readFileSync(join(eosRoot, "packages/vue/package.json"), "utf8")).version;
/** Runs git in the library checkout; null when it is not a git checkout or the command fails. */
function git(...args) {
  try {
    return execFileSync("git", args, { cwd: eosRoot, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
}

/**
 * What the site is built against, for the line under the install command. The library is whatever is checked out at EOS_DIR (or beside this repo),
 * so this says which commit that is:
 *   - a release tag (`@eos-ui/vue@0.7.0`): "v0.7.0"
 *   - anything else, a branch or a work in progress: the branch name, with " + changes" when files are modified
 * The version in package.json is not used on its own: it stays at the last release while a branch adds to it.
 * Set EOS_LABEL to override the text.
 */
function libraryBuild() {
  if (process.env.EOS_LABEL) return { label: process.env.EOS_LABEL, version: libraryVersion, release: false };
  const tag = git("describe", "--tags", "--exact-match", "--match", "@eos-ui/vue@*", "HEAD");
  const sha = git("rev-parse", "--short", "HEAD");
  if (tag && !git("status", "--porcelain", "--untracked-files=no")) {
    const version = tag.slice("@eos-ui/vue@".length);
    return { label: `v${version}`, version, release: true };
  }
  if (!sha) return { label: `v${libraryVersion}`, version: libraryVersion, release: false };
  const branch = git("rev-parse", "--abbrev-ref", "HEAD");
  // A long branch name is shortened so the line fits the install block.
  const full = branch && branch !== "HEAD" ? branch : "detached";
  const name = full.length > 20 ? `${full.slice(0, 19)}…` : full;
  const dirty = git("status", "--porcelain", "--untracked-files=no") ? " + changes" : "";
  return { label: `${name}${dirty}`, version: libraryVersion, release: false };
}
export const libraryBuildInfo = libraryBuild();

export const componentsDir = join(eosRoot, "packages/vue/src/components");

/** The groups, in the order the sidebar shows them. */
export const GROUPS = [
  { id: "primitives", title: "Primitives" },
  { id: "blocks", title: "Blocks" },
  { id: "controls", title: "Form controls" },
  { id: "composites", title: "Composite controls" },
  { id: "containers", title: "Containers and feedback" },
  { id: "page", title: "Page" },
];

/** Folder names of every component in the library, sorted. Adding a folder to the library adds a page here. */
export function listComponents() {
  if (!existsSync(componentsDir)) throw new Error(`Component library not found at ${componentsDir}. Check out Dame-G/eos beside this repo or set EOS_DIR.`);
  return readdirSync(componentsDir)
    .filter((n) => statSync(join(componentsDir, n)).isDirectory() && existsSync(join(componentsDir, n, "index.ts")))
    .sort((a, b) => a.localeCompare(b));
}

/** The components by sidebar group, those without a group last under "More". Empty groups are left out. */
export function groupedComponents() {
  const names = listComponents();
  return [...GROUPS, { id: "more", title: "More" }]
    .map((g) => ({ ...g, names: names.filter((n) => (GROUP_OF[n] ?? "more") === g.id) }))
    .filter((g) => g.names.length);
}

export function readReadme(name) {
  const file = join(componentsDir, name, "README.md");
  return existsSync(file) ? readFileSync(file, "utf8").replace(/\r\n/g, "\n") : "";
}

/** Splits a README into its title, the introduction (up to the first "##" heading) and the rest. */
export function splitReadme(markdown) {
  const lines = markdown.split("\n");
  const first = lines.findIndex((l) => /^## /.test(l));
  const head = (first === -1 ? lines : lines.slice(0, first)).join("\n").trim();
  const rest = first === -1 ? "" : lines.slice(first).join("\n").trim();
  return { head, rest };
}

/** The first plain paragraph after the title: used as the page description. */
export function firstParagraph(markdown) {
  const body = markdown.replace(/^# .*\n+/, "");
  const para = body.split(/\n\s*\n/).find((p) => p.trim() && !p.startsWith("```") && !p.startsWith("|") && !p.startsWith("#"));
  return (para ?? "").replace(/\s+/g, " ").replace(/`/g, "").trim();
}

/** The first sentence of the description paragraph. */
export function summaryOf(markdown) {
  return firstParagraph(markdown).split(/(?<=\.)\s/)[0] ?? "";
}

/** Rows of the first "## Props" table (| Prop | Type | Default | Notes |): [{ prop, type, def, notes }]. */
export function propsTable(markdown) {
  const m = /^## Props\s*\n([\s\S]*?)(?=\n## |(?![\s\S]))/m.exec(markdown);
  if (!m) return [];
  const rows = m[1].split("\n").filter((l) => l.trim().startsWith("|"));
  const cells = (l) => l.trim().replace(/^[|]|[|]$/g, "").split(/(?<![\\])[|]/).map((c) => c.trim().replace(/[\\][|]/g, "|"));
  return rows
    .slice(2)
    .map(cells)
    .filter((c) => c.length >= 2)
    .map(([prop, type, def, notes]) => ({ prop: prop.replace(/`/g, ""), type: (type ?? "").replace(/`/g, ""), def: (def ?? "").replace(/[`*]/g, ""), notes: (notes ?? "").replace(/`/g, "") }));
}
