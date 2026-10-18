<script setup lang="ts">
import { EChip } from "@eos-ui/vue";
// @ts-expect-error a build-time data loader (docs/data/tokens.data.js)
import { data } from "../../data/tokens.data.js";

defineProps<{
  section: "colour" | "type" | "spacing" | "radius" | "shadow" | "fontSize" | "size" | "stroke" | "motion" | "zIndex";
}>();

type Partner = { name: string; value: string; role: string; ratio: number; level: string };

function tone(level: string) {
  if (level === "AAA" || level === "AA") return "success";
  if (level.startsWith("3:1")) return "info";
  if (level.startsWith("Large")) return "warning";
  return "danger";
}
// Text colours show the word "Aa" in the colour of the pair, so the pair can be read at a glance.
const isText = (p: Partner) => !/non-text|Decoration/.test(p.role);
</script>

<template>
  <div class="tokens">
    <template v-if="section === 'colour'">
      <ul class="swatches">
        <li v-for="c in data.colours" :key="c.name" :id="`color-${c.name}`" class="swatch">
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
              <code>--e-{{ c.name }}</code> <span class="hex">{{ c.source.startsWith("{") ? "= " + c.value : c.value }}</span>
            </p>
            <p class="usage">{{ c.usage }}</p>
            <ul v-if="c.partners.length" class="pairs">
              <li v-for="p in c.partners" :key="p.name">
                <strong>{{ p.ratio }}:1</strong> with <code>{{ p.name }}</code>
                <EChip :tone="tone(p.level)">{{ p.level }}</EChip>
                <span class="role">{{ p.role }}</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </template>

    <template v-else-if="section === 'type'">
      <p>
        Two families. <strong>Sans</strong> for reading, <strong>mono</strong> for kickers, chips, stamps and every amount, number and date. Fonts are
        never bundled: load them yourself or import <code>@eos-ui/vue/fonts.css</code>.
      </p>
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Stack</th>
            <th>Sample</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>--e-font-sans</code></td>
            <td>{{ data.families.sans }}</td>
            <td style="font-family: var(--e-font-sans)">Your balance is due November 1.</td>
          </tr>
          <tr>
            <td><code>--e-font-mono</code></td>
            <td>{{ data.families.mono }}</td>
            <td style="font-family: var(--e-font-mono)">$162.40, Oct 22, 2026</td>
          </tr>
        </tbody>
      </table>
      <div v-for="g in data.typeGroups" :key="g.name">
        <h3 :id="`type-${g.name.toLowerCase().replace(/ /g, '-')}`">{{ g.name }}</h3>
        <table>
          <thead>
            <tr>
              <th>Style</th>
              <th>Size and line</th>
              <th>Used for</th>
              <th>Sample</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in g.styles" :key="s.name">
              <td>
                <code>{{ s.name }}</code>
              </td>
              <td>{{ s.fontSize }} / {{ s.lineHeight }}, weight {{ s.fontWeight }}</td>
              <td>{{ s.usage }}</td>
              <td>
                <span
                  :style="{
                    fontFamily: g.family === 'mono' ? 'var(--e-font-mono)' : 'var(--e-font-sans)',
                    fontSize: s.fontSize,
                    lineHeight: s.lineHeight,
                    fontWeight: s.fontWeight,
                  }"
                  >{{ s.sample }}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <table v-else-if="section === 'spacing'">
      <thead>
        <tr>
          <th>Token</th>
          <th>Value</th>
          <th>Used for</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in data.spacing" :key="t.name">
          <td>
            <code>--e-{{ t.name }}</code>
          </td>
          <td>{{ t.value }}</td>
          <td>{{ t.usage }}</td>
          <td><span class="bar" :style="{ width: t.value }" /></td>
        </tr>
      </tbody>
    </table>

    <table v-else-if="section === 'radius'">
      <thead>
        <tr>
          <th>Token</th>
          <th>Value</th>
          <th>Used for</th>
          <th>Shape</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in data.radius" :key="t.name">
          <td>
            <code>--e-{{ t.name }}</code>
          </td>
          <td>{{ t.value }}</td>
          <td>{{ t.usage }}</td>
          <td><span class="box" :style="{ borderRadius: t.value }" /></td>
        </tr>
      </tbody>
    </table>

    <table v-else-if="section === 'shadow'">
      <thead>
        <tr>
          <th>Token</th>
          <th>Used for</th>
          <th>Look</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in data.shadow" :key="t.name">
          <td>
            <code>--e-{{ t.name }}</code>
          </td>
          <td>{{ t.usage }}</td>
          <td><span class="box wide" :style="{ boxShadow: `var(--e-${t.name})`, border: 'none' }" /></td>
        </tr>
      </tbody>
    </table>

    <table v-else-if="section === 'fontSize'">
      <thead>
        <tr>
          <th>Token</th>
          <th>Value</th>
          <th>Used for</th>
          <th>Sample</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in data.fontSize" :key="t.name">
          <td>
            <code>--e-{{ t.name }}</code>
          </td>
          <td>{{ t.value }}</td>
          <td>{{ t.usage }}</td>
          <td>
            <span :style="{ fontSize: t.value, lineHeight: 1.2 }">Aa</span>
          </td>
        </tr>
      </tbody>
    </table>

    <table v-else-if="section === 'size' || section === 'stroke' || section === 'motion' || section === 'zIndex'">
      <thead>
        <tr>
          <th>Token</th>
          <th>Value</th>
          <th>Used for</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in section === 'motion' ? [...data.duration, ...data.easing] : data[section]" :key="t.name">
          <td>
            <code>--e-{{ t.name }}</code>
          </td>
          <td>{{ t.value }}</td>
          <td>{{ t.usage }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.swatches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 24rem), 1fr));
  gap: var(--e-space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}
.swatch {
  display: flex;
  gap: var(--e-space-3);
  align-items: flex-start;
  margin: 0;
  padding: var(--e-space-3);
  border: var(--e-stroke-hair) solid var(--e-border);
  border-radius: var(--e-radius-md);
  background: var(--e-surface);
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
.meta .usage {
  margin-top: var(--e-space-1);
  font-size: var(--e-text-sm);
  line-height: 1.4;
  color: var(--e-muted);
}
.name {
  font-size: var(--e-text-sm);
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
