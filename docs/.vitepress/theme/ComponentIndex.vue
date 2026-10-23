<script setup lang="ts">
import { computed, ref } from "vue";
import { EEmptyState } from "@eos-ui/vue/components/EEmptyState";
import { EGrid } from "@eos-ui/vue/components/EGrid";
import { ESearchBar } from "@eos-ui/vue/components/ESearchBar";
import { ELinkCard } from "@eos-ui/vue/components/ELinkCard";
import { EVisuallyHidden } from "@eos-ui/vue/components/EVisuallyHidden";
import { SYNONYMS } from "../search";

interface Group {
  id: string;
  title: string;
  items: { name: string; summary: string }[];
}
const props = defineProps<{ groups: Group[] }>();

const query = ref("");

const shown = computed(() => {
  const words = query.value.toLowerCase().split(/\s+/).filter(Boolean);
  return props.groups
    .map((g) => ({
      ...g,
      items: g.items.filter((c) => {
        const haystack = `${c.name} ${c.summary} ${SYNONYMS[c.name] ?? ""}`.toLowerCase();
        return words.every((w) => haystack.includes(w));
      }),
    }))
    .filter((g) => g.items.length);
});
const count = computed(() => shown.value.reduce((n, g) => n + g.items.length, 0));
const status = computed(() => (query.value.trim() ? (count.value ? `${count.value} ${count.value === 1 ? "component" : "components"}` : "No components found") : ""));
</script>

<template>
  <div class="eos-live component-index">
    <ESearchBar v-model="query" label="Filter components" placeholder="Filter by name, such as dropdown or modal" hide-action autocomplete="off" class="component-filter" />
    <EVisuallyHidden as="div" role="status" aria-live="polite" aria-atomic="true">{{ status }}</EVisuallyHidden>

    <EEmptyState v-if="!shown.length" title="No component matches that" icon="search" :heading-level="2">
      Try a shorter word, or a name you know from another library, such as modal or snackbar.
    </EEmptyState>

    <section v-for="g in shown" :key="g.id" :aria-labelledby="g.id" class="component-group">
      <h2 :id="g.id">{{ g.title }}</h2>
      <EGrid as="ul" min="17rem" :gap="3" class="component-list">
        <ELinkCard v-for="c in g.items" :key="c.name" as="li" size="sm" :title="`E${c.name}`" :href="`/components/${c.name}`">{{ c.summary }}</ELinkCard>
      </EGrid>
    </section>
  </div>
</template>
