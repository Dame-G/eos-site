import { existsSync } from "node:fs";
import { join, sep } from "node:path";
import { GROUPS, componentsDir, firstParagraph, listComponents, readReadme, siteRoot, splitReadme } from "../.vitepress/eos-source.mjs";
import { GROUP_OF } from "../.vitepress/groups.mjs";
import { usedIn } from "../.vitepress/patterns.mjs";

const EXPECTED_SECTIONS = ["Keyboard", "Related"];

export default {
  watch: [join(componentsDir, "*/README.md").split(sep).join("/"), join(siteRoot, "docs/components/demos/*.vue").split(sep).join("/")],
  paths() {
    const names = listComponents();
    const known = new Set(names);
    const fixRelative = (md, self) =>
      md.replace(/\]\((\.{1,2}\/[^)\s]*)\)/g, (m, target) => {
        if (/icons\/README/.test(target)) return "](/guide/icons)";
        const sibling = /^\.\.\/([A-Z][A-Za-z]+)\/README\.md$/.exec(target);
        if (sibling && known.has(sibling[1])) return `](/components/${sibling[1]})`;
        const path = new URL(target, `https://x/packages/vue/src/components/${self}/`).pathname.slice(1);
        return `](https://github.com/Dame-G/eos/blob/main/${path})`;
      });
    // The library writes an em dash for "no default" in its props tables: the site says "None".
    const noDefault = (md) => md.replace(/^\|.*$/gm, (row) => row.replace(/\|\s*—\s*(?=\|)/g, "| None "));
    const link = (md, self) =>
      fixRelative(md, self).replace(/(^|[^`\[])`(E[A-Z][A-Za-z]+)`/g, (m, pre, tag) => {
        const folder = tag.slice(1);
        return known.has(folder) && folder !== self ? `${pre}[\`${tag}\`](/components/${folder})` : m;
      });

    const patterns = usedIn();
    const missing = [];
    const pages = names.map((name) => {
      const readme = readReadme(name);
      if (readme) {
        for (const heading of ["Accessibility", ...EXPECTED_SECTIONS]) {
          if (!new RegExp(`^## ${heading}\\s*$`, "m").test(readme)) missing.push({ name, heading });
        }
      }
      const hasDemo = existsSync(join(siteRoot, "docs/components/demos", `${name}.vue`));
      const { head, rest } = splitReadme(readme || `# E${name}\n`);
      const group = GROUPS.find((g) => g.id === GROUP_OF[name])?.title ?? "More";
      const demo = [
        "## Demo",
        "",
        `<ComponentDemo name="${name}" />`,
        "",
        ...(hasDemo ? ["<EDisclosure title=\"Source\">", "", `<<< @/components/demos/${name}.vue`, "", "</EDisclosure>", ""] : []),
      ].join("\n");
      const noReadme = readme ? "" : `\n\n::: warning\nThe library has no README.md for E${name} yet, so this page only has the demo.\n:::\n`;
      // Derived from each pattern's "Built from:" line, so the list cannot drift from the patterns.
      const used = patterns.get(name) ?? [];
      const usedSection = used.length ? ["## Used in", "", ...used.map((p) => `- [${p.name}](/patterns/${p.slug})`)].join("\n") : "";
      const content = [link(head, name), noReadme, demo, noDefault(link(rest, name)), usedSection].join("\n\n");
      return {
        params: { name, group, description: firstParagraph(readme) },
        content,
      };
    });
    // Every README must have Accessibility, Keyboard and Related, and a missing one fails the build. Set EOS_LENIENT_SECTIONS
    // to downgrade that to a warning when building against an older library release that predates the sections.
    for (const heading of ["Accessibility", ...EXPECTED_SECTIONS]) {
      const lacking = missing.filter((m) => m.heading === heading).map((m) => `E${m.name}`);
      if (lacking.length) console.warn(`[eos-site] ${lacking.length} README.md file(s) have no "## ${heading}" section: ${lacking.join(", ")}.`);
    }
    if (missing.length && !process.env.EOS_LENIENT_SECTIONS) throw new Error(`${missing.length} component README section(s) are missing. Add them to the library READMEs, or set EOS_LENIENT_SECTIONS to build anyway. See the warnings above.`);
    return pages;
  },
};
