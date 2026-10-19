---
title: Components
description: "Every Eos component with its props and a live demo, grouped by layer."
---

<script setup>
import { EGrid, ELinkCard } from "@eos-ui/vue";
import { data } from "../data/components.data.js";
</script>

# Components

Grouped by layer. A component only uses components from its own layer or an earlier one.

<template v-for="g in data" :key="g.id">
  <h2 :id="g.id">{{ g.title }}</h2>
  <EGrid as="ul" min="17rem" :gap="3" class="eos-live component-list">
    <ELinkCard v-for="c in g.items" :key="c.name" as="li" :href="`/components/${c.name}`" :title="`E${c.name}`" :description="c.summary" />
  </EGrid>
</template>
