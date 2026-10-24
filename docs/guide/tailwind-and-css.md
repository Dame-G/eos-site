---
title: Tailwind and CSS
description: "How eos CSS layers sit with Tailwind and your own CSS, and how to override a component."
---

<script setup>
import Interop from "./examples/Interop.vue";
</script>

# Tailwind and CSS

All eos rules sit inside `@layer e.*`. CSS outside any layer beats every layered rule, whatever its specificity. So your own classes win over eos with no `!important`, as long as they are not in a lower layer than eos.

<div class="pattern-stage">
  <Interop />
</div>

```vue
<EButton class="wide-pill">Overridden by a class</EButton>
```

```css
.wide-pill {
  border-radius: 999px;
}
```

`class` and `style` land on the component's wrapper element. Other attributes go to the real control.

## Layer order

From lowest to highest:

```css
@layer e.reset, e.tokens, e.base, e.primitives, e.blocks, e.controls, e.composites, e.containers, e.page;
```

A layer that is declared later wins. Unlayered CSS wins over all of them. The order is fixed by the first time the browser meets each layer name, so with another layered framework, declare the whole order once, before both stylesheets. List the layers that should lose to eos first:

```css
@layer framework, e.reset, e.tokens, e.base, e.primitives, e.blocks, e.controls, e.composites, e.containers, e.page;
```

Here `framework` loses to every eos layer.

## Tailwind

Tailwind 4 puts its own CSS in layers (`theme`, `base`, `components`, `utilities`). Tailwind's preflight lives in `base`, and utilities in `utilities`. To have utilities win over eos, declare `utilities` after the `e.*` layers:

```css
/* app.css, imported before anything else */
@layer theme, base, e.reset, e.tokens, e.base, e.primitives, e.blocks, e.controls, e.composites, e.containers, e.page, components, utilities;

@import "tailwindcss";
@import "@eos-ui/vue/style.css";
```

Now `class="rounded-full px-8"` on an `EButton` works, and eos beats preflight, which is what you want: preflight would otherwise reset eos's inputs and headings.

Check the order in the browser's DevTools (the Layers section of Styles). If a utility does not apply, the layer order is the first thing to look at.

## Tokens instead of overrides

When you want every button rounder or every surface a different colour, change a token, not a class. See [Theming](/guide/theming) and the [Token reference](/guide/tokens).

```css
:root {
  --e-radius-md: 12px;
}
```

## Rules of thumb

- Do not reach into a component's inner classes (`.e-button-icon`). They are not part of the API and may change. Props, slots, tokens and the wrapper `class` are.
- Do not write `!important` to beat eos. If you need to, the layer order is wrong.
- Scope a theme to part of the page with `themeTarget` and point `portalTarget` at the same element, so menus and dialogs inherit it.
