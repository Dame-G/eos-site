const COMPONENT_TITLE = /^E([A-Z][A-Za-z0-9]*)$/;

export function componentWords(title: string): string {
  const match = COMPONENT_TITLE.exec(title.trim());
  if (!match) return "";
  const name = match[1]!;
  const words = name.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return words === name ? name : `${words} ${name}`;
}

export const searchBuildOptions = {
  fields: ["title", "titles", "text"],
  storeFields: ["title", "titles"],
};

export const searchOptions = {
  fuzzy: 0.2,
  prefix: true,
  boost: { title: 6, titles: 1, text: 1 },
};

export function renderForSearch(
  src: string,
  env: { relativePath?: string },
  md: { render: (src: string, env: unknown) => string },
): string {
  const html = md.render(src, env);
  const name = /^components\/([A-Za-z0-9]+)\.md$/.exec(env.relativePath ?? "")?.[1];
  const words = name && name !== "index" ? componentWords(`E${name}`) : "";
  return words ? `${html}<p>${words}</p>` : html;
}

export function titleRank(title: string, query: string): number {
  const q = query.trim().toLowerCase();
  const name = (COMPONENT_TITLE.test(title) ? title.slice(1) : title).toLowerCase();
  if (name === q) return 0;
  if (name.startsWith(q)) return 1;
  return 2;
}

export const componentSearchOptions = {
  fields: ["title", "names", "text"],
  storeFields: ["title", "titles"],
  searchOptions: { fuzzy: 0.2, prefix: true, boost: { names: 12, title: 6, text: 1 } },
};

export interface ComponentGroup {
  title: string;
  items: { name: string; summary: string }[];
}

export function componentDocs(groups: ComponentGroup[]) {
  return groups.flatMap((g) =>
    g.items.map((c) => ({
      id: `/components/${c.name}`,
      title: `E${c.name}`,
      titles: [g.title],
      names: componentWords(`E${c.name}`),
      text: c.summary,
    })),
  );
}
