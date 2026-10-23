<script setup lang="ts">
import { onMounted, ref } from "vue";
import { EDataGrid, EStack, EText } from "@eos-ui/vue";
import type { DataGridQuery } from "@eos-ui/vue";

interface Visit {
  id: string;
  date: string;
  service: string;
  amount: number;
}

// Stands in for your API. A real one sorts, filters and slices on the server.
const everything: Visit[] = Array.from({ length: 47 }, (_, i) => ({
  id: String(i + 1),
  date: `2026-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
  service: ["Check-up", "Lab work", "Eye exam", "Vaccination"][i % 4]!,
  amount: 40 + ((i * 37) % 180),
}));

function fetchVisits(q: DataGridQuery) {
  return new Promise<{ rows: Visit[]; total: number }>((resolve) => {
    setTimeout(() => {
      let list = everything.filter((v) => !q.search || v.service.toLowerCase().includes(q.search.toLowerCase()));
      if (q.sort) {
        const { key, dir } = q.sort;
        list = [...list].sort((a, b) => String(a[key as keyof Visit]).localeCompare(String(b[key as keyof Visit]), "en", { numeric: true }) * (dir === "desc" ? -1 : 1));
      }
      resolve({ rows: list.slice((q.page - 1) * q.pageSize, q.page * q.pageSize), total: list.length });
    }, 400);
  });
}

const columns = [
  { key: "date", label: "Date", sortable: true, width: 140 },
  { key: "service", label: "Service", sortable: true },
  { key: "amount", label: "Amount", numeric: true, sortable: true },
];

const rows = ref<Visit[]>([]);
const total = ref(0);
const loading = ref(true);
const failed = ref(false);

async function load(q: DataGridQuery) {
  loading.value = true;
  failed.value = false;
  try {
    const result = await fetchVisits(q);
    rows.value = result.rows;
    total.value = result.total;
  } catch {
    failed.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(() => load({ sort: null, page: 1, pageSize: 5, search: "" }));
</script>

<template>
  <EStack>
    <EDataGrid
      manual
      searchable
      caption="Visits from the server"
      :columns="columns"
      :rows="rows"
      :total="total"
      :loading="loading"
      :page-size="5"
      empty-title="No visits found"
      empty-text="Try a different search."
      @query-change="load"
    >
      <template #cell-amount="{ value }">${{ Number(value).toFixed(2) }}</template>
    </EDataGrid>
    <EText v-if="failed" small role="alert">The visits did not load. Try again.</EText>
  </EStack>
</template>
