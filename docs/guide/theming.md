---
title: Theming
description: "Rebrand Eos with defineTheme, plain CSS variables or a scoped theme."
---

# Theming

A theme is a set of CSS custom properties named `--e-*`. You can build one with `defineTheme()`, which also checks contrast, or override the variables in plain CSS. To try values live, use the [playground](/playground). Every token is listed on the [tokens page](/tokens).

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

You can also pass the same options straight to the plugin: `createEos({ theme: { brand: "#8a2be2" } })`.

| Option | What it does |
| --- | --- |
| `name` | Becomes the value of `data-e-theme` when the theme is applied to an element. |
| `brand` | Your brand colour. The deep action colour (`--e-primary`) is derived from it so white text on it reaches 7:1, and the tinted ground follows. |
| `accent` | A second colour for positive actions (`--e-secondary`), derived the same way. |
| `fonts` | `{ sans, mono }` font stacks. Fonts are never bundled. |
| `radius` | `"sharp"`, `"default"`, `"round"`, or `{ sm, md, lg }`. |
| `tokens` | Any other token by name. These win over everything derived, and are not corrected. |
| `strict` | Throw on a contrast failure instead of listing it in `issues`. |

The brand colour is for decoration (`--e-brand-blue`). Text and fills use the derived action colour, because a logo colour rarely reaches the contrast a button label needs. That is why a pale brand colour still gives a readable button.

### Contrast checks

`theme.issues` lists every promised pair that fails, with the role, the two tokens, the ratio and the minimum. In development the plugin also writes failures to the console; turn that off with `warnOnContrast: false`. Use `strict: true` in a test to fail the build instead.

```ts
const bad = defineTheme({ tokens: { muted: "#bbbbbb" } });
bad.issues[0];
// { role: "Secondary text", pair: ["muted", "surface"], ratio: 1.9, min: 4.5 }
```

The table of promised pairs is on the [Accessibility](/guide/accessibility#contrast) page.

## Plain CSS variables

Override variables in any stylesheet. It wins because the library is layered:

```css
:root {
  --e-primary: #0b4f6c;
  --e-radius-md: 12px;
}
```

You can generate that block from a theme with `theme.css()`, which is also how to put the theme into the `<head>` on the server:

```ts
const css = clinic.css(); // @layer e.tokens { :root { --e-primary: ... } }
const scoped = clinic.css({ selector: '[data-e-theme="clinic"]' });
```

## Scoped themes

Apply a theme to one part of the page. Each theme sets its variables on an element and marks it with `data-e-theme`:

```ts
const el = document.querySelector("#portal");
clinic.apply(el); // sets the variables inline and data-e-theme="clinic"
```

Or write the variables yourself on any wrapper:

```html
<section data-e-theme="clinic" class="e-root" style="--e-primary: #8a2be2">...</section>
```

Anything inside the wrapper follows it. The hover and press washes are recomputed from the wrapper's own ink colour.

### portalTarget

Menus, option lists, dialogs, tooltips and toasts render outside their parent, in `body` by default. A scoped theme does not reach them there. Tell the plugin to render them inside the themed element:

```ts
const eos = createEos({ theme: clinic, themeTarget: el });
eos.config.portalTarget = el; // or a selector such as "#portal"
```

`portalTarget` is reactive, so you can set it after the element exists. The [playground](/playground) does exactly this: its preview is a scoped theme with its own portal target, and its select list opens inside the preview.

## Cascade layers

All library CSS lives in layers named `e.*`, in this order, lowest first:

```
e.reset, e.tokens, e.base, e.primitives, e.blocks, e.controls, e.composites, e.containers, e.account, e.page
```

Two consequences:

- Your unlayered CSS beats all of it, whatever the specificity. A single class is enough to change a component.
- If you use another CSS framework with its own layers, declare the order once, early, with Eos where you want it: `@layer framework, e.reset, e.tokens, ...`. This site puts the VitePress theme into `e.reset`, the lowest Eos layer, to keep it below the components.

The design rules (spacing rhythm, where depth is allowed, one control height) are not options. They are what makes every theme feel like the same system. See [Design principles](/guide/design-principles).
