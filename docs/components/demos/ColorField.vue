<script setup lang="ts">
import { ref } from "vue";
import { EColorField, EStack } from "@eos-ui/vue";

const brand = ref("#2c95b4");
</script>

<template>
  <EStack>
    <EColorField v-model="brand" label="Brand colour" hint="Pick a colour or type a hex value." />
    <p>Chosen: {{ brand }}</p>
    <EColorField label="Accent colour" model-value="#72c451" optional />
    <EColorField label="Card edge" model-value="#7f8f96" error="This pair does not reach 3:1 on white." />
    <EColorField label="Locked colour" model-value="#17586d" disabled />
  </EStack>
</template>
