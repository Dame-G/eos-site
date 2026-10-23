---
title: Getting started
description: "Install EOS, import the stylesheet, add the plugin and build a working form in three steps."
---

<script setup>
import FirstForm from "./examples/FirstForm.vue";
</script>

# Getting started

Needs Vue 3.5+, Node 22+ and a bundler that handles CSS, such as Vite. EOS is ESM only: use `import`, not `require`.

## 1. Install

```bash
npm install @eos-ui/vue
```

## 2. Import the stylesheet

```ts
// main.ts
import { createApp } from "vue";
import "@eos-ui/vue/style.css";
import App from "./App.vue";

createApp(App).mount("#app");
```

`@eos-ui/vue/style.css` is required. It holds every component's styles and the default theme, so a component without it renders unstyled. This is true with or without the plugin.

## 3. Add the plugin and render a component

In the same `main.ts`, install the plugin before mounting:

```ts
import { createEos } from "@eos-ui/vue";

createApp(App).use(createEos()).mount("#app");
```

`createEos()` holds your language, currency, words, icons and theme. Toasts (`useToast()`), the locale of dates and amounts, and your theme all need it, so install it in every app. A single component draws without it, in English and US dollars with the default theme.

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

Set `<html lang>` yourself on the server. In the browser `createEos({ locale })` sets `lang` and `dir` for you.

## A working form

Put it together: a form that checks its field, shows an error beside it, and confirms with a toast. Try it with the field empty, then with a real address.

<div class="pattern-stage">
  <FirstForm />
</div>

<<< @/guide/examples/FirstForm.vue

- `@submit.prevent` stops the page reload, and `novalidate` lets your messages show in place of the browser's.
- `error` replaces the hint, turns the edge red and is announced. It stays `undefined` until the first submit.
- `EToastProvider` is where toasts appear, and `useToast()` works because step 3 installed `createEos()`.
- More: [Forms and validation](/guide/forms) for errors, labels and your own controls, and [Settings page](/patterns/settings) for a whole form.

## Next

Language, currency and theme are options of `createEos()`:

```ts
createApp(App)
  .use(createEos({ locale: "en-CA", currency: "CAD", theme: { brand: "#2c95b4" } }))
  .mount("#app");
```

See [Theming](/guide/theming), [Words and language](/guide/language) and the [API reference](/guide/api) for every option. [Install options](/guide/install) covers self-hosted fonts, auto-import, TypeScript, Nuxt and `llms.txt`.

Then: [Which component?](/guide/choosing), [Composing layouts](/guide/layouts), [Forms and validation](/guide/forms), [Components](/components/), [Patterns](/patterns/).
