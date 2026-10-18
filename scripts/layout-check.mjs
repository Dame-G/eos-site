// Opens every page of a running preview in a real browser at a phone and a desktop width and reports horizontal
// overflow, console errors and failed requests. Run after a build: pnpm docs:preview, then node scripts/layout-check.mjs
import { chromium } from "playwright";
import { listComponents } from "../docs/.vitepress/eos-source.mjs";

const base = process.env.BASE || "http://localhost:4173";
const pages = [
  "/",
  "/components/",
  "/tokens",
  "/playground",
  "/patterns/",
  ...["pay-a-bill", "sign-in", "register", "schedule-a-visit", "sign-a-form", "statements"].map((p) => `/patterns/${p}`),
  ...["getting-started", "theming", "icons", "language", "forms", "accessibility", "design-principles", "ssr", "vuetify"].map((p) => `/guide/${p}`),
  ...listComponents().map((n) => `/components/${n}`),
];
const widths = [375, 1280];

const browser = await chromium.launch(process.env.CI ? {} : { channel: "msedge" });
const problems = [];
for (const width of widths) {
  const context = await browser.newContext({ viewport: { width, height: 800 } });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("requestfailed", (r) => errors.push(`failed: ${r.url()}`));
  for (const path of pages) {
    errors.length = 0;
    await page.goto(base + path, { waitUntil: "networkidle" });
    const over = await page.evaluate(() => {
      const root = document.documentElement;
      if (root.scrollWidth <= root.clientWidth + 1) return null;
      const bad = [...document.querySelectorAll("body *")]
        .filter((e) => e.getBoundingClientRect().right > root.clientWidth + 1 && getComputedStyle(e).position !== "fixed")
        .slice(0, 3)
        .map((e) => `${e.tagName.toLowerCase()}.${String(e.className).slice(0, 40)}`);
      return `${root.scrollWidth}px wide: ${bad.join(", ")}`;
    });
    if (over) problems.push(`${width}px ${path}: overflow ${over}`);
    for (const e of errors) problems.push(`${width}px ${path}: ${e.slice(0, 160)}`);
  }
  await context.close();
}
await browser.close();
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`layout ok: ${pages.length} pages at ${widths.join(" and ")}px`);
