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

const axeSource = readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");

const pages = [
  ...STATIC_PATHS,
  ...(all ? listComponents() : ["Button", "Select", "DataGrid", "Calendar", "Dialog", "ExpandableRow"]).map((c) => `/components/${c}`),
];

const ALLOWED = {
  "/components/AppShell": ["landmark-main-is-top-level", "landmark-no-duplicate-main", "landmark-unique"],
  "/components/Definition": ["landmark-no-duplicate-banner", "landmark-unique"],
};

const browser = await chromium.launch(process.env.CI ? {} : { channel: "msedge" });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
if (shots) mkdirSync(shots, { recursive: true });
let failures = 0;

for (const path of pages) {
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
  await page.addScriptTag({ content: axeSource });
  const violations = await page.evaluate(async () => {
    // @ts-ignore axe is injected above
    const r = await axe.run(document, { resultTypes: ["violations"] });
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.slice(0, 3).map((n) => n.target.join(" ") + " :: " + (n.failureSummary || "").replace(/\s+/g, " ").slice(0, 160)) }));
  });
  for (const v of violations.filter((x) => !(ALLOWED[path] ?? []).includes(x.id))) problems.push(`axe ${v.id} (${v.impact}): ${v.nodes.join(" | ")}`);
  if (shots) await page.screenshot({ path: join(shots, (path.replace(/\W+/g, "_") || "home") + ".png"), fullPage: true });
  console.log(`${problems.length ? "FAIL" : "ok  "} ${path}`);
  for (const p of problems) console.log("      " + p);
  if (problems.length) failures++;
  await page.close();
}
await browser.close();
console.log(failures ? `\n${failures} of ${pages.length} pages have problems` : `\nAll ${pages.length} pages are clean`);
process.exit(failures ? 1 : 0);
