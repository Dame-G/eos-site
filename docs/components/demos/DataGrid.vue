<script setup lang="ts">
import { ref } from "vue";
import { EButton, EDataGrid, EStack } from "@eos-ui/vue";

const rows = [
  { id: 1, date: "Oct 22, 2026", service: "Annual check-up", status: "Due", amount: 162.4 },
  { id: 2, date: "Sep 24, 2026", service: "Lab work", status: "Paid", amount: 98 },
  { id: 3, date: "Aug 12, 2026", service: "Dental cleaning", status: "Paid", amount: 120 },
  { id: 4, date: "Jul 3, 2026", service: "Eye exam", status: "Paid", amount: 75.5 },
  { id: 5, date: "Jun 18, 2026", service: "Vaccination", status: "Paid", amount: 45 },
  { id: 6, date: "May 6, 2026", service: "Follow-up visit", status: "Paid", amount: 60 },
];

const columns = [
  { key: "date", label: "Date", width: 150, sortable: true, value: (r: (typeof rows)[number]) => new Date(r.date) },
  { key: "service", label: "Service", sortable: true, filter: { type: "text" } as const },
  {
    key: "status",
    label: "Status",
    width: 130,
    filter: { type: "select", options: ["Due", "Paid"] } as const,
  },
  { key: "amount", label: "Amount", width: 200, numeric: true, sortable: true, filter: { type: "number" } as const },
];

const selected = ref<string[]>([]);
const sort = ref<{ key: string; dir: "asc" | "desc" } | null>({ key: "date", dir: "desc" });
</script>

<template>
  <EStack>
    <EDataGrid
      v-model:sort="sort"
      v-model:selected="selected"
      caption="Statements"
      :columns="columns"
      :rows="rows"
      :page-size="4"
      searchable
      filterable
      selectable
      column-toggle
    >
      <template #cell-amount="{ value }">${{ Number(value).toFixed(2) }}</template>
      <template #bulk-actions><EButton variant="outline">Download selected</EButton></template>
    </EDataGrid>
    <p>Selected rows: {{ selected.length }}</p>

    <!-- A bare table for a short list -->
    <EDataGrid plain caption="Recent payments" :columns="columns.slice(0, 2)" :rows="rows.slice(0, 3)" />

    <!-- Placeholder rows while data loads -->
    <EDataGrid loading caption="Loading statements" :columns="columns" :rows="[]" />

    <!-- Nothing to show -->
    <EDataGrid
      caption="Receipts"
      :columns="columns"
      :rows="[]"
      empty-title="No receipts yet"
      empty-text="They appear here after your first payment."
    />
  </EStack>
</template>
