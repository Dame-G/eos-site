---
title: Theming
description: "Rebrand EOS with defineTheme, plain CSS variables or a scoped theme."
---

# Theming

A theme is a set of `--e-*` CSS variables ([all tokens](/guide/tokens)). Build one with `defineTheme()`, which also checks contrast, or override the variables in CSS. Try values in the [playground](/playground).

```ts
import { createEos, defineTheme } from "@eos-ui/vue";

const clinic = defineTheme({
  name: "clinic",
  brand: "#8a2be2",
  accent: "#2e7d32",
  fonts: { sans: "Inter, system-ui, sans-serif" },
  radius: "round",
});

clinic.issues; // [] when every contrast pair holds
app.use(createEos({ theme: clinic })); // or createEos({ theme: { brand: "#8a2be2" } })
```

`defineTheme()` takes the inputs below and emits every token. Any token can also be set by name in `tokens`, which wins over everything derived.

| Input | Derives |
| --- | --- |
| `brand`, `accent` | `primary`, `secondary`, their tints and `surface-tint` |
| `danger`, `warning` | `danger`, `on-danger`, `danger-soft`, `warning-strong`, `warning-soft` |
| `background`, `surface`, `foreground` | the grounds, `ink`, `muted`, `border` and `border-strong`. A dark surface lifts the action colours |
| `fonts`, `radius` | `font-sans`, `font-mono`, `font-script` (signatures), and `radius-sm` to `radius-lg` |
| `textScale`, `spaceScale` | `text-xs` to `text-4xl` plus the icon, checkbox and avatar boxes (`textScale`, on top of the visitor's own browser font size, since these tokens are in rem), and `space-1` to `space-16` with the `gap-*`, `pad-*` and `gutter` tokens that reference them (`spaceScale`). 1 is the default |
| `strokes` `{ hair, focus, edge, card }` | `stroke-hair`, `stroke-card`, `stroke-edge`, `stroke-focus` (the width of the focus outline and its gap), `focus-gap-field` (follows `stroke-edge`). `edge` and `card` set their token outright. Without them `edge` is 1.5 times `hair` and `card` is `hair` (2px on a bold elevation) |
| `contrast` `"standard" \| "high" \| "auto"` | With `high`, `border` and `border-strong` become `ink`, `muted` holds 15:1, `surface-tint` is neutral grey and `scrim` is darker. `auto` stays standard and switches to `high` under `prefers-contrast: more` |
| `scheme` `"light" \| "dark" \| "auto"`, `dark` | `auto` keeps the theme light and applies `dark` (a dark surface of `#10151a` unless you give one) when the visitor prefers a dark page. See [Light and dark](#light-and-dark) |
| `density` `"comfortable" \| "compact"` | `compact` scales the space scale by 0.75 (the `gap-*`, `pad-*` and `gutter` tokens follow) and makes controls exactly the 44px tap target. A smaller `controlHeight` is raised to 44 and reported in `warnings` |
| `preset` `"paper" \| "ink" \| "quiet"` | `elevation`, `strokes`, `radius` and `motion` together. Your own entries win. See [Presets](#presets) |
| `motion` `"default" \| "snappy" \| "gentle" \| "none"` | `duration-tap`, `duration-fade`, `duration-move`, `easing-out` |
| `elevation` `"outline" \| "lifted" \| "bold"` | `frame`, `well`, `float` and `paper`. The shadow tint follows `background` |
| `controlHeight` | `control-height`, `chip-height` |

Three more options are not inputs. `name` is the value of `data-e-theme` when the theme is applied to an element. `tokens` sets any token by name, wins over derived values and is not contrast-corrected. `strict` throws on a contrast failure instead of listing it in `issues`. The [token reference](/guide/tokens) lists each token with the input it follows.

## Presets

`preset` is a starting look: one word that sets `elevation`, `strokes`, `radius` and `motion` together. Anything you set yourself wins, and `strokes` merges entry by entry. Fonts and colours are never part of a preset.

| Preset | Look |
| --- | --- |
| `"paper"` | The default: flat outlines, default corners and motion |
| `"ink"` | Bold elevation, heavier lines (`hair: 2`, `focus: 3`), sharp corners and snappy motion |
| `"quiet"` | Lifted elevation, round corners and gentle motion |

```ts
defineTheme({ preset: "ink", brand: "#8a2be2" });
defineTheme({ preset: "quiet", radius: "default" }); // quiet, but with the default corners
```

## One example per family

```ts
defineTheme({ brand: "#8a2be2", accent: "#2e7d32", danger: "#b3261e" }); // colour
defineTheme({ radius: "round", elevation: "lifted", strokes: { hair: 1, focus: 3 } }); // shape
defineTheme({ contrast: "high", elevation: "bold", strokes: { hair: 2, edge: 2 } }); // high contrast
defineTheme({ fonts: { sans: "Inter, system-ui, sans-serif" }, textScale: 1.1 }); // type
defineTheme({ spaceScale: 1.25, controlHeight: 56 }); // space
defineTheme({ density: "compact" }); // tighter space, 44px controls
defineTheme({ brand: "#8a2be2", scheme: "auto", contrast: "auto" }); // follows the visitor
defineTheme({ motion: "snappy" }); // motion
defineTheme({ tokens: { "radius-md": "12px", "z-modal": "60" } }); // any other token
```

`theme.issues` lists each failing pair: `{ role, pair, ratio, min }`. `createEos` also logs them outside production, and `warnOnContrast: false` turns that off. The pairs are under [Accessibility](/guide/accessibility#contrast).

## Warnings and explain

`theme.warnings` lists what `defineTheme` ignored or changed, and what it could not check, in plain sentences: a scale that is not a positive number, a `controlHeight` under the compact tap target, a `dark` without `scheme: "auto"`, an unknown name in `tokens`, a contrast pair it could not evaluate. They are also printed with `console.warn` outside production.

`theme.explain(token)` says where a token's value comes from: the value, the inputs that drive it and which of them you gave, or that you set it in `tokens`, and its usage note.

```ts
const theme = defineTheme({ brand: "#8a2be2" });
theme.explain("primary");
// --e-primary: <the value>
// driven by: brand
// given here: brand
// <the token's usage note>
```

## Background, surface and foreground

Three colours set the neutrals. Everything else follows from them.

| Input | Token it sets | What it derives |
| --- | --- | --- |
| `background` | `--e-background`, painted by [`EAppShell`](/components/AppShell) | The tint of shadows. Checked against ink, muted text, primary and the border |
| `surface` | `--e-surface` | `--e-surface-tint`, the second ground (wells, hovered rows, table headers): its lightness moved 0.045 toward the foreground, in the brand hue, or 0.06 the other way on a dark surface. Also `--e-secondary-soft`, `--e-danger-soft` and `--e-warning-soft`, at the same offset from the surface |
| `foreground` | `--e-ink` | `--e-muted`: ink softened toward the surface until it holds 7:1 (never below 4.5). `--e-border` at 3.4:1 and `--e-border-strong` at 4.5:1 on the surface. The focus ring and the hover and press washes follow ink |

When the surface is dark (relative luminance under 0.179), `defineTheme` also switches the filled action colours (`primary`, `secondary`, `danger`) to light variants with black `on-*` text, lifts the warning text, and darkens the scrim and wells, so every contrast pair still holds. A surface without a foreground picks black or white for you.

```ts
const midnight = defineTheme({
  name: "midnight",
  brand: "#4aa3df",
  accent: "#6fd18a",
  background: "#0a0e11",
  surface: "#0f1418",
  foreground: "#ffffff",
});

midnight.issues; // []
```

The [playground](/playground) has these three as its Ground colours, with Light, Paper, Dark and Contrast as presets.

## Light and dark

Set `scheme: "auto"` and the theme follows the visitor's `prefers-color-scheme`. The base tokens are the light theme. The dark variant is derived the same way, so its contrast is checked too, and only the tokens that differ are written inside `@media (prefers-color-scheme: dark)`. `color-scheme` becomes `light dark`, so native controls follow. Nothing to wire up: `createEos()` applies it and repaints when the preference changes.

```ts
const clinic = defineTheme({
  brand: "#8a2be2",
  scheme: "auto",
  dark: { surface: "#0e1117", brand: "#c9a0ff" }, // optional: what changes on a dark page
});

clinic.issues; // light and dark are both checked
clinic.alternates; // [{ media: "(prefers-color-scheme: dark)", scheme: "dark", tokens: { ... } }]
```

`dark` takes the same inputs as the theme, minus `name`, `scheme`, `dark` and `strict`. Anything it leaves out is inherited, except the grounds (`background`, `surface`, `foreground`): a light ground makes no sense on a dark page, so give the dark variant the ones it needs, or leave `dark` out for a near-black surface.

`contrast: "auto"` works the same way for `prefers-contrast: more`, and the two combine. `theme.alternates` lists every variant in cascade order, the last match wins. On the server, `theme.css()` writes the media queries, so the first paint is already right.

To let people choose "system", "light" or "dark" themselves, use a fixed theme per choice instead of `scheme: "auto"`. A fixed theme with a dark `surface` is a dark theme: `defineTheme` lifts the action colours for it.

```ts
const light = defineTheme({ name: "light" });
const dark = defineTheme({ name: "dark", background: "#0a0e11", surface: "#0f1418", foreground: "#ffffff" });
```

Save only "light" and "dark", so no saved value means follow the system. To avoid a flash of the wrong theme, set the scheme before the first paint with a small script in `<head>`, and render the dark tokens under the attribute it sets. This site does it that way (`docs/.vitepress/scheme.ts` and `theme/site-theme.ts` in the [repository](https://github.com/Dame-G/eos-site)).

```html
<script>
  (function () {
    try {
      var saved = localStorage.getItem("my-scheme");
      var dark = saved === "dark" || (saved !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.dataset.scheme = dark ? "dark" : "light";
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    } catch (e) {}
  })();
</script>
<style>
  /* dark.css({ selector: ':root[data-scheme="dark"]', layer: false }) */
</style>
```

`layer: false` writes the tokens outside `@layer e.tokens`, so they win over the library's default tokens wherever the style sits in the head.

Once the app has mounted, apply the theme that matches and keep it up to date. `apply()` sets every token inline, so one call replaces the other theme completely.

```ts
function paint(isDark: boolean) {
  (isDark ? dark : light).apply(document.documentElement);
  document.documentElement.dataset.scheme = isDark ? "dark" : "light";
}

const query = matchMedia("(prefers-color-scheme: dark)");
query.addEventListener("change", (e) => {
  if (!localStorage.getItem("my-scheme")) paint(e.matches);
});

function choose(choice: "system" | "light" | "dark") {
  if (choice === "system") localStorage.removeItem("my-scheme");
  else localStorage.setItem("my-scheme", choice);
  paint(choice === "dark" || (choice === "system" && query.matches));
}
```

Wrap `localStorage` in `try` as the script does, since storage can be blocked. Both themes should have an empty `issues` list.

## Plain CSS

Library CSS is layered, so your unlayered CSS wins with no extra specificity. For Tailwind and other frameworks, see [Tailwind and CSS](/guide/tailwind-and-css).

```css
:root {
  --e-primary: #0b4f6c;
  --e-radius-md: 12px;
}
```

To use the default tokens without JavaScript, import `@eos-ui/tokens/tokens.css` (the light theme, with `prefers-contrast: more` handled) or `@eos-ui/tokens/tokens.auto.css`, which also follows `prefers-color-scheme`. Use the auto file only when your page ground follows the scheme as well: it makes every component dark under a dark operating system, so a hard-coded white page behind them would look broken.

`theme.css()` generates that block for server rendering. `theme.css({ selector: '[data-e-theme="clinic"]' })` scopes it.

## Scoped themes

Apply a theme to one element with `clinic.apply(el)`, or set variables on any wrapper:

```html
<section data-e-theme="clinic" class="e-root" style="--e-primary: #8a2be2">...</section>
```

Menus, dialogs, tooltips and toasts render in `body`, outside the wrapper. Set two options together: `themeTarget` is the element that gets the tokens, and `portalTarget` is where floating parts render. Point `portalTarget` at the same element (or inside it), or they leave the scope and fall back to the page theme.

```ts
createEos({ theme: clinic, themeTarget: el, portalTarget: el }); // portalTarget can also be a selector such as "#portal"
```

On the server, give `themeCss(theme, selector)` the same scope.

Every menu, option list and tooltip leaves an empty wrapper in the portal target after it opens. Do not make that element a grid or flex container with a `gap`, or each wrapper adds a gap and the container grows a little every time something opens. Plain block flow (or `display: flow-root`) is safe.

## Cascade layers

From lowest: `e.reset, e.tokens, e.base, e.primitives, e.blocks, e.controls, e.composites, e.containers, e.page`. With another layered framework, declare the order once and early: `@layer framework, e.reset, e.tokens, ...`.
