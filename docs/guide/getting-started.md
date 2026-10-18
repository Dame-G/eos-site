---
title: Getting started
description: "Install Eos, add the plugin, draw your first component and set up auto-import."
---

# Getting started

Eos is a set of Vue 3 components and a theme system. You need Vue 3.5 or newer and a bundler that handles CSS imports, such as Vite.

## Install

```bash
npm install @eos-ui/vue
```

`@eos-ui/tokens` (the design tokens and `defineTheme()`) comes with it. Install it yourself only if you want the tokens without the components.

## Add the plugin

The plugin holds your language, currency, words and icons, and applies your theme. Every component also works without it, using English and US dollars, so you can add it later.

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

`fonts.css` is optional. It loads Jost and Spline Sans Mono from Google Fonts. To self-host, install `@fontsource/jost` and `@fontsource/spline-sans-mono` instead, or set other families in your [theme](/guide/theming).

::: tip The app owns `lang`
Eos does not set the `lang` attribute on your page. Set `<html lang="en-CA">` yourself, next to the `locale` you give the plugin.
:::

## Your first component

The one stylesheet you imported in `main.ts` (about 17 kB gzipped) styles every component.

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

Try the same thing here:

<HomeDemo />

A few habits you will see everywhere:

- The main value is `v-model`. Leave it off and the component keeps its own state.
- A label is always required. It is a real label, never only a placeholder.
- A field takes `hint` and `error` as props. An error replaces the hint and is announced.
- Native attributes (`name`, `autocomplete`, `aria-*`) land on the real `<input>`. `class` and `style` land on the wrapper.

## Auto-import in Vite

With [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components), `<EButton>` in a template can import itself:

```ts
// vite.config.ts
import Components from "unplugin-vue-components/vite";
import { EosResolver } from "@eos-ui/vue/resolver";

export default {
  plugins: [Components({ resolvers: [EosResolver()] })],
};
```

Pass `EosResolver({ from: "your-wrapper" })` to import from a package of your own that re-exports Eos.

::: warning Check the resolver version you have
The resolver in the library checkout this site was built against matches names that start with `Op`, not `E`. If `<EButton>` is not found, import the component by name as shown above until that is fixed.
:::

## Styles and layers

Everything sits in the cascade layers `e.reset, e.tokens, e.base, e.primitives, e.blocks, e.controls, e.composites, e.containers, e.account, e.page`. Unlayered CSS always beats layered CSS, so your own rules win without raising specificity. See [Theming](/guide/theming#cascade-layers).

## Where to go next

- [Theming](/guide/theming): make it yours.
- [Components](/components/): every component with a live demo.
- [Patterns](/patterns/): six whole pages built only from Eos components.
