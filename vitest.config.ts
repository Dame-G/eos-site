import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { playwright } from "@vitest/browser-playwright";
import { listComponents } from "./docs/.vitepress/eos-source.mjs";

export default defineConfig({
  plugins: [vue()],
  resolve: { dedupe: ["vue"] },
  define: { __COMPONENTS__: JSON.stringify(listComponents()) },
  server: { fs: { allow: ["..", "."] } },
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
