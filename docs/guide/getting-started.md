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

## Using an AI assistant

The site publishes [`/llms.txt`](/llms.txt), an index of every component. The library ships the complete documentation in one file as `@eos-ui/vue/llms-full.txt` (in `node_modules/@eos-ui/vue/dist/llms-full.txt`), which you can hand to an AI coding assistant so it writes correct props and slots.

## Next

[Theming](/guide/theming), [Composables](/guide/composables), [Components](/components/), [Patterns](/patterns/).
