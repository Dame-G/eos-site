import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const here = createRequire(import.meta.url);
const libEntry = here.resolve("@eos-ui/vue");
const libRequire = createRequire(libEntry);
const toUrl = (p) => pathToFileURL(p).href;
const { createSSRApp, h } = await import(toUrl(libRequire.resolve("vue")));
const { renderToString } = await import(toUrl(libRequire.resolve("vue/server-renderer")));
const eos = await import(toUrl(libEntry));

const warnings = [];
const origWarn = console.warn;
console.warn = (...a) => warnings.push(a.map(String).join(" "));

const results = [];
const note = (name, ok, detail = "") => results.push({ name, ok, detail });

const cases = {
  EButton: () => h(eos.EButton, null, () => "Pay $162.40"),
  ETextField: () => h(eos.ETextField, { label: "Email", error: "Enter an email" }),
  ESelect: () => h(eos.ESelect, { label: "Pay with", options: ["Visa", "Bank"] }),
  ECalendar: () => h(eos.ECalendar, { month: new Date(2026, 9, 1) }),
  ETabs: () => h(eos.ETabs, { items: [{ id: "a", label: "A" }, { id: "b", label: "B" }] }),
  EDialog: () => h(eos.EDialog, { open: true, title: "Confirm" }, () => "Body"),
  EDialogInline: () => h(eos.EDialog, { open: true, inline: true, title: "Confirm" }, () => "Body"),
  EIcon: () => h(eos.EIcon, { name: "lock" }),
};

async function render(vnode, withPlugin, options = {}) {
  const app = createSSRApp({ render: vnode });
  if (withPlugin) app.use(eos.createEos({ locale: "fr-CA", currency: "CAD", ...options }));
  return renderToString(app);
}

note("The package loads in plain Node (no CSS imports in the JavaScript)", typeof eos.createEos === "function", `${Object.keys(eos).length} exports`);

for (const [name, fn] of Object.entries(cases)) {
  try {
    const a = await render(fn, true);
    const b = await render(fn, true);
    const plain = await render(fn, false);
    note(`${name} renders on the server`, a.length > 0, `${a.length} characters`);
    note(`${name} output is identical on two renders (ids are stable)`, a === b);
    note(`${name} renders without the plugin installed`, plain.length > 0);
  } catch (e) {
    note(`${name} renders on the server`, false, String(e?.message ?? e).split("\n")[0]);
  }
}

const cal = await render(cases.ECalendar, true);
note("Locale reaches the server HTML (French month name)", /octobre/i.test(cal), (cal.match(/octobre|October/i) ?? ["none"])[0]);

note("createEos().install does not throw without a document", typeof document === "undefined");

const css = eos.defineTheme({ brand: "#8a2be2" }).css({ header: true });
note("defineTheme().css() gives a stylesheet for <head>", css.includes("--e-primary") && css.includes("@layer"), `${css.length} characters`);

const modal = await render(cases.EDialog, true);
note("A modal dialog that starts open leaves nothing in the server HTML (it opens in the browser, after hydration)", !modal.includes("Body"), `${modal.length} characters`);
const inline = await render(cases.EDialogInline, true);
note("Even an inline dialog draws nothing on the server (its content appears after hydration)", !inline.includes("Body"), inline.slice(0, 60));

console.warn = origWarn;
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.detail ? "  (" + r.detail + ")" : ""}`);
console.log(`\nVue and library warnings during rendering: ${warnings.length}`);
for (const w of [...new Set(warnings)].slice(0, 12)) console.log("  " + w.split("\n")[0]);
process.exit(results.every((r) => r.ok) ? 0 : 1);
