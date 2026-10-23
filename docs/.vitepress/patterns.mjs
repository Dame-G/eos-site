import { readFileSync } from "node:fs";
import { join } from "node:path";
import { siteRoot } from "./eos-source.mjs";
import { PATTERNS } from "./pages.mjs";
import { builtFrom, frontMatter } from "../data/patterns-source.js";

/** Every pattern with its description (front matter) and the components it is built from (its "Built from:" line). */
export function patternInfo() {
  return PATTERNS.map(({ slug, name }) => {
    const markdown = readFileSync(join(siteRoot, "docs/patterns", `${slug}.md`), "utf8");
    return { slug, name, description: frontMatter(markdown, "description"), uses: builtFrom(markdown) };
  });
}

/** Component folder name -> the patterns that use it, in the order of the patterns list. */
export function usedIn() {
  const map = new Map();
  for (const p of patternInfo()) {
    for (const component of p.uses) {
      if (!map.has(component)) map.set(component, []);
      map.get(component).push({ slug: p.slug, name: p.name });
    }
  }
  return map;
}
