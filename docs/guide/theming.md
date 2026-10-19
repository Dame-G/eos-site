---
title: Theming
description: "Rebrand Eos with defineTheme, plain CSS variables or a scoped theme."
---

# Theming

A theme is a set of `--e-*` CSS variables ([all tokens](/tokens)). Build one with `defineTheme()`, which also checks contrast, or override the variables in CSS. Try values in the [playground](/playground).

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

`defineTheme()` takes 15 inputs and emits every token. Any token can also be set by name in `tokens`, which wins over everything derived.

| Input | Derives |
| --- | --- |
| `brand`, `accent` | `primary`, `secondary`, their tints and `surface-tint` |
| `danger`, `warning` | `danger`, `on-danger`, `danger-soft`; `warning-strong`, `warning-soft` |
| `background`, `surface`, `foreground` | the grounds, `ink`, `muted`, `border`, `border-strong`; a dark surface lifts the action colours |
| `fonts`, `radius` | `font-sans`, `font-mono`; `radius-sm` to `radius-lg` |
| `textScale`, `spaceScale` | `text-xs` to `text-4xl`; `space-1` to `space-8` (1 is the default) |
| `strokes` `{ hair, focus }` | `stroke-hair`, `stroke-edge`, `stroke-focus`, `focus-gap`, `focus-gap-field` |
| `motion` `"default" \| "snappy" \| "gentle" \| "none"` | `duration-tap`, `duration-move`, `easing-out` |
| `elevation` `"outline" \| "lifted" \| "bold"` | `edge`, `well`, `float`; shadow tint follows `background` |
| `controlHeight` | `control-height`, `chip-height` |

Three more options are not inputs. `name` is the value of `data-e-theme` when the theme is applied to an element. `tokens` sets any token by name, wins over derived values and is not contrast-corrected. `strict` throws on a contrast failure instead of listing it in `issues`. The [tokens page](/tokens) lists each token with the input it follows.

## One example per family

```ts
defineTheme({ brand: "#8a2be2", accent: "#2e7d32", danger: "#b3261e" }); // colour
defineTheme({ radius: "round", elevation: "lifted", strokes: { hair: 1, focus: 3 } }); // shape
defineTheme({ fonts: { sans: "Inter, system-ui, sans-serif" }, textScale: 1.1 }); // type
defineTheme({ spaceScale: 1.25, controlHeight: 56 }); // space
defineTheme({ motion: "snappy" }); // motion
defineTheme({ tokens: { "radius-md": "12px", "z-modal": "60" } }); // any other token
```

`theme.issues` lists each failing pair: `{ role, pair, ratio, min }`. `createEos` also logs them outside production; `warnOnContrast: false` turns that off. The pairs are under [Accessibility](/guide/accessibility#contrast).

## Background, surface and foreground

Three colours set the neutrals. Everything else follows from them.

| Input | Token it sets | What it derives |
| --- | --- | --- |
| `background` | `--e-background`, painted by `EAppShell` | The tint of shadows. Checked against ink, muted text, primary and the border |
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

From lowest: `e.reset, e.tokens, e.base, e.primitives, e.blocks, e.controls, e.composites, e.containers, e.account, e.page`. With another layered framework, declare the order once and early: `@layer framework, e.reset, e.tokens, ...`.
