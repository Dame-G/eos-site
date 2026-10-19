const COMPONENT_TITLE = /^E([A-Z][A-Za-z0-9]*)$/;

export function componentWords(title: string): string {
  const match = COMPONENT_TITLE.exec(title.trim());
  if (!match) return "";
  const name = match[1]!;
  const words = name.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return words === name ? name : `${words} ${name}`;
}

export const searchFields = ["title", "titles", "text", "names"];

export const searchBuildOptions = {
  fields: searchFields,
  storeFields: ["title", "titles"],
  extractField: (doc: Record<string, unknown>, field: string) => (field === "names" ? componentWords(String(doc.title ?? "")) : doc[field]),
};

export const searchOptions = {
  fuzzy: 0.2,
  prefix: true,
  boost: { names: 12, title: 6, titles: 1, text: 1 },
};

export function titleRank(title: string, query: string): number {
  const q = query.trim().toLowerCase();
  const name = (COMPONENT_TITLE.test(title) ? title.slice(1) : title).toLowerCase();
  if (name === q) return 0;
  if (name.startsWith(q)) return 1;
  return 2;
}
