<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { contrast } from "@eos-ui/tokens";
import ColorValue from "./ColorValue.vue";
import TokenName from "./TokenName.vue";
import { activeScheme } from "./site-theme";
import { EGrid } from "@eos-ui/vue/components/EGrid";
import { EHeading } from "@eos-ui/vue/components/EHeading";
import { EHighlight } from "@eos-ui/vue/components/EHighlight";
import { EStack } from "@eos-ui/vue/components/EStack";
import { EStamp } from "@eos-ui/vue/components/EStamp";
import { ESurface } from "@eos-ui/vue/components/ESurface";
import { EText } from "@eos-ui/vue/components/EText";
import PlainTable from "./PlainTable.vue";
// @ts-expect-error a build-time data loader (docs/data/tokens.data.js)
import { data } from "../../data/tokens.data.js";

defineProps<{
  section: "inputs" | "colour" | "type" | "spacing" | "layout" | "radius" | "shadow" | "fontSize" | "tracking" | "leading" | "size" | "stroke" | "slab" | "motion" | "zIndex";
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
function readLive() {
  // getComputedStyle has already substituted any var() a token is written with.
  const style = getComputedStyle(document.documentElement);
  const read = (name: string) => style.getPropertyValue(`--e-${name}`).trim();
  const next: Record<string, string> = {};
  for (const c of data.colours as { name: string; partners: Partner[] }[]) {
    next[c.name] = read(c.name);
    for (const p of c.partners) next[p.name] = read(p.name);
  }
  live.value = next;
}
onMounted(readLive);
watch(activeScheme, () => requestAnimationFrame(readLive));
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
const isSlab = (t: Token) => /^slab(-|$)/.test(t.name);
/** Rows of a plain scale, so the stroke table and the slab table share one source. */
function plainRows(section: string): Token[] {
  if (section === "motion") return [...data.duration, ...data.easing];
  if (section === "stroke") return (data.stroke as Token[]).filter((t) => !isSlab(t));
  if (section === "slab") return (data.stroke as Token[]).filter(isSlab);
  return data[section] ?? [];
}
const withFrom = (rows: Token[]) => rows.map((r) => ({ ...r, id: r.name, from: r.constant ? "constant" : r.from.join(", ") }));
</script>

<template>
  <div class="eos-live">
    <PlainTable
      v-if="section === 'inputs'"
      caption="Theme inputs"
      :columns="[{ key: 'name', label: 'Input' }, { key: 'derives', label: 'Derives' }, { key: 'neutral', label: 'Left out' }]"
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
    </PlainTable>

    <template v-else-if="section === 'colour'">
      <EGrid as="ul" min="22rem" :gap="4" class="swatches">
        <ESurface v-for="c in data.colours" :id="`color-${c.name}`" :key="c.name" as="li" padding="var(--e-gap-base) var(--e-pad-card)" class="swatch">
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
              <TokenName :name="c.name" /> <ColorValue :value="shownHex(c)" />
            </p>
            <EText size="sm" tone="muted" class="usage">{{ c.usage }}</EText>
            <EText size="sm" tone="muted" class="usage">From {{ c.from.join(", ") }}{{ c.input ? " (its value)" : "" }}</EText>
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
          not part of <EHighlight code>style.css</EHighlight>: import <EHighlight code>@eos-ui/vue/fonts-self-hosted.css</EHighlight> or <EHighlight code>@eos-ui/vue/fonts.css</EHighlight>, or load them yourself.
        </EText>
        <PlainTable
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
        </PlainTable>
        <template v-for="g in data.typeGroups" :key="g.name">
          <EHeading :id="`type-${g.name.toLowerCase().replace(/ /g, '-')}`" :level="3">{{ g.name }}</EHeading>
          <PlainTable
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
          </PlainTable>
        </template>
      </EStack>
    </template>

    <PlainTable
      v-else-if="section === 'spacing'"
      caption="Spacing"
      :columns="[token, value, from, usage, { key: 'size', label: 'Size' }]"
      :rows="withFrom(data.spacing as Token[])"
    >
      <template #cell-name="{ row }"
        ><TokenName :name="row.name as string" /></template
      >
      <template #cell-size="{ row }"><span class="bar" :style="{ width: row.value as string }" /></template>
    </PlainTable>

    <PlainTable
      v-else-if="section === 'layout'"
      caption="Layout spacing"
      :columns="[token, value, from, usage, { key: 'look', label: 'Look' }]"
      :rows="withFrom(data.layout as Token[])"
    >
      <template #cell-name="{ row }"
        ><TokenName :name="row.name as string" /></template
      >
      <template #cell-look="{ row }">
        <span v-if="(row.name as string).startsWith('gap-')" class="gap-demo" :style="{ gap: `var(--e-${row.name})` }"><i /><i /></span>
        <span v-else-if="(row.name as string).startsWith('pad-')" class="pad-demo" :style="{ padding: `var(--e-${row.name})` }"><i /></span>
        <span v-else class="gutter-demo"><i :style="{ width: `var(--e-${row.name})` }" /></span>
      </template>
    </PlainTable>

    <PlainTable
      v-else-if="section === 'tracking' || section === 'leading'"
      :caption="section === 'tracking' ? 'Letter spacing' : 'Line height'"
      :columns="[token, value, from, usage, { key: 'sample', label: 'Sample' }]"
      :rows="withFrom(data[section] as Token[])"
    >
      <template #cell-name="{ row }"
        ><TokenName :name="row.name as string" /></template
      >
      <template #cell-sample="{ row }">
        <span v-if="section === 'tracking'" :style="{ letterSpacing: `var(--e-${row.name})` }">Amount due</span>
        <span v-else class="leading-demo" :style="{ lineHeight: `var(--e-${row.name})` }">Two lines of text to show the line height.</span>
      </template>
    </PlainTable>

    <PlainTable
      v-else-if="section === 'radius'"
      caption="Corner radius"
      :columns="[token, value, from, usage, { key: 'shape', label: 'Shape' }]"
      :rows="withFrom(data.radius as Token[])"
    >
      <template #cell-name="{ row }"
        ><TokenName :name="row.name as string" /></template
      >
      <template #cell-shape="{ row }"><span class="box" :style="{ borderRadius: row.value as string }" /></template>
    </PlainTable>

    <PlainTable
      v-else-if="section === 'shadow'"
      caption="Shadows"
      :columns="[token, from, usage, { key: 'look', label: 'Look' }]"
      :rows="withFrom(data.shadow as Token[])"
    >
      <template #cell-name="{ row }"
        ><TokenName :name="row.name as string" /></template
      >
      <template #cell-look="{ row }"><span class="box wide" :style="{ boxShadow: `var(--e-${row.name})`, border: 'none' }" /></template>
    </PlainTable>

    <PlainTable
      v-else-if="section === 'fontSize'"
      caption="Font sizes"
      :columns="[token, value, from, usage, { key: 'sample', label: 'Sample' }]"
      :rows="withFrom(data.fontSize as Token[])"
    >
      <template #cell-name="{ row }"
        ><TokenName :name="row.name as string" /></template
      >
      <template #cell-sample="{ row }"
        ><span :style="{ fontSize: row.value as string, lineHeight: 'var(--e-leading-tight)' }">Aa</span></template
      >
    </PlainTable>

    <PlainTable
      v-else
      :caption="({ size: 'Sizes', stroke: 'Strokes', slab: 'Slabs', motion: 'Motion' } as Record<string, string>)[section] ?? 'Layers'"
      :columns="section === 'slab' ? [...plainColumns, { key: 'look', label: 'Look' }] : plainColumns"
      :rows="withFrom(plainRows(section))"
    >
      <template #cell-name="{ row }"
        ><TokenName :name="row.name as string" /></template
      >
      <template #cell-look="{ row }"><span class="slab-demo" :style="{ '--slab-lift': `var(--e-${row.name})` }" /></template>
    </PlainTable>
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
  font: var(--e-weight-medium) var(--e-text-xl) / var(--e-leading-none) var(--e-font-sans);
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
.gap-demo,
.pad-demo {
  display: inline-flex;
}
.gap-demo i {
  display: block;
  width: var(--e-space-4);
  height: var(--e-space-4);
  background: var(--e-primary);
  border-radius: var(--e-radius-sm);
}
.pad-demo {
  background: var(--e-surface-tint);
  border: var(--e-stroke-hair) dashed var(--e-border-strong);
}
.pad-demo i {
  display: block;
  width: var(--e-space-6);
  height: var(--e-space-4);
  background: var(--e-primary);
  border-radius: var(--e-radius-sm);
}
.gutter-demo {
  display: flex;
  max-width: 100%;
}
.gutter-demo i {
  display: block;
  max-width: 100%;
  height: var(--e-space-4);
  background: var(--e-primary);
  border-radius: var(--e-radius-sm);
}
.leading-demo {
  display: block;
  max-width: 16rem;
}
/* A primary face on its slab, drawn as the library's recipe (base.css): an edge all round in the slab colour, the bottom one thicker by the lift this row names, and bottom corners as much taller as the slab is thick. */
.slab-demo {
  display: block;
  box-sizing: border-box;
  width: calc(var(--e-space-8) * 2);
  height: calc(var(--e-space-6) + var(--slab-lift));
  border: var(--e-stroke-edge) solid var(--e-primary-slab);
  border-bottom-width: calc(var(--e-stroke-edge) + var(--slab-lift));
  border-radius: var(--e-radius-md) / var(--e-radius-md) var(--e-radius-md) calc(var(--e-radius-md) + var(--slab-lift)) calc(var(--e-radius-md) + var(--slab-lift));
  background: var(--e-primary);
  background-clip: border-box;
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
