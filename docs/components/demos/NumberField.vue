<script setup lang="ts">
import { ref } from "vue";
import { ENumberField, EStack, EText } from "@eos-ui/vue";

const visits = ref<number | null>(2);
const hours = ref<number | null>(1.5);
const copies = ref<number | null>(null);
</script>

<template>
  <EStack>
    <ENumberField v-model="visits" label="Visits" :min="0" :max="10" hint="Between 0 and 10." />
    <EText small muted>Booked: {{ visits ?? "none" }}</EText>
    <ENumberField v-model="hours" label="Hours" :step="0.25" suffix="h" />
    <ENumberField v-model="copies" label="Copies of statement" prefix="x" optional />
    <ENumberField label="Guests" :model-value="9" :max="8" error="Up to 8 guests per booking." />
    <ENumberField label="Rooms" :model-value="1" disabled />
    <div class="narrow">
      <ENumberField label="Narrow field" :model-value="3" />
    </div>
  </EStack>
</template>

<style scoped>
.narrow {
  max-width: 8rem;
}
</style>
