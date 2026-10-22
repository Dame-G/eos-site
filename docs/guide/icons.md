---
title: Icons
description: "Use the built-in icons, or bring Lucide, Tabler, Heroicons, Phosphor, Iconify or your own."
---

# Icons

Eos ships a built-in set (Phosphor, MIT), so everything works with no setup. Components draw icons by name, and an `icon` prop also takes an icon component.

```vue
<EButton icon="lock">Pay $162.40</EButton>
<EIcon name="receipt" />
<EButton :icon="CreditCard">Pay now</EButton>
```

## Your own set

Adapters from `@eos-ui/vue/icons` turn an icon library into an `icons` config. Anything missing falls back to the built-in icon.

```ts
import { createEos } from "@eos-ui/vue";
import { lucide } from "@eos-ui/vue/icons";
import { Check, X, CreditCard, TriangleAlert } from "lucide-vue-next";

createEos({ icons: lucide({ Check, X, CreditCard, TriangleAlert }) });
```

| Library | Adapter |
| --- | --- |
| Lucide | `lucide(icons)` |
| Tabler | `tabler(icons)` |
| Heroicons | `heroicons(outline)` |
| Phosphor (Vue) | `phosphorVue(ph)` |
| Iconify | `iconify("lucide")` from `@eos-ui/vue/icons/iconify`, needs `@iconify/vue` |

List the icons you use: only those ship. `import * as` keeps the whole library in your bundle. Every adapter takes `{ aliases, builtin }`: `aliases` renames Eos names (`{ card: "wallet-cards" }`), `builtin: false` turns off the fallback. `iconNames` lists the names components ask for.

## Custom resolver

```ts
import { defineIcons } from "@eos-ui/vue/icons";

createEos({
  icons: defineIcons({
    icons: { card: "<svg viewBox='0 0 24 24'>...</svg>" },
    aliases: { alert: "warning" },
    resolve: (name, { bold }) => (name === "logo" ? MyIcon : undefined),
  }),
});
```

A name resolves to the first match of: a component passed directly, `icons[name]`, `resolve()`, the built-in icon. If none match, nothing is drawn and development logs a warning. A source is a component, an `<svg>` string, or a `[regular, bold]` pair of paths in a 256 box.

Icons never carry meaning alone, so a different or missing icon hides nothing.
