<script setup lang="ts">
import { ref } from "vue";
import { EList, EListRow, EStack, EText } from "@eos-ui/vue";

const games = [
  { id: "g1", players: "You vs Dameless", when: "Today, 5+3", live: true },
  { id: "g2", players: "You vs Maya Chen", when: "Yesterday, 10+0" },
  { id: "g3", players: "You vs Stockfish level 4", when: "Oct 22, 2026, 15+10" },
  { id: "g4", players: "You vs Omar Haddad", when: "Oct 19, 2026, 3+2", disabled: true },
];

const open = ref<string | number | null>("g2");
const picked = ref<string | number | null>("g1");
</script>

<template>
  <EStack gap="section">
    <EStack>
      <EList v-model="open" label="Games">
        <EListRow v-for="g in games" :key="g.id" :value="g.id" :title="g.players" :subtitle="g.when" :live="g.live" :disabled="g.disabled" />
      </EList>
      <EText size="sm" tone="muted">Open game: {{ open }}.</EText>
    </EStack>

    <EStack>
      <EList v-model="open" label="Games, flush" flush>
        <EListRow v-for="g in games" :key="g.id" :value="g.id" :title="g.players" :subtitle="g.when" :disabled="g.disabled" />
      </EList>
    </EStack>

    <EStack>
      <EList v-model="picked" label="Games to review" mode="select">
        <EListRow v-for="g in games" :key="g.id" :value="g.id" :title="g.players" :subtitle="g.when" :disabled="g.disabled" />
      </EList>
      <EText size="sm" tone="muted">Selected: {{ picked }}.</EText>
    </EStack>
  </EStack>
</template>
