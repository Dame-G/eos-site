<script setup lang="ts">
import { EChip, EDataGrid, EGrid, EHighlight, EStack, ESurface, EText } from "@eos-ui/vue";
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
const isText = (p: Partner) => !/non-text|Decoration/.test(p.role);

const withId = <T extends { name: string }>(rows: T[]) => rows.map((r) => ({ ...r, id: r.name }));
const token = { key: "name", label: "Token", width: 200 };
const value = { key: "value", label: "Value", width: 150 };
const usage = { key: "usage", label: "Used for" };
const from = { key: "from", label: "From", width: 170 };
const plainColumns = [token, value, from, usage];
const withFrom = (rows: Token[]) => rows.map((r) => ({ ...r, id: r.name, from: r.constant ? "constant" : r.from.join(", ") }));
</script>

<template>
  <div class="eos-live">
    <EDataGrid
      v-if="section === 'inputs'"
      plain
      caption="Theme inputs"
      :columns="[{ key: 'name', label: 'Input', width: 150 }, { key: 'controls', label: 'Controls' }, { key: 'derives', label: 'Derives' }, { key: 'neutral', label: 'Neutral', width: 150 }]"
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
        ><EHighlight code>{{ row.neutral }}</EHighlight></template
      >
    </EDataGrid>

    <template v-else-if="section === 'colour'">
      <EGrid as="ul" min="22rem" :gap="4" class="swatches">
        <ESurface v-for="c in data.colours" :id="`color-${c.name}`" :key="c.name" as="li" pad="sm" class="swatch">
          <div
            class="chip"
            :style="{ background: c.value, color: c.partners[0]?.value ?? 'inherit' }"
            role="img"
            :aria-label="`${c.name} is ${c.value}`"
          >
            <span v-if="c.partners[0] && isText(c.partners[0])" aria-hidden="true">Aa</span>
          </div>
          <div class="meta">
            <p class="name">
              <EHighlight code>--e-{{ c.name }}</EHighlight> <span class="hex">{{ c.source.startsWith("{") ? "= " + c.value : c.value }}</span>
            </p>
            <EText variant="small" muted class="usage">{{ c.usage }}</EText>
            <EText variant="small" muted class="usage">From {{ c.from.join(", ") }}{{ c.input ? " (its value)" : "" }}</EText>
            <ul v-if="c.partners.length" class="pairs">
              <li v-for="p in c.partners" :key="p.name">
                <strong>{{ p.ratio }}:1</strong> with <EHighlight code>{{ p.name }}</EHighlight>
                <EChip :tone="tone(p.level)">{{ p.level }}</EChip>
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
          plain
          caption="Font families"
          :columns="[token, { key: 'from', label: 'From', width: 100 }, { key: 'stack', label: 'Stack' }, { key: 'sample', label: 'Sample' }]"
          :rows="[
            { id: 'sans', name: 'font-sans', from: 'fonts', stack: data.families.sans, sample: 'Your balance is due November 1.' },
            { id: 'mono', name: 'font-mono', from: 'fonts', stack: data.families.mono, sample: '$162.40, Oct 22, 2026' },
          ]"
        >
          <template #cell-name="{ row }"
            ><EHighlight code>--e-{{ row.name }}</EHighlight></template
          >
          <template #cell-sample="{ row }"
            ><span :style="{ fontFamily: `var(--e-${row.name})` }">{{ row.sample }}</span></template
          >
        </EDataGrid>
        <template v-for="g in data.typeGroups" :key="g.name">
          <h3 :id="`type-${g.name.toLowerCase().replace(/ /g, '-')}`">{{ g.name }}</h3>
          <EDataGrid
            plain
            :caption="g.name"
            :columns="[
              { key: 'name', label: 'Style', width: 190 },
              { key: 'size', label: 'Size and line', width: 230 },
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
      plain
      caption="Spacing"
      :columns="[token, value, from, usage, { key: 'size', label: 'Size', width: 160 }]"
      :rows="withFrom(data.spacing as Token[])"
    >
      <template #cell-name="{ row }"
        ><EHighlight code>--e-{{ row.name }}</EHighlight></template
      >
      <template #cell-size="{ row }"><span class="bar" :style="{ width: row.value as string }" /></template>
    </EDataGrid>

    <EDataGrid
      v-else-if="section === 'radius'"
      plain
      caption="Corner radius"
      :columns="[token, value, from, usage, { key: 'shape', label: 'Shape', width: 120 }]"
      :rows="withFrom(data.radius as Token[])"
    >
      <template #cell-name="{ row }"
        ><EHighlight code>--e-{{ row.name }}</EHighlight></template
      >
      <template #cell-shape="{ row }"><span class="box" :style="{ borderRadius: row.value as string }" /></template>
    </EDataGrid>

    <EDataGrid
      v-else-if="section === 'shadow'"
      plain
      caption="Shadows"
      :columns="[token, from, usage, { key: 'look', label: 'Look', width: 200 }]"
      :rows="withFrom(data.shadow as Token[])"
    >
      <template #cell-name="{ row }"
        ><EHighlight code>--e-{{ row.name }}</EHighlight></template
      >
      <template #cell-look="{ row }"><span class="box wide" :style="{ boxShadow: `var(--e-${row.name})`, border: 'none' }" /></template>
    </EDataGrid>

    <EDataGrid
      v-else-if="section === 'fontSize'"
      plain
      caption="Font sizes"
      :columns="[token, value, from, usage, { key: 'sample', label: 'Sample', width: 120 }]"
      :rows="withFrom(data.fontSize as Token[])"
    >
      <template #cell-name="{ row }"
        ><EHighlight code>--e-{{ row.name }}</EHighlight></template
      >
      <template #cell-sample="{ row }"
        ><span :style="{ fontSize: row.value as string, lineHeight: 1.2 }">Aa</span></template
      >
    </EDataGrid>

    <EDataGrid
      v-else
      plain
      :caption="section === 'size' ? 'Sizes' : section === 'stroke' ? 'Strokes' : section === 'motion' ? 'Motion' : 'Layers'"
      :columns="plainColumns"
      :rows="withFrom((section === 'motion' ? [...data.duration, ...data.easing] : data[section]) as Token[])"
    >
      <template #cell-name="{ row }"
        ><EHighlight code>--e-{{ row.name }}</EHighlight></template
      >
    </EDataGrid>
  </div>
</template>

<style scoped>
.swatches {
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
  width: 64px;
  height: 64px;
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
  height: 16px;
  background: var(--e-primary);
  border-radius: var(--e-radius-sm);
}
.box {
  display: block;
  width: 56px;
  height: 56px;
  border: var(--e-stroke-edge) solid var(--e-border-strong);
  background: var(--e-surface-tint);
}
.box.wide {
  width: 120px;
  background: var(--e-surface);
}
</style>
