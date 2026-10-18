---
layout: home
title: Eos
description: "Accessible Vue 3 components with a token-based theme system. Calm, high contrast and rebrandable with a few lines."
---

## Install

```bash
npm install @eos-ui/vue
```

Add the plugin and the styles once:

```ts
import { createApp } from "vue";
import { createEos } from "@eos-ui/vue";
import "@eos-ui/vue/style.css";
import "@eos-ui/vue/fonts.css";

createApp(App).use(createEos({ theme: { brand: "#2c95b4" } })).mount("#app");
```

## Make it yours

One colour in `theme` rebrands every component, and the contrast is checked for you. This is a real form.

<HomeDemo />
