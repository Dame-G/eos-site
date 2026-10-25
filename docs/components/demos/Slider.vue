<script setup lang="ts">
import { ref } from "vue";
import { EStack, ESlider, EText } from "@eos-ui/vue";

const volume = ref(40);
const price = ref<[number, number]>([100, 300]);
const rating = ref(3);
</script>

<template>
  <EStack>
    <ESlider v-model="volume" label="Volume" :step="5" hint="Arrow keys move by 5, Page Up and Down by 50." />
    <ESlider v-model="price" label="Price" range :min="0" :max="500" :step="10" :value-text="(v) => `$${v}`" />
    <EText>Between ${{ price[0] }} and ${{ price[1] }}</EText>
    <ESlider v-model="rating" label="Rating" :min="1" :max="5" marks :value-text="(v) => `${v} of 5`" />
    <ESlider :model-value="60" label="Read-only" readonly />
    <ESlider :model-value="20" label="Disabled" disabled />
  </EStack>
</template>
