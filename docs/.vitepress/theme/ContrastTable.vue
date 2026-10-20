<script setup lang="ts">
import { EStamp, EDataGrid, EHighlight, EStack, EText } from "@eos-ui/vue";
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
    <EDataGrid bare caption="Promised contrast pairs" :columns="columns" :rows="rows">
      <template #cell-pair="{ row }">
        <span class="pair">
          <span class="dot" :style="{ background: row.fgValue as string }" role="img" :aria-label="`${row.fg} ${row.fgValue}`" />
          <EHighlight code>{{ row.fg }}</EHighlight> on
          <span class="dot" :style="{ background: row.bgValue as string }" role="img" :aria-label="`${row.bg} ${row.bgValue}`" />
          <EHighlight code>{{ row.bg }}</EHighlight>
        </span>
      </template>
      <template #cell-level="{ row }"><EStamp :tone="tone(row.level as string)" size="sm">{{ row.level }}</EStamp></template>
    </EDataGrid>
    <EText v-if="!data.issues.length" small muted>Every pair above is checked by <EHighlight code>defineTheme()</EHighlight> for the default theme, and none fails.</EText>
    <EText v-else small muted>{{ data.issues.length }} pairs fail in the default theme. This should never ship.</EText>
  </EStack>
</template>

<style scoped>
.pair {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--e-space-1);
  align-items: center;
}
.dot {
  display: inline-block;
  width: var(--e-space-4);
  height: var(--e-space-4);
  border: var(--e-stroke-hair) solid var(--e-border-strong);
  --e-bc: var(--e-border-strong);
  outline: var(--e-stroke-hair) solid var(--e-bc);
  outline-offset: calc(-1 * var(--e-stroke-hair));
  border-radius: var(--e-radius-pill);
}
</style>
