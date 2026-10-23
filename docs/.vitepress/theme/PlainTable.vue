<script setup lang="ts">
import { ETable } from "@eos-ui/vue";

// A short static table from columns and rows, drawn by ETable. Each column's cells can be filled with a `cell-<key>` slot, as in EDataGrid.
defineProps<{ caption: string; columns: { key: string; label: string }[]; rows: Record<string, unknown>[] }>();
</script>

<template>
  <ETable :caption="caption" hide-caption>
    <thead>
      <tr>
        <th v-for="c in columns" :key="c.key" scope="col">{{ c.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, i) in rows" :key="String(row.id ?? i)">
        <td v-for="c in columns" :key="c.key">
          <slot :name="`cell-${c.key}`" :row="row" :value="row[c.key]">{{ row[c.key] }}</slot>
        </td>
      </tr>
    </tbody>
  </ETable>
</template>
