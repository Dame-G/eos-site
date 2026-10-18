import { GROUPS, firstParagraph, listComponents, readReadme, componentsDir } from "../.vitepress/eos-source.mjs";
import { GROUP_OF } from "../.vitepress/groups.mjs";
import { join, sep } from "node:path";

export default {
  watch: [join(componentsDir, "*/README.md").split(sep).join("/")],
  load() {
    const names = listComponents();
    const groups = [...GROUPS, { id: "more", title: "More" }];
    return groups
      .map((g) => ({
        ...g,
        items: names
          .filter((n) => (GROUP_OF[n] ?? "more") === g.id)
          .map((name) => ({ name, summary: firstParagraph(readReadme(name)).split(/(?<=\.)\s/)[0] ?? "" })),
      }))
      .filter((g) => g.items.length);
  },
};
