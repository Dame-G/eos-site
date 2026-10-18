// Reads the component library from disk. Used by the VitePress config, the page generators and the scripts.
// The library is expected beside this repo (../eos). Set EOS_DIR to use another checkout.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
export const siteRoot = resolve(here, "../..");
export const eosRoot = resolve(process.env.EOS_DIR || join(siteRoot, "../eos"));
export const componentsDir = join(eosRoot, "packages/vue/src/components");

/** The groups, in the order the sidebar shows them. The layer is the cascade layer the library puts them in. */
export const GROUPS = [
  { id: "primitives", title: "Primitives" },
  { id: "blocks", title: "Blocks" },
  { id: "controls", title: "Form controls" },
  { id: "composites", title: "Composite controls" },
  { id: "containers", title: "Containers and feedback" },
  { id: "account", title: "Account" },
  { id: "page", title: "Page" },
];

/** Folder names of every component in the library, sorted. Adding a folder to the library adds a page here. */
export function listComponents() {
  if (!existsSync(componentsDir)) throw new Error(`Component library not found at ${componentsDir}. Check out Dame-G/eos beside this repo or set EOS_DIR.`);
  return readdirSync(componentsDir)
    .filter((n) => statSync(join(componentsDir, n)).isDirectory() && existsSync(join(componentsDir, n, "index.ts")))
    .sort((a, b) => a.localeCompare(b));
}

export function readReadme(name) {
  const file = join(componentsDir, name, "README.md");
  return existsSync(file) ? readFileSync(file, "utf8").replace(/\r\n/g, "\n") : "";
}

/** The component's Vue file name without the extension, such as "ESelect" for the folder "Select". */
export function componentTag(name) {
  return "E" + name;
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

/** Rows of the first "## Props" table: [{ prop, type, notes }]. */
export function propsTable(markdown) {
  const m = /^## Props\s*\n([\s\S]*?)(?=\n## |$)/m.exec(markdown);
  if (!m) return [];
  const rows = m[1].split("\n").filter((l) => l.trim().startsWith("|"));
  const cells = (l) => l.trim().replace(/^[|]|[|]$/g, "").split(/(?<![\\])[|]/).map((c) => c.trim().replace(/[\\][|]/g, "|"));
  return rows
    .slice(2)
    .map(cells)
    .filter((c) => c.length >= 2)
    .map(([prop, type, notes]) => ({ prop: prop.replace(/`/g, ""), type: (type ?? "").replace(/`/g, ""), notes: (notes ?? "").replace(/`/g, "") }));
}
