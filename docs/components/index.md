---
title: Components
description: "Every EOS component with its props and a live demo, grouped by layer."
---

<script setup>
import { EGrid, ESurface, EText } from "@eos-ui/vue";
import { data } from "../data/components.data.js";
</script>

# Components

Grouped by layer. A component only uses components from its own layer or an earlier one.

<template v-for="g in data" :key="g.id">
  <h2 :id="g.id">{{ g.title }}</h2>
  <EGrid as="ul" min="17rem" :gap="3" class="eos-live component-list">
    <ESurface v-for="c in g.items" :key="c.name" as="li" pad="sm" class="component-card">
      <a :href="`/components/${c.name}`" class="component-card-link">E{{ c.name }}</a>
      <EText small muted>{{ c.summary }}</EText>
    </ESurface>
  </EGrid>
</template>
