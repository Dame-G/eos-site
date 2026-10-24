import { chromium } from "playwright";
import { createRequire } from "node:module";
import { readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { listComponents } from "../docs/.vitepress/eos-source.mjs";
import { STATIC_PATHS } from "../docs/.vitepress/pages.mjs";

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:4173";
const all = args.includes("--all");
const shots = args.includes("--shots") ? args[args.indexOf("--shots") + 1] : null;
// Every page is checked in both schemes unless one is named: --scheme light or --scheme dark.
const only = args.includes("--scheme") ? args[args.indexOf("--scheme") + 1] : null;
const schemes = only ? [only] : ["light", "dark"];
// Pages are checked this many at a time.
const jobs = args.includes("--jobs") ? Number(args[args.indexOf("--jobs") + 1]) : 4;
// Each scheme is checked on a desktop and on a phone. The phone pass only looks for errors and sideways scrolling.
const viewports = [
  { name: "desktop", width: 1280, height: 900, axe: true },
  { name: "phone", width: 375, height: 800, axe: false },
];

const axeSource = readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");

// --only /components/Toast keeps just the pages whose path contains the text.
const filter = args.includes("--only") ? args[args.indexOf("--only") + 1] : "";
const pages = [
  ...STATIC_PATHS,
  ...(all ? listComponents() : ["Button", "Select", "DataGrid", "Calendar", "Dialog", "ExpandableRow"]).map((c) => `/components/${c}`),
].filter((path) => path.includes(filter));

const ALLOWED = {
  "/components/AppShell": ["landmark-main-is-top-level", "landmark-no-duplicate-main", "landmark-unique", "landmark-no-duplicate-banner"],
  "/patterns/app-shell": ["landmark-main-is-top-level", "landmark-no-duplicate-main", "landmark-unique", "landmark-no-duplicate-banner"],
  "/components/Definition": ["landmark-no-duplicate-banner", "landmark-unique"],
};

const browser = await chromium.launch(process.env.CI ? {} : { channel: "msedge" });
if (shots) mkdirSync(shots, { recursive: true });
let failures = 0;
let total = 0;

async function check(context, viewport, scheme, path) {
  const page = await context.newPage();
  const problems = [];
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") problems.push(`console ${m.type()}: ${m.text().slice(0, 200)}`);
  });
  page.on("pageerror", (e) => problems.push(`page error: ${e.message.slice(0, 200)}`));
  page.on("response", (r) => {
    if (r.url().startsWith(base) && r.status() >= 400) problems.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    return { scroll: root.scrollWidth, client: root.clientWidth };
  });
  if (overflow.scroll > overflow.client) problems.push(`the page scrolls sideways: ${overflow.scroll}px of content in ${overflow.client}px`);
  if (viewport.axe) {
    await page.addScriptTag({ content: axeSource });
    const violations = await page.evaluate(async () => {
      // @ts-ignore axe is injected above
      const r = await axe.run(document, { resultTypes: ["violations"] });
      return r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.slice(0, 3).map((n) => n.target.join(" ") + " :: " + (n.failureSummary || "").replace(/\s+/g, " ").slice(0, 160)) }));
    });
    for (const v of violations.filter((x) => !(ALLOWED[path] ?? []).includes(x.id))) problems.push(`axe ${v.id} (${v.impact}): ${v.nodes.join(" | ")}`);
    if (shots) await page.screenshot({ path: join(shots, (path.replace(/\W+/g, "_") || "home") + `.${scheme}.png`), fullPage: true });
  }
  await page.close();
  return problems;
}

for (const scheme of schemes) {
  for (const viewport of viewports) {
    console.log(`\n${scheme} scheme, ${viewport.name}`);
    // The site reads the saved choice before the first paint (docs/.vitepress/scheme.ts), so it is set before any page script runs.
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    await context.addInitScript((value) => {
      try {
        localStorage.setItem("eos-scheme", value);
      } catch {}
    }, scheme);
    const queue = [...pages];
    await Promise.all(
      Array.from({ length: jobs }, async () => {
        for (let path = queue.shift(); path !== undefined; path = queue.shift()) {
          const problems = await check(context, viewport, scheme, path);
          total++;
          console.log(`${problems.length ? "FAIL" : "ok  "} ${path}`);
          for (const p of problems) console.log("      " + p);
          if (problems.length) failures++;
        }
      }),
    );
    await context.close();
  }
}
await browser.close();
console.log(failures ? `\n${failures} of ${total} page checks have problems` : `\nAll ${total} page checks are clean (${schemes.join(" and ")}, desktop and phone)`);
process.exit(failures ? 1 : 0);
