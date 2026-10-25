<script setup lang="ts">
import { EHighlight } from "@eos-ui/vue/components/EHighlight";
import { EStack } from "@eos-ui/vue/components/EStack";
import { EStamp } from "@eos-ui/vue/components/EStamp";
import { EText } from "@eos-ui/vue/components/EText";
import PlainTable from "./PlainTable.vue";
// @ts-expect-error a build-time data loader (docs/data/tokens.data.js)
import { data } from "../../data/tokens.data.js";

function tone(level: string) {
  if (level === "AAA" || level === "AA") return "success";
  if (level.startsWith("3:1")) return "info";
  return "danger";
}

const columns = [
  { key: "use", label: "Use" },
  { key: "pair", label: "Pair" },
  { key: "ratio", label: "Ratio", numeric: true },
  { key: "min", label: "Needs", numeric: true },
  { key: "level", label: "Result" },
];
const rows = (data.promised as Record<string, unknown>[]).map((p) => ({
  ...p,
  id: `${p.fg}-${p.bg}`,
  ratio: `${p.ratio}:1`,
  min: `${p.min}:1`,
}));
</script>

<template>
  <EStack class="eos-live">
    <PlainTable caption="Promised contrast pairs" :columns="columns" :rows="rows">
      <template #cell-pair="{ row }">
        <span class="pair">
          <EHighlight code :swatch="row.fgValue as string">{{ row.fg }}</EHighlight> on
          <EHighlight code :swatch="row.bgValue as string">{{ row.bg }}</EHighlight>
        </span>
      </template>
      <template #cell-level="{ row }"><EStamp :tone="tone(row.level as string)" size="sm">{{ row.level }}</EStamp></template>
    </PlainTable>
    <EText v-if="!data.issues.length" size="sm" tone="muted">Every pair above is checked by <EHighlight code>defineTheme()</EHighlight> for the default theme, and none fails.</EText>
    <EText v-else size="sm" tone="muted">{{ data.issues.length }} pairs fail in the default theme. This should never ship.</EText>
  </EStack>
</template>

<style scoped>
.pair {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--e-space-1);
  align-items: center;
}
</style>
