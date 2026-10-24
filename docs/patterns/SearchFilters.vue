<script setup lang="ts">
import { computed, ref } from "vue";
import { EButton, EInline, EKicker, EPageHeader, ESearchBar, ESearchResults, ESegmented, ESelect, EStack, EText } from "@eos-ui/vue";
import type { SearchResultItem } from "@eos-ui/vue";

interface Doc extends SearchResultItem {
  kind: string;
  year: number;
}

const docs: Doc[] = [
  { label: "October statement", description: "Statement 4471, Main office", href: "#4471", kind: "Statement", year: 2026 },
  { label: "September receipt", description: "Receipt 9120, Lab work", href: "#9120", kind: "Receipt", year: 2026 },
  { label: "Consent form for lab work", description: "Signed Sep 24", href: "#consent", kind: "Form", year: 2026 },
  { label: "August statement", description: "Statement 4290, Downtown location", href: "#4290", kind: "Statement", year: 2026 },
  { label: "Annual statement", description: "Statement 3811, Main office", href: "#3811", kind: "Statement", year: 2025 },
  { label: "Insurance claim receipt", description: "Receipt 8004, Main office", href: "#8004", kind: "Receipt", year: 2025 },
];

const typed = ref("");
const query = ref("");
const kind = ref("All");
const year = ref("Any year");

const items = computed(() =>
  docs.filter(
    (d) =>
      (kind.value === "All" || d.kind === kind.value) &&
      (year.value === "Any year" || String(d.year) === year.value) &&
      (!query.value.trim() || `${d.label} ${d.description}`.toLowerCase().includes(query.value.trim().toLowerCase())),
  ),
);
const filtered = computed(() => kind.value !== "All" || year.value !== "Any year" || query.value.trim() !== "");
const emptyText = computed(() =>
  query.value.trim() ? `Nothing found for "${query.value}". Try fewer words or clear a filter.` : "Nothing matches these filters. Clear a filter to see more.",
);

function search(q: string) {
  query.value = q;
}
function clear() {
  typed.value = "";
  query.value = "";
  kind.value = "All";
  year.value = "Any year";
}
</script>

<template>
  <div class="pattern-md">
    <EStack :gap="4">
      <EPageHeader :heading-level="2" title="Find a document" description="Statements, receipts and forms." />
      <ESearchBar clearable v-model="typed" placeholder="Search by title or number" @submit="search" />
      <EInline align="start">
        <EStack :gap="2">
          <EKicker as="span" aria-hidden="true">Type</EKicker>
          <ESegmented v-model="kind" label="Type" :options="['All', 'Statement', 'Receipt', 'Form']" />
        </EStack>
        <ESelect v-model="year" label="Year" :options="['Any year', '2026', '2025']" />
      </EInline>
      <EInline justify="between">
        <EText size="sm" tone="neutral" role="status">{{ items.length }} {{ items.length === 1 ? "document" : "documents" }}</EText>
        <EButton v-if="filtered" variant="quiet" @click="clear">Clear filters</EButton>
      </EInline>
      <ESearchResults label="Documents" :items="items" :query="query" :empty-text="emptyText" />
    </EStack>
  </div>
</template>
