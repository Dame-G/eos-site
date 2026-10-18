---
title: Getting started
description: "Install Eos, add the plugin, draw your first component and set up auto-import."
---

# Getting started

Eos needs Vue 3.5 or newer and a bundler that handles CSS imports, such as Vite.

## Install

```bash
npm install @eos-ui/vue
```

`@eos-ui/tokens` comes with it. Install it alone only if you want the tokens without the components.

## Add the plugin

The plugin holds your language, currency, words and icons, and applies your theme. Components also work without it, in English and US dollars.

```ts
// main.ts
import { createApp } from "vue";
import { createEos } from "@eos-ui/vue";
import "@eos-ui/vue/style.css";
import "@eos-ui/vue/fonts.css";
import App from "./App.vue";

createApp(App)
  .use(
    createEos({
      locale: "en-CA",
      currency: "CAD",
      theme: { brand: "#2c95b4" },
    }),
  )
  .mount("#app");
```

`fonts.css` is optional. It loads Jost and Spline Sans Mono from Google Fonts. To self-host, install `@fontsource/jost` and `@fontsource/spline-sans-mono`, or set other families in your [theme](/guide/theming).

::: tip Set `lang` yourself
Eos does not touch the page's `lang`. Set `<html lang="en-CA">` to match `locale`.
:::

## Your first component

The one stylesheet styles every component (about 18 kB gzipped).

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ETextField, EButton } from "@eos-ui/vue";

const email = ref("");
</script>

<template>
  <ETextField v-model="email" label="Email" type="email" required autocomplete="email" />
  <EButton>Continue</EButton>
</template>
```

Habits you will see everywhere:

- The main value is `v-model`. Leave it off and the component keeps its own state.
- A label is always required, and it is a real label.
- Fields take `hint` and `error`. An error replaces the hint and is announced.
- Native attributes (`name`, `autocomplete`, `aria-*`) land on the real `<input>`. `class` and `style` land on the wrapper.

## Auto-import

With [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components), `<EButton>` imports itself:

```ts
// vite.config.ts
import Components from "unplugin-vue-components/vite";
import { EosResolver } from "@eos-ui/vue/resolver";

export default {
  plugins: [Components({ resolvers: [EosResolver()] })],
};
```

Pass `EosResolver({ from: "your-wrapper" })` to import from a package of your own that re-exports Eos.

## Layers

Everything sits in the cascade layers `e.reset, e.tokens, e.base, e.primitives, e.blocks, e.controls, e.composites, e.containers, e.account, e.page`. Unlayered CSS beats layered CSS, so your rules win without extra specificity. See [Theming](/guide/theming#cascade-layers).

## Next

- [Theming](/guide/theming)
- [Components](/components/)
- [Patterns](/patterns/)
