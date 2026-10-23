<script setup lang="ts">
import { ref } from "vue";
import { EButton, EDataGrid, EDialog, EPageHeader, EStack, EStamp, EToastProvider, useToast } from "@eos-ui/vue";

interface Statement {
  id: string;
  title: string;
  status: "due" | "paid";
  amount: number;
}

const toast = useToast();
const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const rows = ref<Statement[]>([
  { id: "4471", title: "Annual check-up", status: "due", amount: 162.4 },
  { id: "4402", title: "Follow-up visit", status: "paid", amount: 84 },
  { id: "4290", title: "Consultation", status: "due", amount: 310 },
  { id: "4188", title: "Package of four sessions", status: "paid", amount: 480 },
  { id: "4101", title: "Lab work", status: "paid", amount: 56.75 },
  { id: "4033", title: "Visit on Jun 9", status: "paid", amount: 120 },
]);

const columns = [
  { key: "id", label: "Number", width: 120, sortable: true },
  { key: "title", label: "Visit", sortable: true, filter: { type: "text" } as const },
  { key: "status", label: "Status", width: 130, filter: { type: "select", options: ["due", "paid"] } as const },
  { key: "amount", label: "Amount", numeric: true, sortable: true, width: 140 },
];

const selected = ref<string[]>([]);
const confirming = ref(false);

function download() {
  toast.show({ title: `Downloading ${selected.value.length} receipt${selected.value.length === 1 ? "" : "s"}` });
}
function remove() {
  const count = selected.value.length;
  rows.value = rows.value.filter((r) => !selected.value.includes(r.id));
  selected.value = [];
  confirming.value = false;
  toast.show({ title: `${count} statement${count === 1 ? "" : "s"} removed`, tone: "success" });
}
</script>

<template>
  <div class="pattern-md">
    <EToastProvider>
      <EStack :gap="4">
        <EPageHeader :heading-level="2" title="All statements" description="Select rows to act on several at once." />
        <EDataGrid
          v-model:selected="selected"
          caption="All statements"
          :columns="columns"
          :rows="rows"
          :page-size="4"
          searchable
          filterable
          selectable
          empty-title="No statements"
          empty-text="They appear here after your first visit."
        >
          <template #cell-status="{ row }"><EStamp :status="row.status" small /></template>
          <template #cell-amount="{ row }">{{ money(row.amount) }}</template>
          <template #bulk-actions>
            <EButton variant="outline" icon="download" @click="download">Download receipts</EButton>
            <EButton variant="outline" icon="trash" @click="confirming = true">Remove</EButton>
          </template>
        </EDataGrid>

        <EDialog v-model:open="confirming" dismissible :title="`Remove ${selected.length} statement${selected.length === 1 ? '' : 's'}?`">
          This cannot be undone.
          <template #actions>
            <EButton variant="danger" @click="remove">Remove</EButton>
            <EButton variant="outline" @click="confirming = false">Keep them</EButton>
          </template>
        </EDialog>
      </EStack>
    </EToastProvider>
  </div>
</template>
