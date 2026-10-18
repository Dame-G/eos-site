<script setup lang="ts">
import { ref } from "vue";
import { ESwitch, EStack } from "@eos-ui/vue";

const reminders = ref(true);
const autopay = ref(false);
</script>

<template>
  <EStack>
    <ESwitch v-model="reminders" label="Text reminders" description="The day before a visit." />
    <ESwitch v-model="autopay" label="Autopay" description="Pay each statement on its due date." />
    <p>Reminders are {{ reminders ? "on" : "off" }}. Autopay is {{ autopay ? "on" : "off" }}.</p>
    <ESwitch :model-value="false" label="Paper statements" disabled />
    <ESwitch :model-value="true" label="Sign-in alerts" disabled />
  </EStack>
</template>
