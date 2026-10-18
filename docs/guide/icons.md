---
title: Icons
description: "Use the built-in icons, or bring Lucide, Tabler, Heroicons, Phosphor, Iconify or your own."
---

# Icons

Eos ships a small built-in set (Phosphor, MIT) so every component works with no setup. To use your own set, tell `createEos` where to find icons. Anything it cannot find falls back to the built-in icon, so a partial set never leaves a blank.

Every component draws icons by name, through one `EIcon`:

```vue
<EButton icon="lock">Pay $162.40</EButton>
<EIcon name="receipt" />
```

An `icon` prop takes a name, or the icon component itself, one icon at a time:

```vue
<script setup>
import { CreditCard } from "lucide-vue-next";
</script>

<template>
  <EButton :icon="CreditCard">Pay now</EButton>
</template>
```

## How a name is resolved

In this order, first match wins:

1. A component passed directly.
2. `icons[name]`, your explicit map.
3. `resolve(aliases[name] ?? name, { bold })`, your lookup function.
4. The built-in Phosphor icon of that name (skip with `builtin: false`).
5. Nothing is drawn, and one warning is logged in development.

A source can be a Vue component, a complete `<svg>` string, or a `[regular, bold]` pair of path markup in a 256 by 256 box. Small icons in chips and stamps ask for the bold weight when the set has one.

## The names Eos asks for

`iconNames` exports the list the components use. Your set (or `aliases`) should cover these for a consistent look:

```ts
import { iconNames } from "@eos-ui/vue";
```

An icon never carries meaning alone. A stamp's glyph sits beside its word, so an icon that is missing or different never hides information.

## A custom resolver

```ts
import { createEos } from "@eos-ui/vue";
import { defineIcons } from "@eos-ui/vue/icons";
import MyIcon from "./MyIcon.vue";

createEos({
  icons: defineIcons({
    icons: { card: "<svg viewBox='0 0 24 24'>...</svg>" }, // explicit, by name
    aliases: { alert: "warning" }, // rename Eos's names before resolving
    resolve: (name, { bold }) => (name === "logo" ? MyIcon : undefined), // undefined falls through
    builtin: true,
  }),
});
```

## Adapters

Adapters turn a popular icon library into an `icons` config. They live in `@eos-ui/vue/icons`, import nothing, and take the icon library as an argument, so Eos never depends on it.

::: info Adapters are being written
The adapters below are in the library repository and documented in its `src/icons/README.md`. Check the version you install includes the `@eos-ui/vue/icons` entry before you rely on them. Until then, use `defineIcons` or `icons: { ... }` as above.
:::

<!-- ADAPTERS: this section is a drop-in. Replace the table and examples with the final README of @eos-ui/vue/icons once the adapters ship. -->

| Library | Import | Use |
| --- | --- | --- |
| Lucide | `lucide` | `createEos({ icons: lucide({ Check, X, CreditCard }) })` |
| Tabler | `tabler` | `createEos({ icons: tabler(tablerIcons) })` |
| Heroicons | `heroicons` | `createEos({ icons: heroicons(outline) })` |
| Phosphor (Vue) | `phosphorVue` | `createEos({ icons: phosphorVue(ph) })` |
| Iconify | `iconify` from `@eos-ui/vue/icons/iconify` | `createEos({ icons: iconify("lucide") })` |

```ts
import { createEos } from "@eos-ui/vue";
import { lucide } from "@eos-ui/vue/icons";
import { Check, X, CreditCard, TriangleAlert } from "lucide-vue-next";

createEos({ icons: lucide({ Check, X, CreditCard, TriangleAlert }) });
```

An explicit map tree-shakes: only the icons you list ship. `import * as lucide` is shorter, but keeps the whole library in your bundle because icons are looked up by name at run time.

Every adapter takes the same options:

```ts
lucide(icons, {
  aliases: { card: "wallet-cards" }, // your renames win over the built-in table
  builtin: false, // never fall back to the built-in set
});
```

Sets with no close match use the nearest icon. Change any of them with `aliases`.
