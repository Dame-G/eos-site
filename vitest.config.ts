import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { playwright } from "@vitest/browser-playwright";
import { listComponents } from "./docs/.vitepress/eos-source.mjs";

export default defineConfig({
  plugins: [vue()],
  // One copy of Vue: the library is linked from beside this repo and has its own node_modules.
  resolve: { dedupe: ["vue"] },
  // The folders of the library, so there is one demo test per component without reading the disk in the browser.
  define: { __COMPONENTS__: JSON.stringify(listComponents()) },
  server: { fs: { allow: ["..", "."] } },
  // Pre-bundle everything the demos use up front, so a cold cache does not reload the page mid-run.
  optimizeDeps: { include: ["vue", "vitest-browser-vue", "axe-core"] },
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
