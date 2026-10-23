<script setup lang="ts">
import { ref } from "vue";
import { ECheckboxGroup, EStack, EText } from "@eos-ui/vue";

const channels = ref<string[]>(["Email"]);
</script>

<template>
  <EStack>
    <ECheckboxGroup
      v-model="channels"
      label="How should we reach you?"
      hint="Choose any that suit you."
      :options="['Email', 'Text', { value: 'post', label: 'Post', description: 'Statements only.' }]"
    />
    <EText small muted>Chosen: {{ channels.length ? channels.join(", ") : "none" }}</EText>
  </EStack>
</template>
