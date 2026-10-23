<script setup lang="ts">
import { EButton, EColorField, EDisclosure, EStack, EText, ETextField } from "@eos-ui/vue";
import type { DerivedToken } from "./build";
import { resolve } from "./contrast";

const props = defineProps<{
  title: string;
  items: DerivedToken[];
  tokens: Record<string, string>;
  overridden: Record<string, string>;
  colour?: boolean;
}>();
const emit = defineEmits<{ set: [name: string, value: string]; follow: [name: string] }>();

const hexOf = (name: string) => {
  const v = resolve(props.tokens, name);
  return /^#[0-9a-f]{6}$/i.test(v) ? v : null;
};
</script>

<template>
  <EDisclosure :title="title">
    <EStack :gap="4">
      <EText small muted>Each follows the input named under it. Set one by hand and it stops following.</EText>
      <div v-for="item in items" :key="item.name" class="row">
        <EColorField
          v-if="colour && hexOf(item.name)"
          :label="item.name"
          :hint="`Follows ${item.from}`"
          :model-value="hexOf(item.name)!"
          @update:model-value="emit('set', item.name, $event)"
        />
        <ETextField
          v-else
          :label="item.name"
          :hint="`Follows ${item.from}`"
          :model-value="tokens[item.name]"
          spellcheck="false"
          @update:model-value="emit('set', item.name, String($event))"
        />
        <EButton v-if="item.name in overridden" variant="quiet" @click="emit('follow', item.name)">Follow again</EButton>
      </div>
    </EStack>
  </EDisclosure>
</template>

<style scoped>
.row {
  display: grid;
  gap: var(--e-space-2);
  justify-items: start;
}
.row > :first-child {
  justify-self: stretch;
}
</style>
