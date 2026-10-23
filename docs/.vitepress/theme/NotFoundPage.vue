<script setup lang="ts">
import { EActions, EButton, EEmptyState, EKbd, EKicker, ELink } from "@eos-ui/vue";

defineEmits<{ search: [] }>();

const POPULAR = [
  { href: "/guide/getting-started", label: "Getting started" },
  { href: "/components/", label: "All components" },
  { href: "/components/Button", label: "EButton" },
  { href: "/guide/theming", label: "Theming" },
  { href: "/playground", label: "Theme playground" },
  { href: "/changelog", label: "Changelog" },
];
</script>

<template>
  <div class="not-found">
    <EEmptyState title="We could not find that page" icon="search" :heading-level="1">
      The address may have changed, or it was never written. Search for what you wanted, or start from one of these.
      <template #action>
        <EActions>
          <EButton icon="search" @click="$emit('search')">Search the docs <EKbd small class="not-found-key">/</EKbd></EButton>
          <EButton variant="outline" href="/">Back to the home page</EButton>
        </EActions>
      </template>
    </EEmptyState>
    <section aria-labelledby="not-found-popular" class="not-found-popular">
      <EKicker id="not-found-popular">Popular pages</EKicker>
      <ul class="not-found-links">
        <li v-for="l in POPULAR" :key="l.href"><ELink :href="l.href">{{ l.label }}</ELink></li>
      </ul>
    </section>
  </div>
</template>
