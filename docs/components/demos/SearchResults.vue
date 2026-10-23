<script setup lang="ts">
import { computed, ref } from "vue";
import { ESearchBar, ESearchResults, ESkeleton, EStack, EVisuallyHidden, EText } from "@eos-ui/vue";
import type { SearchResultItem } from "@eos-ui/vue";

const all: SearchResultItem[] = [
  { label: "Dialog", description: "Components › Containers", href: "#dialog" },
  { label: "Drawer", description: "Components › Containers", href: "#drawer" },
  { label: "Disclosure", description: "Components › Containers", href: "#disclosure" },
  { label: "Date picker", description: "Components › Composites", href: "#date-picker" },
];

const query = ref("d");
const field = ref<{ focus: () => void } | null>(null);
const results = ref<{ focusFirst: () => void } | null>(null);
const opened = ref("");

const items = computed(() => all.filter((i) => i.label.toLowerCase().includes(query.value.trim().toLowerCase())));
const emptyText = computed(() => (query.value.trim() ? `Nothing found for "${query.value}".` : undefined));

function onSelect(item: SearchResultItem, event: MouseEvent) {
  event.preventDefault();
  opened.value = item.label;
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    results.value?.focusFirst();
  }
}
</script>

<template>
  <EStack>
    <ESearchBar ref="field" v-model="query" label="Search the docs" placeholder="Search the docs" hide-action autocomplete="off" @keydown="onKeydown" />
    <EVisuallyHidden as="div" role="status" aria-live="polite" aria-atomic="true">{{ items.length }} results</EVisuallyHidden>
    <ESearchResults
      ref="results"
      label="Search results"
      :items="items"
      :query="query"
      :empty-text="emptyText"
      @select="onSelect"
      @edge="field?.focus()"
    />
    <EText size="sm" tone="neutral">While results load</EText>
    <EStack :gap="2" aria-busy="true">
      <ESkeleton :height="56" />
      <ESkeleton :height="56" />
    </EStack>
    <EText size="sm" tone="neutral">No results</EText>
    <ESearchResults label="Empty results" :items="[]" query="tax" empty-text="Nothing found for &quot;tax&quot;. Try a shorter word." />
    <EText size="sm" tone="neutral">{{ opened ? `Opened ${opened}.` : "Press the Down arrow to move into the results." }}</EText>
  </EStack>
</template>
