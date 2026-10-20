<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { ESelect, EVisuallyHidden } from "@eos-ui/vue";
import PresetSwatch from "./PresetSwatch.vue";
import { PRESETS, applyPreset, build, initialState } from "./state";

const props = defineProps<{
  modelValue: string;
  name: string;
  tokens?: Record<string, string>;
  select?: boolean;
}>();
const emit = defineEmits<{ select: [id: string]; random: [] }>();

interface Swatch {
  id: string;
  label: string;
  tokens: Record<string, string>;
}

const fixed: Swatch[] = PRESETS.map((p) => {
  const st = initialState();
  applyPreset(st, p.id);
  return { id: p.id, label: p.label, tokens: build(st).theme.tokens };
});

const items = computed(() => (props.modelValue === "custom" ? [...fixed, { id: "custom", label: "Custom", tokens: props.tokens ?? {} }] : fixed));
const options = computed(() => {
  const list = items.value.map((i) => ({ value: i.id, label: i.label }));
  return props.modelValue === "random" ? [...list, { value: "random", label: "Randomized" }] : list;
});
const rolled = computed(() => props.modelValue === "random");

const announced = ref("");
let timer: ReturnType<typeof setTimeout> | undefined;
function randomize() {
  emit("random");
  announced.value = "";
  clearTimeout(timer);
  timer = setTimeout(() => (announced.value = "Randomized theme"), 60);
}
function choose(id: string) {
  if (id !== "random" && id !== "custom") emit("select", id);
}
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div :class="['presets', { 'presets--select': select }]">
    <div class="presets-row">
      <div class="presets-group" role="radiogroup" aria-label="Preset">
        <label v-for="i in items" :key="i.id" class="preset">
          <input class="preset-input" type="radio" :name="name" :value="i.id" :checked="modelValue === i.id" :disabled="i.id === 'custom'" @change="choose(i.id)" />
          <span class="preset-face">
            <PresetSwatch :tokens="i.tokens" />
            {{ i.label }}
          </span>
        </label>
      </div>
      <ESelect v-if="select" class="presets-select" :model-value="modelValue" label="Preset" :options="options" @update:model-value="choose(String($event))" />
      <button type="button" class="preset preset-roll" :aria-current="rolled ? 'true' : undefined" @click="randomize">
        <span class="preset-face">
          <PresetSwatch random />
          Randomize
        </span>
      </button>
    </div>
    <div role="status"><EVisuallyHidden>{{ announced }}</EVisuallyHidden></div>
  </div>
</template>

<style scoped>
.presets-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--e-space-2);
}
.presets-group {
  display: contents;
}
.presets-select {
  display: none;
}
.preset {
  position: relative;
  display: inline-flex;
}
.preset-input {
  position: absolute;
  inset: calc(var(--e-space-1) * -1);
  margin: 0;
  opacity: 0;
  cursor: pointer;
}
.preset-roll {
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
}
.preset-roll::after {
  content: "";
  position: absolute;
  inset: calc(var(--e-space-1) * -1);
}
.preset-face {
  display: inline-flex;
  align-items: center;
  gap: var(--e-space-2);
  min-height: 2.25rem;
  padding-inline: var(--e-space-2) var(--e-space-3);
  border: var(--e-stroke-hair) solid var(--e-border);
  --e-bc: var(--e-border);
  outline: var(--e-stroke-hair) solid var(--e-bc);
  outline-offset: calc(-1 * var(--e-stroke-hair));
  border-radius: var(--e-radius-pill);
  color: var(--e-ink);
  font: 500 var(--e-text-sm) / 1 var(--e-font-sans);
  white-space: nowrap;
  transition: background-color var(--e-duration-tap) var(--e-easing-out);
}
.preset:hover .preset-face {
  background: var(--e-surface-tint);
}
.preset-input:checked + .preset-face,
.preset-roll[aria-current="true"] .preset-face {
  border-color: var(--e-primary);

  --e-bc: var(--e-primary);
  border-width: calc(var(--e-stroke-hair) * 2);
  padding-inline: calc(var(--e-space-2) - var(--e-stroke-hair)) calc(var(--e-space-3) - var(--e-stroke-hair));
  background: var(--e-surface-tint);
  font-weight: 600;
}
.preset-input:focus-visible + .preset-face,
.preset-roll:focus-visible .preset-face {
  outline: var(--e-stroke-focus) solid var(--e-focus-ring);
  outline-offset: var(--e-focus-gap);
}
.preset-roll:focus-visible {
  outline: none;
}
.preset-input:disabled + .preset-face {
  cursor: default;
}
@media (max-width: 63.999rem) {
  .presets--select .presets-row {
    flex-wrap: nowrap;
    align-items: flex-end;
  }
  .presets--select .presets-group {
    display: none;
  }
  .presets--select .presets-select {
    display: block;
    flex: 1;
    min-width: 0;
  }
  .presets--select .preset-roll {
    margin-block-end: var(--e-space-1);
  }
}
@media (prefers-reduced-motion: reduce) {
  .preset-face {
    transition: none;
  }
}
</style>
