---
title: Theming
description: "Rebrand Eos with defineTheme, plain CSS variables or a scoped theme."
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

`defineTheme()` takes 16 inputs and emits every token. Any token can also be set by name in `tokens`, which wins over everything derived.

| Input | Derives |
| --- | --- |
| `brand`, `accent` | `primary`, `secondary`, their tints and `surface-tint` |
| `danger`, `warning` | `danger`, `on-danger`, `danger-soft`, `warning-strong`, `warning-soft` |
| `background`, `surface`, `foreground` | the grounds, `ink`, `muted`, `border` and `border-strong`. A dark surface lifts the action colours |
| `fonts`, `radius` | `font-sans`, `font-mono`, and `radius-sm` to `radius-lg` |
| `textScale`, `spaceScale` | `text-xs` to `text-4xl`, and `space-1` to `space-8` (1 is the default) |
| `strokes` `{ hair, focus, edge, card }` | `stroke-hair`, `stroke-card`, `stroke-edge`, `stroke-focus`, `focus-gap` (`focus-gap-field` follows `stroke-edge`). `edge` and `card` set their token outright. Without them `edge` is 1.5 times `hair` and `card` is `hair` (2px on a bold elevation) |
| `contrast` `"standard" \| "high"` | With `high`, `border` and `border-strong` become `ink`, `muted` holds 15:1, `surface-tint` is neutral grey and `scrim` is darker |
| `motion` `"default" \| "snappy" \| "gentle" \| "none"` | `duration-tap`, `duration-move`, `easing-out` |
| `elevation` `"outline" \| "lifted" \| "bold"` | `edge`, `well` and `float`. The shadow tint follows `background` |
| `controlHeight` | `control-height`, `chip-height` |

Three more options are not inputs. `name` is the value of `data-e-theme` when the theme is applied to an element. `tokens` sets any token by name, wins over derived values and is not contrast-corrected. `strict` throws on a contrast failure instead of listing it in `issues`. The [token reference](/guide/tokens) lists each token with the input it follows.

## One example per family

```ts
defineTheme({ brand: "#8a2be2", accent: "#2e7d32", danger: "#b3261e" }); // colour
defineTheme({ radius: "round", elevation: "lifted", strokes: { hair: 1, focus: 3 } }); // shape
defineTheme({ contrast: "high", elevation: "bold", strokes: { hair: 2, edge: 2 } }); // high contrast
defineTheme({ fonts: { sans: "Inter, system-ui, sans-serif" }, textScale: 1.1 }); // type
defineTheme({ spaceScale: 1.25, controlHeight: 56 }); // space
defineTheme({ motion: "snappy" }); // motion
defineTheme({ tokens: { "radius-md": "12px", "z-modal": "60" } }); // any other token
```

`theme.issues` lists each failing pair: `{ role, pair, ratio, min }`. `createEos` also logs them outside production, and `warnOnContrast: false` turns that off. The pairs are under [Accessibility](/guide/accessibility#contrast).

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

Eos has no dark mode switch. A theme is one set of tokens, and a dark theme is a theme with a dark surface. Build both and swap them. This is how this site does it (`docs/.vitepress/scheme.ts` and `theme/site-theme.ts` in the [repository](https://github.com/Dame-G/eos-site)).

```ts
const light = defineTheme({ name: "light" });
const dark = defineTheme({ name: "dark", background: "#0a0e11", surface: "#0f1418", foreground: "#ffffff" });
```

Give the page three choices, "system", "light" and "dark". Save only "light" and "dark", so no saved value means follow the system, and read `prefers-color-scheme` for that case.

To avoid a flash of the wrong theme, set the scheme before the first paint. Put a small script in `<head>` and render the dark tokens under the attribute it sets:

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

`layer: false` writes the tokens outside `@layer e.tokens`, so they win over the library's default tokens wherever the style sits in the head. Without a saved choice or a dark system, the default light tokens apply.

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

Wrap `localStorage` in `try` as the script does, since storage can be blocked. Both themes should have an empty `issues` list. `defineTheme` switches the action colours for a dark surface, so the pairs still hold.

## Plain CSS

Library CSS is layered, so your unlayered CSS wins with no extra specificity.

```css
:root {
  --e-primary: #0b4f6c;
  --e-radius-md: 12px;
}
```

`theme.css()` generates that block for server rendering. `theme.css({ selector: '[data-e-theme="clinic"]' })` scopes it.

## Scoped themes

Apply a theme to one element with `clinic.apply(el)`, or set variables on any wrapper:

```html
<section data-e-theme="clinic" class="e-root" style="--e-primary: #8a2be2">...</section>
```

Menus, dialogs, tooltips and toasts render in `body`, outside the wrapper. Point them inside it:

```ts
const eos = createEos({ theme: clinic, themeTarget: el });
eos.config.portalTarget = el; // or a selector such as "#portal"
```

## Cascade layers

From lowest: `e.reset, e.tokens, e.base, e.primitives, e.blocks, e.controls, e.composites, e.containers, e.page`. With another layered framework, declare the order once and early: `@layer framework, e.reset, e.tokens, ...`.
