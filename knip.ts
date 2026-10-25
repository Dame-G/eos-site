import type { KnipConfig } from "knip";

export default {
  entry: ["docs/.vitepress/config.mts", "docs/.vitepress/theme/index.ts", "docs/**/*.paths.mjs", "docs/data/*.data.js", "scripts/*.mjs", "tests/**/*.test.ts"],
  project: ["docs/**/*.{ts,mts,mjs,js,vue,css}", "scripts/**", "tests/**"],
  // The stylesheets name font files by package path in url(), which is a dependency like an import.
  compilers: {
    css: (text: string) => [...text.matchAll(/url\("([^".][^"]*)"\)/g)].map(([, path]) => `import "${path}";`).join("\n"),
  },
  ignoreDependencies: ["@localSearchIndex"],
  ignoreBinaries: ["build"],
} satisfies KnipConfig;
