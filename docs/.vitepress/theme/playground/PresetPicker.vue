<script setup lang="ts">
import { computed, h, onBeforeUnmount, ref, type FunctionalComponent } from "vue";
import { EButton } from "@eos-ui/vue/components/EButton";
import { ESelect } from "@eos-ui/vue/components/ESelect";
import { EVisuallyHidden } from "@eos-ui/vue/components/EVisuallyHidden";
import PresetSwatch from "./PresetSwatch.vue";
import { build } from "./build";
import { initialState } from "./model";
import { PRESETS, applyPreset } from "./presets";

const props = defineProps<{
  modelValue: string;
  tokens?: Record<string, string>;
}>();
const emit = defineEmits<{ select: [id: string]; random: [] }>();

/** A preview of a theme, as an icon: the options take any icon component. */
const swatch = (tokens?: Record<string, string>, random?: boolean): FunctionalComponent => () => h(PresetSwatch, { tokens, random });

const fixed = PRESETS.map((p) => {
  const st = initialState();
  applyPreset(st, p.id);
  return { value: p.id, label: p.label, icon: swatch(build(st).theme.tokens) };
});
const random = swatch(undefined, true);

const options = computed(() => {
  const list = [...fixed];
  if (props.modelValue === "custom") list.push({ value: "custom", label: "Custom", icon: swatch(props.tokens) });
  if (props.modelValue === "random") list.push({ value: "random", label: "Randomized", icon: random });
  return list;
});

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
  <div class="presets">
    <ESelect class="presets-select" :model-value="modelValue" label="Preset" :options="options" @update:model-value="choose(String($event))" />
    <EButton variant="outline" :icon="random" @click="randomize">Randomize</EButton>
    <div role="status"><EVisuallyHidden>{{ announced }}</EVisuallyHidden></div>
  </div>
</template>

<style scoped>
.presets {
  display: flex;
  align-items: flex-end;
  gap: var(--e-space-3);
}
.presets-select {
  flex: 1;
  min-width: 0;
  max-width: 24rem;
}
</style>
