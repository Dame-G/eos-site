---
title: Theming
description: "Rebrand Eos with defineTheme, plain CSS variables or a scoped theme."
---

# Theming

A theme is a set of CSS custom properties named `--e-*`. Build one with `defineTheme()`, which also checks contrast, or override the variables in plain CSS. Try values in the [playground](/playground). Every token is on the [tokens page](/tokens).

## defineTheme

```ts
import { createEos, defineTheme } from "@eos-ui/vue";

const clinic = defineTheme({
  name: "clinic",
  brand: "#8a2be2",
  accent: "#2e7d32",
  fonts: { sans: "Inter, system-ui, sans-serif" },
  radius: "round",
});

clinic.issues; // [] when every promised contrast pair holds

app.use(createEos({ theme: clinic }));
```

The plugin also takes the options directly: `createEos({ theme: { brand: "#8a2be2" } })`.

| Option   | What it does                                                                                                         |
| -------- | -------------------------------------------------------------------------------------------------------------------- |
| `name`   | The value of `data-e-theme` when the theme is applied to an element.                                                 |
| `brand`  | Your brand colour. `--e-primary` is derived from it so white text on it reaches 7:1, and the tinted ground follows.  |
| `accent` | A second colour for positive actions (`--e-secondary`), derived the same way.                                        |
| `fonts`  | `{ sans, mono }` stacks. Fonts are never bundled.                                                                    |
| `radius` | `"sharp"`, `"default"`, `"round"`, or `{ sm, md, lg }`.                                                              |
| `tokens` | Any other token by name. These win over everything derived and are not corrected.                                    |
| `strict` | Throw on a contrast failure instead of listing it in `issues`.                                                       |

The brand colour is decoration (`--e-brand-blue`). Text and fills use the derived action colour, so even a pale brand colour gives a readable button.

### Contrast checks

`theme.issues` lists each failing pair with its role, the two tokens, the ratio and the minimum. In development the plugin also logs failures; turn that off with `warnOnContrast: false`. Use `strict: true` in a test to fail the build.

```ts
const bad = defineTheme({ tokens: { muted: "#bbbbbb" } });
bad.issues[0];
// { role: "Secondary text", pair: ["muted", "surface"], ratio: 1.9, min: 4.5 }
```

The pairs are listed under [Accessibility](/guide/accessibility#contrast).

## Plain CSS

Override variables in any stylesheet. It wins because the library is layered:

```css
:root {
  --e-primary: #0b4f6c;
  --e-radius-md: 12px;
}
```

`theme.css()` generates that block, which is also how to put a theme in the `<head>` on the server:

```ts
const css = clinic.css(); // @layer e.tokens { :root { --e-primary: ... } }
const scoped = clinic.css({ selector: '[data-e-theme="clinic"]' });
```

## Scoped themes

Apply a theme to one part of the page. It sets its variables on an element and marks it with `data-e-theme`:

```ts
clinic.apply(document.querySelector("#portal"));
```

Or write the variables on any wrapper:

```html
<section data-e-theme="clinic" class="e-root" style="--e-primary: #8a2be2">...</section>
```

Everything inside follows it. Hover and press washes are recomputed from the wrapper's own ink colour.

### portalTarget

Menus, option lists, dialogs, tooltips and toasts render outside their parent, in `body` by default, so a scoped theme does not reach them. Render them inside the themed element instead:

```ts
const eos = createEos({ theme: clinic, themeTarget: el });
eos.config.portalTarget = el; // or a selector such as "#portal"
```

`portalTarget` is reactive, so you can set it once the element exists. The [playground](/playground) does this: its preview is a scoped theme with its own portal target.

## Cascade layers

All library CSS lives in layers named `e.*`, lowest first:

```
e.reset, e.tokens, e.base, e.primitives, e.blocks, e.controls, e.composites, e.containers, e.account, e.page
```

- Your unlayered CSS beats all of it. One class is enough to change a component.
- With another framework that has layers, declare the order once and early, with Eos where you want it: `@layer framework, e.reset, e.tokens, ...`. This site puts the VitePress theme in `e.reset`, below the components.

Spacing rhythm, where depth is allowed and the one control height are not options. They make every theme feel like the same system. See [Design principles](/guide/design-principles).
