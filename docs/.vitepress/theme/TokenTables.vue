<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { contrast } from "@eos-ui/tokens";
import ColorValue from "./ColorValue.vue";
import TokenName from "./TokenName.vue";
import { activeScheme } from "./site-theme";
import { EStamp, EDataGrid, EGrid, EHeading, EHighlight, EStack, ESurface, EText } from "@eos-ui/vue";
// @ts-expect-error a build-time data loader (docs/data/tokens.data.js)
import { data } from "../../data/tokens.data.js";

defineProps<{
  section: "inputs" | "colour" | "type" | "spacing" | "radius" | "shadow" | "fontSize" | "size" | "stroke" | "motion" | "zIndex";
}>();

type Partner = { name: string; value: string; role: string; ratio: number; level: string };
type Token = { name: string; value: string; usage: string; from: string[]; input: boolean; constant: boolean };
type Input = { name: string; controls: string; neutral: string; derives: string[] };

function tone(level: string) {
  if (level === "AAA" || level === "AA") return "success";
  if (level.startsWith("3:1")) return "info";
  if (level.startsWith("Large")) return "warning";
  return "danger";
}
// The ratios are read from the colours the page is showing now, so they follow the colour scheme and not only the light values written at build time.
const live = ref<Record<string, string>>({});
function resolveColour(name: string, depth = 0): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(`--e-${name}`).trim();
  const m = /^var(--e-([a-z0-9-]+))$/.exec(raw);
  return m && depth < 6 ? resolveColour(m[1]!, depth + 1) : raw;
}
function readLive() {
  const next: Record<string, string> = {};
  for (const c of data.colours as { name: string; partners: Partner[] }[]) {
    next[c.name] = resolveColour(c.name);
    for (const p of c.partners) next[p.name] = resolveColour(p.name);
  }
  live.value = next;
}
onMounted(readLive);
watch(activeScheme, () => requestAnimationFrame(readLive));
onBeforeUnmount(() => (live.value = {}));
const HEX = /^#[0-9a-f]{6}$/i;
function ratioOf(a: string, p: Partner): number {
  const x = live.value[a];
  const y = live.value[p.name];
  return x && y && HEX.test(x) && HEX.test(y) ? Math.round(contrast(x, y) * 100) / 100 : p.ratio;
}
const shownHex = (c: { name: string; value: string }) => (HEX.test(live.value[c.name] ?? "") ? live.value[c.name]! : c.value);
function levelOf(a: string, p: Partner): string {
  const r = ratioOf(a, p);
  if (/non-text/.test(p.role)) return r >= 3 ? "3:1 or more (non-text)" : "Fails 3:1";
  if (r >= 7) return "AAA";
  if (r >= 4.5) return "AA";
  if (r >= 3) return "Large text only";
  return p.level;
}
const isText = (p: Partner) => !/non-text|Decoration/.test(p.role);

const withId = <T extends { name: string }>(rows: T[]) => rows.map((r) => ({ ...r, id: r.name }));
const token = { key: "name", label: "Token" };
const value = { key: "value", label: "Value" };
const usage = { key: "usage", label: "Used for" };
const from = { key: "from", label: "From" };
const plainColumns = [token, value, from, usage];
const withFrom = (rows: Token[]) => rows.map((r) => ({ ...r, id: r.name, from: r.constant ? "constant" : r.from.join(", ") }));
</script>

<template>
  <div class="eos-live">
    <EDataGrid
      v-if="section === 'inputs'"
      bare
      caption="Theme inputs"
      :columns="[{ key: 'name', label: 'Input' }, { key: 'controls', label: 'Controls' }, { key: 'derives', label: 'Derives' }, { key: 'neutral', label: 'Neutral' }]"
      :rows="withId(data.inputs as Input[])"
    >
      <template #cell-name="{ row }"
        ><EHighlight code>{{ row.name }}</EHighlight></template
      >
      <template #cell-derives="{ row }">
        <span class="derives"
          ><EHighlight code v-for="n in row.derives as string[]" :key="n">{{ n }}</EHighlight></span
        >
      </template>
      <template #cell-neutral="{ row }"
        ><ColorValue :value="row.neutral as string"
      /></template>
    </EDataGrid>

    <template v-else-if="section === 'colour'">
      <EGrid as="ul" min="22rem" :gap="4" class="swatches">
        <ESurface v-for="c in data.colours" :id="`color-${c.name}`" :key="c.name" as="li" small class="swatch">
          <div
            class="chip"
            :style="{ background: `var(--e-${c.name})`, color: c.partners[0] ? `var(--e-${c.partners[0].name})` : 'inherit' }"
            role="img"
            :aria-label="`${c.name} is ${c.value}`"
          >
            <span v-if="c.partners[0] && isText(c.partners[0])" aria-hidden="true">Aa</span>
          </div>
          <div class="meta">
            <p class="name">
              <TokenName :name="c.name" /> <span class="hex"
                ><template v-if="c.source.startsWith('{')">= </template><ColorValue :value="shownHex(c)"
              /></span>
            </p>
            <EText small muted class="usage">{{ c.usage }}</EText>
            <EText small muted class="usage">From {{ c.from.join(", ") }}{{ c.input ? " (its value)" : "" }}</EText>
            <ul v-if="c.partners.length" class="pairs">
              <li v-for="p in c.partners" :key="p.name">
                <strong>{{ ratioOf(c.name, p) }}:1</strong> with <EHighlight code>{{ p.name }}</EHighlight>
                <EStamp :tone="tone(levelOf(c.name, p))" size="sm">{{ levelOf(c.name, p) }}</EStamp>
                <span class="role">{{ p.role }}</span>
              </li>
            </ul>
          </div>
        </ESurface>
      </EGrid>
    </template>

    <template v-else-if="section === 'type'">
      <EStack>
        <EText>
          Two families. <strong>Sans</strong> for reading, <strong>mono</strong> for kickers, chips, stamps and every amount, number and date. Fonts are
          never bundled: load them yourself or import <EHighlight code>@eos-ui/vue/fonts.css</EHighlight>.
        </EText>
        <EDataGrid
          bare
          caption="Font families"
          :columns="[token, { key: 'from', label: 'From' }, { key: 'stack', label: 'Stack' }, { key: 'sample', label: 'Sample' }]"
          :rows="[
            { id: 'sans', name: 'font-sans', from: 'fonts', stack: data.families.sans, sample: 'Your balance is due November 1.' },
            { id: 'mono', name: 'font-mono', from: 'fonts', stack: data.families.mono, sample: '$162.40, Oct 22, 2026' },
          ]"
        >
          <template #cell-name="{ row }"
            ><TokenName :name="row.name as string" /></template
          >
          <template #cell-sample="{ row }"
            ><span :style="{ fontFamily: `var(--e-${row.name})` }">{{ row.sample }}</span></template
          >
        </EDataGrid>
        <template v-for="g in data.typeGroups" :key="g.name">
          <EHeading :id="`type-${g.name.toLowerCase().replace(/ /g, '-')}`" :level="3">{{ g.name }}</EHeading>
          <EDataGrid
            bare
            :caption="g.name"
            :columns="[
              { key: 'name', label: 'Style' },
              { key: 'size', label: 'Size and line' },
              { key: 'usage', label: 'Used for' },
              { key: 'sample', label: 'Sample' },
            ]"
            :rows="g.styles.map((s: any) => ({ ...s, id: s.name, size: `${s.fontSize} / ${s.lineHeight}, weight ${s.fontWeight}` }))"
          >
            <template #cell-name="{ row }"
              ><EHighlight code>{{ row.name }}</EHighlight></template
            >
            <template #cell-sample="{ row }">
              <span
                :style="{
                  fontFamily: g.family === 'mono' ? 'var(--e-font-mono)' : 'var(--e-font-sans)',
                  fontSize: row.fontSize as string,
                  lineHeight: row.lineHeight as string,
                  fontWeight: row.fontWeight as string,
                }"
                >{{ row.sample }}</span
              >
            </template>
          </EDataGrid>
        </template>
      </EStack>
    </template>

    <EDataGrid
      v-else-if="section === 'spacing'"
      bare
      caption="Spacing"
      :columns="[token, value, from, usage, { key: 'size', label: 'Size' }]"
      :rows="withFrom(data.spacing as Token[])"
    >
      <template #cell-name="{ row }"
        ><TokenName :name="row.name as string" /></template
      >
      <template #cell-size="{ row }"><span class="bar" :style="{ width: row.value as string }" /></template>
    </EDataGrid>

    <EDataGrid
      v-else-if="section === 'radius'"
      bare
      caption="Corner radius"
      :columns="[token, value, from, usage, { key: 'shape', label: 'Shape' }]"
      :rows="withFrom(data.radius as Token[])"
    >
      <template #cell-name="{ row }"
        ><TokenName :name="row.name as string" /></template
      >
      <template #cell-shape="{ row }"><span class="box" :style="{ borderRadius: row.value as string }" /></template>
    </EDataGrid>

    <EDataGrid
      v-else-if="section === 'shadow'"
      bare
      caption="Shadows"
      :columns="[token, from, usage, { key: 'look', label: 'Look' }]"
      :rows="withFrom(data.shadow as Token[])"
    >
      <template #cell-name="{ row }"
        ><TokenName :name="row.name as string" /></template
      >
      <template #cell-look="{ row }"><span class="box wide" :style="{ boxShadow: `var(--e-${row.name})`, border: 'none' }" /></template>
    </EDataGrid>

    <EDataGrid
      v-else-if="section === 'fontSize'"
      bare
      caption="Font sizes"
      :columns="[token, value, from, usage, { key: 'sample', label: 'Sample' }]"
      :rows="withFrom(data.fontSize as Token[])"
    >
      <template #cell-name="{ row }"
        ><TokenName :name="row.name as string" /></template
      >
      <template #cell-sample="{ row }"
        ><span :style="{ fontSize: row.value as string, lineHeight: 1.2 }">Aa</span></template
      >
    </EDataGrid>

    <EDataGrid
      v-else
      bare
      :caption="section === 'size' ? 'Sizes' : section === 'stroke' ? 'Strokes' : section === 'motion' ? 'Motion' : 'Layers'"
      :columns="plainColumns"
      :rows="withFrom((section === 'motion' ? [...data.duration, ...data.easing] : data[section]) as Token[])"
    >
      <template #cell-name="{ row }"
        ><TokenName :name="row.name as string" /></template
      >
    </EDataGrid>
  </div>
</template>

<style scoped>
.swatches {
  --swatch-size: calc(var(--e-space-8) * 2);
  margin: 0;
  padding: 0;
  list-style: none;
}
.swatch {
  display: flex;
  gap: var(--e-space-3);
  align-items: flex-start;
  margin: 0;
}
.chip {
  display: grid;
  flex: none;
  place-items: center;
  width: var(--swatch-size);
  height: var(--swatch-size);
  border: var(--e-stroke-hair) solid var(--e-border);
  border-radius: var(--e-radius-md);
  font: 500 var(--e-text-xl) / 1 var(--e-font-sans);
}
.meta {
  min-width: 0;
}
.meta p {
  margin: 0;
}
.name {
  font-size: var(--e-text-sm);
}
.usage {
  margin-top: var(--e-space-1);
}
.hex {
  font: 500 var(--e-text-xs) / 1.2 var(--e-font-mono);
  color: var(--e-muted);
}
.pairs {
  display: grid;
  gap: var(--e-space-1);
  margin: var(--e-space-2) 0 0;
  padding: 0;
  list-style: none;
  font-size: var(--e-text-sm);
}
.pairs li {
  display: flex;
  flex-wrap: wrap;
  gap: var(--e-space-1) var(--e-space-2);
  align-items: center;
  margin: 0;
}
.role {
  color: var(--e-muted);
}
.derives {
  display: flex;
  flex-wrap: wrap;
  gap: var(--e-space-1);
}
.bar {
  display: block;
  height: var(--e-space-4);
  background: var(--e-primary);
  border-radius: var(--e-radius-sm);
}
.box {
  --box-size: calc(var(--e-space-8) + var(--e-space-6));
  display: block;
  width: var(--box-size);
  height: var(--box-size);
  border: var(--e-stroke-edge) solid var(--e-border-strong);
  background: var(--e-surface-tint);
}
.box.wide {
  width: calc(var(--box-size) * 2);
  background: var(--e-surface);
}
</style>
