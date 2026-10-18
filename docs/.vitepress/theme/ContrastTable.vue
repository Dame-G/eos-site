<script setup lang="ts">
import { EChip } from "@eos-ui/vue";
// @ts-expect-error a build-time data loader (docs/data/tokens.data.js)
import { data } from "../../data/tokens.data.js";

function tone(level: string) {
  if (level === "AAA" || level === "AA") return "success";
  if (level.startsWith("3:1")) return "info";
  return "danger";
}
</script>

<template>
  <div class="contrast">
    <table>
      <thead>
        <tr>
          <th>Use</th>
          <th>Pair</th>
          <th>Ratio</th>
          <th>Needs</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in data.promised" :key="p.fg + p.bg">
          <td>{{ p.use }}</td>
          <td>
            <span class="pair">
              <span class="dot" :style="{ background: p.fgValue }" role="img" :aria-label="`${p.fg} ${p.fgValue}`" />
              <code>{{ p.fg }}</code> on
              <span class="dot" :style="{ background: p.bgValue }" role="img" :aria-label="`${p.bg} ${p.bgValue}`" />
              <code>{{ p.bg }}</code>
            </span>
          </td>
          <td>
            <strong>{{ p.ratio }}:1</strong>
          </td>
          <td>{{ p.min }}:1</td>
          <td>
            <EChip :tone="tone(p.level)">{{ p.level }}</EChip>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="!data.issues.length" class="ok">Every pair above is checked by <code>defineTheme()</code> for the default theme, and none fails.</p>
    <p v-else class="bad">{{ data.issues.length }} pairs fail in the default theme. This should never ship.</p>
  </div>
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
  width: 16px;
  height: 16px;
  border: var(--e-stroke-hair) solid var(--e-border-strong);
  border-radius: var(--e-radius-pill);
}
.ok,
.bad {
  font-size: var(--e-text-sm);
  color: var(--e-muted);
}
</style>
