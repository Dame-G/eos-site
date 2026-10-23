/** Reads facts out of a pattern page's Markdown. Pure string work, shared by the build scripts and the tests. */

/** The components named on the page's "Built from:" line, as folder names (`Grid` for `EGrid`), in order. */
export function builtFrom(markdown) {
  const line = markdown.split(/\r?\n/).find((l) => l.startsWith("Built from:")) ?? "";
  return [...line.matchAll(/\]\(\/components\/([A-Za-z]+)\)/g)].map((m) => m[1]);
}

/** A string value from the front matter, or "". */
export function frontMatter(markdown, key) {
  const block = /^---\r?\n([\s\S]*?)\r?\n---/.exec(markdown)?.[1] ?? "";
  const m = new RegExp(String.raw`^${key}:\s*(.+)$`, "m").exec(block);
  return m ? m[1].trim().replace(/^"(.*)"$/, "$1") : "";
}

/** The text under a "## Heading" until the next "## " heading, or "". */
export function section(markdown, heading) {
  const m = new RegExp(String.raw`^## ${heading}\s*\r?\n([\s\S]*?)(?=\r?\n## |(?![\s\S]))`, "m").exec(markdown);
  return m ? m[1].trim() : "";
}
