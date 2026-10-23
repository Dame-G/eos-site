import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "docs/.vitepress/dist");
const demos = join(root, "docs/components/demos");
const SITE = "https://eos.dame.gg";

if (!existsSync(dist)) {
  console.error("No build output at docs/.vitepress/dist. Run pnpm docs:build first.");
  process.exit(1);
}

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const file = join(dir, name);
    return statSync(file).isDirectory() ? htmlFiles(file) : name.endsWith(".html") ? [file] : [];
  });
}

const count = (html, pattern) => (html.match(pattern) ?? []).length;
// These component pages show a demo that is itself a page or a page header, so they hold a second main or h1 by design.
const DEMO_LANDMARKS = { "components/AppShell.html": { main: 2 }, "patterns/app-shell.html": { main: 2 }, "components/Heading.html": { h1: 2 }, "components/PageHeader.html": { h1: 2 } };
const problems = [];
const files = htmlFiles(dist);

for (const file of files) {
  const rel = relative(dist, file).replaceAll("\\", "/");
  const html = readFileSync(file, "utf8");
  const fail = (message) => problems.push(`${rel}: ${message}`);
  const notFound = rel === "404.html";

  const expected = { main: 1, h1: 1, ...DEMO_LANDMARKS[rel] };
  if (!notFound) {
    if (count(html, /<main\b/g) !== expected.main) fail(`expected ${expected.main} <main>, found ${count(html, /<main\b/g)}`);
    if (count(html, /<h1\b/g) !== expected.h1) fail(`expected ${expected.h1} <h1>, found ${count(html, /<h1\b/g)}`);
    if (!/<link rel="canonical" href="https:\/\/eos\.dame\.gg\/[^"]*">/.test(html)) fail("no canonical link");
    if (!html.includes(`<meta property="og:image" content="${SITE}/og.png">`)) fail("no og:image");
  }
  if (/vp-icons\.css/.test(html)) fail("still links vp-icons.css");

  const component = /^components\/([^/]+)\.html$/.exec(rel)?.[1];
  if (component && existsSync(join(demos, `${component}.vue`)) && !html.includes("demo-stage")) fail(`no server-rendered demo for E${component}`);
  if (component && !html.includes('"@type":"BreadcrumbList"')) fail("no BreadcrumbList data");
}

const sitemap = join(dist, "sitemap.xml");
if (!existsSync(sitemap)) problems.push("sitemap.xml is missing");
else {
  const urls = [...readFileSync(sitemap, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!urls.length) problems.push("sitemap.xml lists no pages");
  for (const url of urls) {
    const path = url.replace(SITE, "").replace(/^\//, "");
    const page = path === "" ? "index.html" : path.endsWith("/") ? `${path}index.html` : `${path}.html`;
    if (!existsSync(join(dist, page))) problems.push(`sitemap.xml lists ${url}, but ${page} is not in the build`);
  }
}

if (existsSync(join(dist, "vp-icons.css"))) problems.push("vp-icons.css is still in the build");
if (!existsSync(join(dist, "_headers"))) problems.push("_headers is missing");

for (const p of problems) console.log("FAIL  " + p);
console.log(problems.length ? `\n${problems.length} problems in ${files.length} built pages` : `All ${files.length} built pages pass`);
process.exit(problems.length ? 1 : 0);
