<script setup lang="ts">
import { computed, ref } from "vue";
import { EEmptyState, EGrid, EHighlight, EIcon, EInline, EStack, ESurface, EText, ETextField, iconNames } from "@eos-ui/vue";

// The names come from the library, so the gallery always shows the set the installed version ships.
const query = ref("");
const shown = computed(() => {
  const q = query.value.trim().toLowerCase();
  return q ? iconNames.filter((n) => n.includes(q)) : iconNames;
});
</script>

<template>
  <EStack gap="loose">
    <ETextField v-model="query" label="Filter icons" type="search" :hint="`${iconNames.length} built-in icons`" autocomplete="off" />
    <EGrid v-if="shown.length" as="ul" min="10rem" gap="snug">
      <ESurface v-for="name in shown" :key="name" as="li" padding="base">
        <EInline gap="snug" :wrap="false">
          <EIcon :name="name" size="lg" />
          <EHighlight code>{{ name }}</EHighlight>
        </EInline>
      </ESurface>
    </EGrid>
    <EEmptyState v-else icon="search" title="No icon by that name" :heading-level="3">
      <EText as="span">Try a shorter word, such as "arrow".</EText>
    </EEmptyState>
  </EStack>
</template>
