// Draws the brand images that match the site's title: docs/public/favicon.svg, apple-touch-icon.png and og.png.
// The letters use the same Geist Mono face, colour and slab as BubbleTitle.vue. Run it after changing the title:
//
//   node scripts/gen-brand.mjs

import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "docs", "public");
const bricolage = pathToFileURL(join(root, "node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2")).href;
const mono = pathToFileURL(join(root, "node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2")).href;

const PRIMARY = "#3ca1c1";
const SLAB = "#236170"; // 58% of the primary, the rest black
const PAPER = "#0a0e11";

// The favicon: one heavy "E" on the dark page colour, drawn with rectangles so it needs no font, standing on its slab.
const E = "M9 8H24.5V11.8H14V14.1H22.5V17.9H14V20.2H24.5V24H9Z";
const icon = (corner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32"${corner ? ` rx="${corner}"` : ""} fill="${PAPER}"/><path d="${E}" transform="translate(0 1)" fill="${SLAB}"/><path d="${E}" fill="${PRIMARY}"/></svg>`;
writeFileSync(join(out, "favicon.svg"), icon(8) + "\n");

// Faint flowing lines for the share image, the same idea as the home page background.
const lines = Array.from({ length: 16 }, (_, i) => {
  const y = i * 52 - 20;
  const a = 26 + (i % 5) * 7;
  let d = `M-40 ${y}`;
  for (let x = -40; x <= 1260; x += 40) d += ` L${x} ${(y + a * Math.sin(x / 190 + i * 0.5) + 14 * Math.sin(x / 90 - i)).toFixed(1)}`;
  return `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".05" stroke-width="${i % 3 === 0 ? 5 : 2.5}" stroke-linecap="round" stroke-linejoin="round"/>`;
}).join("");

const letters = ["E", "O", "S"].map((c) => `<span class="l" data-c="${c}">${c}</span>`).join("");

const page = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:B;src:url("${bricolage}");font-weight:100 900}
@font-face{font-family:M;src:url("${mono}");font-weight:100 900}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:${PAPER};color:#fff;position:relative;overflow:hidden;font-family:B}
svg.bg{position:absolute;inset:0}
.wrap{position:absolute;inset:0;padding:40px 90px 100px;display:flex;flex-direction:column;justify-content:center}
.t{font:800 235px/1 M;letter-spacing:-.07em;color:${PRIMARY};display:flex;margin-left:-6px;margin-bottom:8px}
.l{position:relative;display:inline-block;filter:drop-shadow(0 .028em 0 ${SLAB})}
p{font:500 42px/1.25 B;color:#fff;max-width:820px;margin-top:10px}
.foot{position:absolute;left:90px;right:90px;bottom:56px;display:flex;justify-content:space-between;align-items:center;font:500 28px M;color:#a0a0a0}
.pill{padding:10px 22px;border:2px solid #6a6a6a;border-radius:10px;color:${PRIMARY};background:#0f1418}
</style><svg class="bg" width="1200" height="630">${lines}</svg>
<div class="wrap"><div class="t">${letters}</div><p>Accessible Vue 3 components with a token-based theme system.</p></div>
<div class="foot"><span>eos.dame.gg</span><span class="pill">@eos-ui/vue</span></div>`;

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
  await shot(page, 1200, 630, "og.png");
  const touch = icon(0).replace('viewBox="0 0 32 32"', 'width="180" height="180" viewBox="0 0 32 32"');
  await shot(`<!doctype html><style>*{margin:0}body{width:180px;height:180px}</style>${touch}`, 180, 180, "apple-touch-icon.png");
} finally {
  await browser.close();
}
console.log("favicon.svg, apple-touch-icon.png and og.png written to docs/public");
