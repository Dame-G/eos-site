<script setup lang="ts">
import { computed, ref } from "vue";
import { ECellRow, EList, EStack, EText } from "@eos-ui/vue";

const moves = [
  { n: "1.", white: "e4", black: "e5" },
  { n: "2.", white: "Nf3", black: "Nc6" },
  { n: "3.", white: "Bb5", black: "a6" },
  { n: "4.", white: "Ba4", black: "Nf6" },
  { n: "5.", white: "O-O", black: "" },
];
const rows = computed(() =>
  moves.map((m) => ({
    n: m.n,
    cells: [
      { value: `${m.n}w`, label: m.white },
      ...(m.black ? [{ value: `${m.n}b`, label: m.black }] : []),
    ],
  })),
);
const ply = ref<string | number | null>("2.w");
</script>

<template>
  <EStack>
    <EList v-model="ply" label="Moves" follow-focus>
      <ECellRow v-for="row in rows" :key="row.n" :label="row.n" :cells="row.cells" :columns="2" />
    </EList>
    <EText size="sm" tone="muted">Position after {{ ply ?? "the start" }}. Arrow keys step through the moves.</EText>
  </EStack>
</template>
