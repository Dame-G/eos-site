import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { playwright } from "@vitest/browser-playwright";
import { firstParagraph, listComponents, readReadme, summaryOf } from "./docs/.vitepress/eos-source.mjs";
import { launchOptions } from "./scripts/browser.mjs";

/** Tests that mount components or need a page run in Chromium; everything else is plain logic and runs in Node. */
const BROWSER = ["tests/chrome.test.ts", "tests/demos.test.ts", "tests/guides.test.ts", "tests/not-found.test.ts", "tests/patterns.test.ts", "tests/playground.test.ts"];

export default defineConfig({
  plugins: [vue()],
  resolve: {
    dedupe: ["vue"],
    alias: [
      // VitePress-only modules, replaced so the chrome can be mounted without VitePress running.
      { find: "@localSearchIndex", replacement: fileURLToPath(new URL("./tests/stubs/search-index.ts", import.meta.url)) },
    ],
  },
  define: {
    __EOS_VERSION__: JSON.stringify("0.0.0"),
    __COMPONENTS__: JSON.stringify(listComponents()),
    __TEXTS__: JSON.stringify(listComponents().flatMap((name) => [firstParagraph(readReadme(name)), summaryOf(readReadme(name))].map((text) => ({ name, text })))),
  },
  server: { fs: { allow: ["..", "."] } },
  // Shiki and its grammars are listed so a cold cache does not re-optimise them in the middle of a run.
  optimizeDeps: { include: ["vue", "vitest-browser-vue", "axe-core", "shiki/core", "shiki/engine/javascript", ...["typescript", "css", "vue", "html", "shellscript"].map((l) => `shiki/langs/${l}.mjs`)] },
  test: {
    testTimeout: 20000,
    projects: [
      {
        extends: true,
        test: { name: "node", include: ["tests/**/*.test.ts"], exclude: BROWSER, environment: "node" },
      },
      {
        extends: true,
        test: {
          name: "browser",
          include: BROWSER,
          setupFiles: ["./tests/setup.ts"],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({ launchOptions: launchOptions() }),
            instances: [{ browser: "chromium" }],
            viewport: { width: 900, height: 900 },
          },
        },
      },
    ],
  },
});
