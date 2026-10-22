/** Reduces inline markdown to the words a reader sees: links keep their text, code and emphasis lose their marks. */
export function plainText(markdown) {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`/g, "")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(^|[\s(])([*_])(\S(?:.*?\S)?)\2(?=$|[\s).,:;!?])/g, "$1$3")
    .replace(/\s+/g, " ")
    .trim();
}
