/**
 * Reads the members of an exported interface out of TypeScript source, so the docs follow the library instead of a
 * hand-kept list. Pure string work with no imports, so the loader (Node) and the tests (browser) share it.
 *
 * Only the interface's own top-level members are returned (`key?: type;`), each with the text of the doc comment
 * above it. Nested object types are skipped by tracking brace depth.
 */
export function interfaceMembers(source, name) {
  const start = new RegExp(String.raw`export interface ${name}\b[^{]*\{`).exec(source);
  if (!start) return [];
  const members = [];
  let depth = 1;
  let doc = "";
  let comment = "";
  let inComment = false;
  let i = start.index + start[0].length;
  let lineStart = i;
  while (i < source.length && depth > 0) {
    if (inComment) {
      if (source.startsWith("*/", i)) {
        inComment = false;
        doc = comment.replace(/\s*\n\s*\*?\s*/g, " ").trim();
        i += 2;
      } else {
        comment += source[i];
        i += 1;
      }
      continue;
    }
    if (source.startsWith("/**", i)) {
      inComment = true;
      comment = "";
      i += 3;
      continue;
    }
    if (i === lineStart && depth === 1) {
      const eol = source.indexOf("\n", i);
      const m = /^\s*([A-Za-z_]\w*)\??[:(]/.exec(source.slice(i, eol === -1 ? source.length : eol));
      if (m) {
        members.push({ name: m[1], doc });
        doc = "";
      }
    }
    const ch = source[i];
    if (ch === "{") depth += 1;
    else if (ch === "}") depth -= 1;
    else if (ch === "\n") lineStart = i + 1;
    i += 1;
  }
  return members;
}

/** The first sentence of a doc comment. */
export function firstSentence(text) {
  const m = /^(.+?[.!?])(\s|$)/.exec(text.trim());
  return (m ? m[1] : text).trim();
}
