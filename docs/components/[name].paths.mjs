import { existsSync } from "node:fs";
import { join, sep } from "node:path";
import { GROUPS, componentsDir, firstParagraph, listComponents, readReadme, siteRoot, splitReadme } from "../.vitepress/eos-source.mjs";
import { GROUP_OF } from "../.vitepress/groups.mjs";

/**
 * One page per component folder in the library. The page is the component's own README (read from the library
 * checkout, never copied) with the live demo placed after its introduction.
 */
export default {
  watch: [join(componentsDir, "*/README.md").split(sep).join("/"), join(siteRoot, "docs/components/demos/*.vue").split(sep).join("/")],
  paths() {
    const names = listComponents();
    const known = new Set(names);
    // Relative links in a README point at files in the library repo. On the site the icons guide is a page; any other
    // relative link goes to the file on GitHub, so nothing on the page is a dead link.
    const fixRelative = (md, self) =>
      md.replace(/\]\((\.{1,2}\/[^)\s]*)\)/g, (m, target) => {
        if (/icons\/README/.test(target)) return "](/guide/icons)";
        const path = new URL(target, `https://x/packages/vue/src/components/${self}/`).pathname.slice(1);
        return `](https://github.com/Dame-G/eos/blob/main/${path})`;
      });
    const link = (md, self) =>
      fixRelative(md, self).replace(/(^|[^`\[])`(E[A-Z][A-Za-z]+)`/g, (m, pre, tag) => {
        const folder = tag.slice(1);
        return known.has(folder) && folder !== self ? `${pre}[\`${tag}\`](/components/${folder})` : m;
      });

    return names.map((name) => {
      const readme = readReadme(name);
      const hasDemo = existsSync(join(siteRoot, "docs/components/demos", `${name}.vue`));
      const { head, rest } = splitReadme(readme || `# E${name}\n`);
      const group = GROUPS.find((g) => g.id === GROUP_OF[name])?.title ?? "More";
      const demo = [
        "## Live demo",
        "",
        `<ComponentDemo name="${name}" />`,
        "",
        ...(hasDemo ? ["::: details Source", "", `<<< @/components/demos/${name}.vue`, "", ":::", ""] : []),
      ].join("\n");
      const noReadme = readme ? "" : `\n\n::: warning\nThe library has no README.md for E${name} yet, so this page only has the demo.\n:::\n`;
      const content = [link(head, name), noReadme, demo, link(rest, name)].join("\n\n");
      return {
        params: { name, group, description: firstParagraph(readme) },
        content,
      };
    });
  },
};
