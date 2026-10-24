import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { playwright } from "@vitest/browser-playwright";
import { firstParagraph, listComponents, readReadme, summaryOf } from "./docs/.vitepress/eos-source.mjs";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    dedupe: ["vue"],
    alias: [
      // VitePress-only modules, replaced so the chrome can be mounted without VitePress running.
      { find: "@localSearchIndex", replacement: fileURLToPath(new URL("./tests/stubs/search-index.ts", import.meta.url)) },
      { find: /^.*\/data\/components\.data\.js$/, replacement: fileURLToPath(new URL("./tests/stubs/components-data.ts", import.meta.url)) },
    ],
  },
  define: {
    __EOS_LICENSE__: JSON.stringify("MIT License\n\nPermission is hereby granted."),
    __EOS_BUILD__: JSON.stringify({ version: "0.0.0" }),
    __COMPONENTS__: JSON.stringify(listComponents()),
    __TEXTS__: JSON.stringify(listComponents().flatMap((name) => [firstParagraph(readReadme(name)), summaryOf(readReadme(name))].map((text) => ({ name, text })))),
  },
  server: { fs: { allow: ["..", "."] } },
  // Shiki and its grammars are listed so a cold cache does not re-optimise them in the middle of a run.
  optimizeDeps: { include: ["vue", "vitest-browser-vue", "axe-core", "shiki/core", "shiki/engine/javascript", ...["typescript", "css", "vue", "html", "shellscript"].map((l) => `shiki/langs/${l}.mjs`)] },
  test: {
    include: ["tests/**/*.test.ts"],
    setupFiles: ["./tests/setup.ts"],
    testTimeout: 20000,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright({ launchOptions: process.env.CI ? {} : { channel: "msedge" } }),
      instances: [{ browser: "chromium" }],
      viewport: { width: 900, height: 900 },
    },
  },
});
