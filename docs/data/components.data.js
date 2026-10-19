import { componentsDir, groupedComponents, readReadme, summaryOf } from "../.vitepress/eos-source.mjs";
import { join, sep } from "node:path";

export default {
  watch: [join(componentsDir, "*/README.md").split(sep).join("/")],
  load() {
    return groupedComponents().map(({ names, ...g }) => ({ ...g, items: names.map((name) => ({ name, summary: summaryOf(readReadme(name)) })) }));
  },
};
