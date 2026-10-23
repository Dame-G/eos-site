import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { GROUP_OF } from "./groups.mjs";
import { plainText } from "./plain-text.mjs";

const here = dirname(fileURLToPath(import.meta.url));
export const siteRoot = resolve(here, "../..");
const eosRoot = resolve(process.env.EOS_DIR || join(siteRoot, "../eos"));
/** The published version of the library the site is built against. */
const libraryVersion = JSON.parse(readFileSync(join(eosRoot, "packages/vue/package.json"), "utf8")).version;
/** The library version, which the home page pins the install command to. */
/** The library licence, shown in the footer. */
export const licenseText = readFileSync(join(eosRoot, "LICENSE"), "utf8").replace(/\r\n/g, "\n").trim();
export const libraryBuildInfo = { version: libraryVersion };

/** The library changelog, published as the /changelog page. */
/** The built library package, where llms-full.txt lands after a library build. */
export const libraryDist = join(eosRoot, "packages/vue/dist");
export const changelogFile = join(eosRoot, "packages/vue/CHANGELOG.md");
export const componentsDir = join(eosRoot, "packages/vue/src/components");

/** The groups, in the order the sidebar shows them. */
export const GROUPS = [
  { id: "actions", title: "Actions" },
  { id: "content", title: "Text and content" },
  { id: "layout", title: "Layout" },
  { id: "form", title: "Form structure" },
  { id: "text", title: "Text inputs" },
  { id: "choices", title: "Choices" },
  { id: "pickers", title: "Dates, files and signatures" },
  { id: "data", title: "Data display" },
  { id: "feedback", title: "Feedback and status" },
  { id: "overlays", title: "Overlays and disclosure" },
  { id: "navigation", title: "Navigation" },
  { id: "page", title: "Page frame" },
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

/** The date of the last library commit that touched a component, as an ISO string, or undefined when git history is not there. */
export function componentModified(name) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", join("packages/vue/src/components", name)], { cwd: eosRoot, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    return out || undefined;
  } catch {
    return undefined;
  }
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
  return plainText(para ?? "");
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
