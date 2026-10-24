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
const outfit = font("outfit", "outfit-latin-wght-normal.woff2");
const bricolage = font("bricolage-grotesque", "bricolage-grotesque-latin-wght-normal.woff2");
const mono = font("geist-mono", "geist-mono-latin-wght-normal.woff2");

// The logo's colours: the library's default primary, its slab (30% black) and the letter on it.
const FACE = "#17586d";
const SLAB = "#104251";
const ON = "#ffffff";

// The favicon is the mark itself, the same file the library keeps.
const mark = readFileSync(join(eosRoot, "brand/mark.svg"), "utf8");
writeFileSync(join(out, "favicon.svg"), mark);
const e = /<path d="([^"]+)" class="glyph"\/>/.exec(mark)?.[1];
if (!e) throw new Error("[eos-site] No e glyph in brand/mark.svg: the mark changed shape, so update the pattern in gen-brand.mjs.");

// The touch icon: the tile full bleed, as iOS rounds the corners itself. The face runs down to the slab, which is the bottom edge.
const touch = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64"><rect width="64" height="64" fill="${SLAB}"/><rect width="64" height="59" fill="${FACE}"/><path d="${e}" fill="${ON}" transform="translate(0 0.5)"/></svg>`;

// The share card is built like a primary button: the face, then the slab along the bottom edge. The home page's flowing lines run faintly across the face, drawn by the same maths (docs/.vitepress/theme/flow.ts) at one chosen moment.
const W = 1200;
const H = 630;
const DEPTH = 36;
const { TILT, draw, fieldFor } = await import(pathToFileURL(join(root, "docs/.vitepress/theme/flow.ts")).href);
const MOMENT = 140; // seconds into the animation: any moment will do, this one has swellings spread across the card
const lines = `<g opacity=".07" transform="rotate(${TILT})" fill="#fff">${draw(fieldFor(W, H - DEPTH), MOMENT)
  .map((d) => `<path d="${d}"/>`)
  .join("")}</g>`;

// On the primary face the tile turns over: a white tile with a primary e, standing on a pale slab.
const tile = `<svg width="168" height="168" viewBox="0 0 64 64"><rect x="4" y="4" width="56" height="55" rx="12" fill="#c9dde3"/><rect x="5.5" y="5.5" width="53" height="48.5" rx="10.5" fill="${ON}"/><path d="${e}" fill="${FACE}"/></svg>`;

const page = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:O;src:url("${outfit}");font-weight:100 900}
@font-face{font-family:B;src:url("${bricolage}");font-weight:100 900}
@font-face{font-family:M;src:url("${mono}");font-weight:100 900}
*{box-sizing:border-box;margin:0}
body{width:${W}px;height:${H}px;background:${SLAB};color:${ON};position:relative;overflow:hidden;font-family:B}
.face{position:absolute;inset:0 0 ${DEPTH}px;background:${FACE};overflow:hidden}
svg.bg{position:absolute;inset:0}
.wrap{position:absolute;inset:0;padding:0 90px 80px;display:flex;flex-direction:column;justify-content:center}
.lockup{display:flex;align-items:center;gap:36px;margin-left:-10px}
.word{font:600 200px/1 O;letter-spacing:-.01em;margin-top:-18px}
p{font:500 50px/1.2 B;max-width:1000px;margin-top:30px}
.foot{position:absolute;left:90px;right:90px;bottom:48px;display:flex;justify-content:space-between;align-items:center;font:500 28px M;color:#cfe3e9}
.pill{padding:10px 22px;border:2px solid #5d8d9b;border-radius:10px;color:${ON}}
</style><div class="face"><svg class="bg" width="${W}" height="${H - DEPTH}">${lines}</svg>
<div class="wrap"><div class="lockup">${tile}<span class="word">eos</span></div><p>A component library for Vue.</p></div>
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
