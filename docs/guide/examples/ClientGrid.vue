<script setup lang="ts">
import { ref } from "vue";
import { EButton, EDataGrid, EStack, EStamp, EText, useLocale } from "@eos-ui/vue";

interface Statement {
  id: string;
  date: Date;
  service: string;
  status: "due" | "paid";
  amount: number;
}

const { formatDate, formatMoney } = useLocale();

const rows: Statement[] = [
  { id: "4471", date: new Date(2026, 9, 2), service: "Annual check-up", status: "due", amount: 162.4 },
  { id: "4402", date: new Date(2026, 8, 18), service: "Follow-up visit", status: "paid", amount: 84 },
  { id: "4290", date: new Date(2026, 7, 30), service: "Consultation", status: "due", amount: 310 },
  { id: "4188", date: new Date(2026, 7, 3), service: "Package of four sessions", status: "paid", amount: 480 },
  { id: "4101", date: new Date(2026, 6, 21), service: "Lab work", status: "paid", amount: 56.75 },
  { id: "4033", date: new Date(2026, 5, 9), service: "Visit with a long description that keeps going to show how a cell wraps", status: "paid", amount: 120 },
];

// `value` is what sorts, filters and searches. The cell slot is only how it looks.
const columns = [
  { key: "date", label: "Date", sortable: true, width: 140, value: (r: Statement) => r.date },
  { key: "service", label: "Service", sortable: true, filter: { type: "text" } as const },
  { key: "status", label: "Status", width: 130, filter: { type: "select", options: ["due", "paid"] } as const },
  { key: "amount", label: "Amount", numeric: true, sortable: true, width: 150, filter: { type: "number" } as const },
];

const selected = ref<string[]>([]);
const sort = ref<{ key: string; dir: "asc" | "desc" } | null>({ key: "date", dir: "desc" });
</script>

<template>
  <EStack>
    <EDataGrid
      v-model:selected="selected"
      v-model:sort="sort"
      caption="Statements"
      :columns="columns"
      :rows="rows"
      :page-size="4"
      searchable
      filterable
      selectable
    >
      <template #cell-date="{ row }">{{ formatDate(row.date) }}</template>
      <template #cell-status="{ row }"><EStamp :status="row.status" size="sm" /></template>
      <template #cell-amount="{ row }">{{ formatMoney(row.amount) }}</template>
      <template #bulk-actions><EButton variant="outline" icon="download">Download receipts</EButton></template>
    </EDataGrid>
    <EText size="sm" tone="muted">Selected: {{ selected.length ? selected.join(", ") : "none" }}</EText>
  </EStack>
</template>
