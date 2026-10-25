import type { Plugin } from "vite";

type ManualChunks = (id: string, meta: unknown) => string | null | undefined;

/** A dependency of the library (reka-ui, floating-ui and the like), not Vue itself. */
const isLibraryDependency = (id: string) => /\/node_modules\//.test(id) && !/\/node_modules\/(?:vue|@vue)\//.test(id);

/**
 * VitePress puts every module the theme entry reaches by static imports into the "theme" chunk, which every page
 * loads. reka-ui's index re-exports all of its parts, so one component that imports it (ESelect, in the header) makes
 * every part reachable, and the parts only the demos use (Combobox, Menu, Slider, Tabs, Listbox, Popover) landed in
 * that chunk. This leaves the library's dependencies to Rollup, which puts each module with the code that really
 * uses it: what the header needs still loads with the theme, the rest with the demos that need it.
 */
export function leanThemeChunk(): Plugin {
  return {
    name: "eos-site:lean-theme-chunk",
    apply: "build",
    outputOptions(options) {
      const vitepress = options.manualChunks;
      if (typeof vitepress !== "function") return null;
      const wrapped: ManualChunks = (id, meta) => {
        const chunk = (vitepress as ManualChunks)(id, meta);
        return chunk === "theme" && isLibraryDependency(id.replaceAll("\\", "/")) ? undefined : chunk;
      };
      return { ...options, manualChunks: wrapped as typeof options.manualChunks };
    },
  };
}
