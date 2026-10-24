// Draws the brand images from the eos logo: docs/public/favicon.svg, apple-touch-icon.png and og.png.
// The mark comes from the library checkout (brand/mark.svg in Dame-G/eos, beside this repo or at EOS_DIR), so rebuild the logo there first, then run:
//
//   node scripts/gen-brand.mjs

import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "docs", "public");
const eosRoot = resolve(process.env.EOS_DIR || join(root, "../eos"));
const font = (pkg, file) => pathToFileURL(join(root, "node_modules/@fontsource-variable", pkg, "files", file)).href;
const bricolage = font("bricolage-grotesque", "bricolage-grotesque-latin-wght-normal.woff2");
const mono = font("geist-mono", "geist-mono-latin-wght-normal.woff2");

// The logo's colours, as in brand/mark.svg: the library's default brand (the pastel lavender), its slab (30% black) and the deep e on it (65% black).
const FACE = "#bfa8f5";
const SLAB = "#8676ac";
const ON = "#433b56";

// The favicon is the mark itself, the same file the library keeps.
const mark = readFileSync(join(eosRoot, "brand/mark.svg"), "utf8");
writeFileSync(join(out, "favicon.svg"), mark);
const e = /<path d="([^"]+)" class="glyph"\/>/.exec(mark)?.[1];
if (!e) throw new Error("[eos-site] No e glyph in brand/mark.svg: the mark changed shape, so update the pattern in gen-brand.mjs.");

// The touch icon: the tile full bleed, as iOS rounds the corners itself (about 14.3 of 64). Built as the logo is: the slab is the body and the face sits in it, so the slab runs round the face as a border and is thicker below. The face's corners are concentric with the OS's, so the border has an even width round each corner.
const touch = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64"><rect width="64" height="64" fill="${SLAB}"/><rect x="2.5" y="2.5" width="59" height="54.5" rx="11.8" fill="${FACE}"/><path d="${e}" fill="${ON}"/></svg>`;

// The share card is an EToast that is the whole card: a white surface with the home page's flowing lines on it (the primary at the light theme's 14%) and the heavy slab down the start side, full bleed and square. The lines are drawn by the same maths as the home page (docs/.vitepress/theme/flow.ts) at one chosen moment.
const W = 1200;
const H = 630;
const PRIMARY = "#624b90";
const SLAB_W = 24; // the toast's slab, at four times
const { TILT, draw, fieldFor } = await import(pathToFileURL(join(root, "docs/.vitepress/theme/flow.ts")).href);
const MOMENT = 140; // seconds into the animation: any moment will do, this one has swellings spread across the card
const lines = `<g opacity=".14" transform="rotate(${TILT})" fill="${PRIMARY}">${draw(fieldFor(W - SLAB_W, H), MOMENT)
  .map((d) => `<path d="${d}"/>`)
  .join("")}</g>`;

// The lockup is the library's own logo, so the name sits against the tile as it does in the header.
const logo = pathToFileURL(join(eosRoot, "brand/logo.svg")).href;

const page = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:B;src:url("${bricolage}");font-weight:100 900}
@font-face{font-family:M;src:url("${mono}");font-weight:100 900}
*{box-sizing:border-box;margin:0}
body{width:${W}px;height:${H}px;background:#fff;color:#000;position:relative;overflow:hidden;font-family:B}
.toast{position:absolute;inset:0;border-inline-start:${SLAB_W}px solid ${SLAB};overflow:hidden;padding:0 90px 100px 80px;display:flex;flex-direction:column;justify-content:center}
svg.bg{position:absolute;inset:0}
.toast>*{position:relative}
img{display:block;align-self:flex-start;height:240px;margin-left:-15px}
p{font:500 52px/1.2 B;margin-top:16px;color:#000}
.foot{position:absolute;left:80px;right:90px;bottom:48px;display:flex;justify-content:space-between;align-items:center;font:500 28px M;color:#515151}
.pill{padding:10px 22px;border:3px solid #7c8c93;border-radius:12px;color:#000;background:#fff}
</style><div class="toast"><svg class="bg" width="${W - SLAB_W}" height="${H}">${lines}</svg>
<img src="${logo}" alt=""><p>A component library for Vue.</p>
<div class="foot"><span>eos.dame.gg</span><span class="pill">@eos-ui/vue</span></div></div>`;

const dir = mkdtempSync(join(tmpdir(), "eos-brand-"));
const browser = await chromium.launch();
try {
  const shot = async (html, width, height, file) => {
    const tab = await browser.newPage({ viewport: { width, height } });
    // Fonts load from files, which a page with no address cannot reach, so the page is written out and opened.
    const source = join(dir, `${width}x${height}.html`);
    writeFileSync(source, html);
    await tab.goto(pathToFileURL(source).href);
    await tab.evaluate(() => document.fonts.ready);
    writeFileSync(join(out, file), await tab.screenshot({ type: "png" }));
    await tab.close();
  };
  await shot(page, W, H, "og.png");
  await shot(`<!doctype html><style>*{margin:0}body{width:180px;height:180px}svg{display:block}</style>${touch}`, 180, 180, "apple-touch-icon.png");
} finally {
  await browser.close();
}
console.log("favicon.svg, apple-touch-icon.png and og.png written to docs/public");
