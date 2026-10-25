import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

// Written against the shape of a Vite plugin rather than Vite's types: the site has two Vites (VitePress's and Vitest's) and this runs in VitePress's.
interface ResolveContext {
  resolve(source: string, importer?: string): Promise<{ id: string } | null>;
}
interface SitePlugin {
  name: string;
  apply?: "build" | "serve";
  transform?(this: ResolveContext, code: string, id: string): Promise<{ code: string; map: null } | null>;
}

/** Where each name reka-ui's index exports really comes from: the file and the name it has there. */
type ExportMap = Map<string, { file: string; name: string }>;

const posix = (path: string) => path.replaceAll("\\", "/");
const specs = (list: string) =>
  list
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [name, alias] = s.split(/\s+as\s+/);
      return { name: name!, alias: alias ?? name! };
    });

/** Reads reka-ui's index: `import { A_default } from "./A/A.js"` lines, then one `export { A_default as A, ... }`. */
function exportMap(index: string): ExportMap {
  const code = readFileSync(index, "utf8");
  const local = new Map<string, { file: string; name: string }>();
  for (const m of code.matchAll(/import\s*\{([^}]*)\}\s*from\s*"(\.[^"]+)"/g))
    for (const { name, alias } of specs(m[1]!)) local.set(alias, { file: posix(resolve(dirname(index), m[2]!)), name });
  const map: ExportMap = new Map();
  for (const m of code.matchAll(/export\s*\{([^}]*)\}/g))
    for (const { name, alias } of specs(m[1]!)) {
      const from = local.get(name);
      if (from) map.set(alias, from);
    }
  return map;
}

/**
 * VitePress puts every module the theme entry reaches by static imports into the "theme" chunk, which every page
 * loads. reka-ui's index imports all of its parts, so one component that imports from it (ESelect, in the header)
 * made every part reachable, and the parts only the demos use (Combobox, Menu, Slider, Tabs, Listbox, Popover)
 * landed in that chunk. This points the library's `import { … } from "reka-ui"` at the files that define each name,
 * so the theme reaches only what the header really uses and the rest loads with the demos that need it.
 * Build only: the dev server pre-bundles reka-ui into one file anyway.
 */
export function leanThemeChunk(): SitePlugin {
  const maps = new Map<string, ExportMap>();
  return {
    name: "eos-site:reka-direct-imports",
    apply: "build",
    async transform(code, id) {
      if (!code.includes('"reka-ui"') || /\/node_modules\/reka-ui\//.test(posix(id))) return null;
      const index = (await this.resolve("reka-ui", id))?.id;
      if (!index) return null;
      if (!maps.has(index)) maps.set(index, exportMap(index));
      const map = maps.get(index)!;
      let changed = false;
      const out = code.replace(/import\s*\{([^}]*)\}\s*from\s*"reka-ui";?/g, (statement, list: string) => {
        const wanted = specs(list);
        if (!wanted.every((w) => map.has(w.name))) return statement;
        changed = true;
        return wanted.map((w) => `import { ${map.get(w.name)!.name} as ${w.alias} } from ${JSON.stringify(map.get(w.name)!.file)};`).join("");
      });
      return changed ? { code: out, map: null } : null;
    },
  };
}
