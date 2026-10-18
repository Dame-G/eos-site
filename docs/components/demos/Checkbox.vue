<script setup lang="ts">
import { computed, ref } from "vue";
import { ECheckbox, EStack } from "@eos-ui/vue";

const agree = ref(false);
const reminders = ref(true);
const items = ref([true, false, false]);
const all = computed({
  get: () => items.value.every(Boolean),
  set: (on: boolean) => (items.value = items.value.map(() => on)),
});
const some = computed(() => items.value.some(Boolean) && !all.value);
</script>

<template>
  <EStack>
    <ECheckbox v-model="reminders" label="Email me a receipt" description="Sent to the address on your account." />
    <ECheckbox
      v-model="agree"
      label="I agree to the payment terms"
      required
      :error="agree ? undefined : 'Agree to the terms to pay $162.40.'"
    />
    <ECheckbox label="Save this card" disabled />
    <ECheckbox :model-value="true" label="Paperless statements" disabled />

    <!-- Select all with the indeterminate state -->
    <ECheckbox v-model="all" :indeterminate="some" label="All statements" />
    <ECheckbox v-model="items[0]" label="September statement" />
    <ECheckbox v-model="items[1]" label="August statement" />
    <ECheckbox v-model="items[2]" label="July statement" />
  </EStack>
</template>
