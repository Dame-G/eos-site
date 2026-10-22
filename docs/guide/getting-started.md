---
title: Getting started
description: "Install Eos, add the plugin and draw your first component."
---

# Getting started

Needs Vue 3.5+ and a bundler that handles CSS, such as Vite.

```bash
npm install @eos-ui/vue
```

```ts
// main.ts
import { createApp } from "vue";
import { createEos } from "@eos-ui/vue";
import "@eos-ui/vue/style.css";
import "@eos-ui/vue/fonts.css"; // optional: Bricolage Grotesque and Geist Mono from Google Fonts
import App from "./App.vue";

createApp(App)
  .use(createEos({ locale: "en-CA", currency: "CAD", theme: { brand: "#2c95b4" } }))
  .mount("#app");
```

The plugin holds your language, currency, words, icons and theme. Components also work without it, in English and US dollars. Set `<html lang>` yourself. Eos never does.

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

- The main value is `v-model`. Leave it off and the component keeps its own state.
- Every field needs a `label`, and takes `hint` and `error`.
- Native attributes (`name`, `autocomplete`, `aria-*`) land on the real input. `class` and `style` land on the wrapper.

## Fonts

`@eos-ui/vue/fonts.css` is one `@import` of Bricolage Grotesque and Geist Mono from `fonts.googleapis.com`. Importing it makes your visitors' browsers contact Google. The font files come from Google's servers too.

To serve the fonts yourself, skip `fonts.css` and install them from [Fontsource](https://fontsource.org). Their variable fonts register the families as "Bricolage Grotesque Variable" and "Geist Mono Variable", so pass those names to the theme:

```bash
npm install @fontsource-variable/bricolage-grotesque @fontsource-variable/geist-mono
```

```ts
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/geist-mono";

createApp(App).use(
  createEos({
    theme: {
      fonts: {
        sans: '"Bricolage Grotesque Variable", "Avenir Next", system-ui, sans-serif',
        mono: '"Geist Mono Variable", ui-monospace, Menlo, Consolas, monospace',
      },
    },
  }),
);
```

`fonts.sans` and `fonts.mono` are full CSS `font-family` stacks and set `--e-font-sans` and `--e-font-mono`. They work with any font you load, so the same option brings in a different family. Eos never bundles fonts. Without any font loaded, the stack falls back to `system-ui`.

## Auto-import

With [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components):

```ts
// vite.config.ts
import Components from "unplugin-vue-components/vite";
import { EosResolver } from "@eos-ui/vue/resolver";

export default {
  plugins: [Components({ resolvers: [EosResolver()] })],
};
```

## TypeScript

Eos ships its own types, so there is nothing to install. Props, events and slots are typed in templates when you use Volar. unplugin-vue-components writes the global `components.d.ts` for auto-imported components (its `dts` option, on by default when TypeScript is installed), so commit it or add it to your `tsconfig` includes.

## Using an AI assistant

The site publishes [`/llms.txt`](/llms.txt), an index of every component, and the complete documentation in one file at [`/llms-full.txt`](/llms-full.txt). Hand either to an AI coding assistant so it writes correct props and slots. The same files ship in the package as `@eos-ui/vue/llms.txt` and `@eos-ui/vue/llms-full.txt`.

## Next

[Theming](/guide/theming), [Composables](/guide/composables), [Components](/components/), [Patterns](/patterns/).
