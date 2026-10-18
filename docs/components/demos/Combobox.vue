<script setup lang="ts">
import { ref } from "vue";
import { ECombobox, EStack } from "@eos-ui/vue";

const practitioner = ref("");
const clinic = ref("");
const people = [
  { value: "amara", label: "Amara Singh", description: "Family doctor" },
  { value: "marcus", label: "Marcus Webb", description: "Physiotherapist" },
  { value: "priya", label: "Priya Nair", description: "Dentist" },
];
const all = ["Downtown Clinic", "Harbour Clinic", "Northside Clinic"];
const found = ref<string[]>([]);
const searching = ref(false);
function search(text: string) {
  searching.value = true;
  found.value = [];
  setTimeout(() => {
    found.value = all.filter((c) => c.toLowerCase().includes(text.toLowerCase()));
    searching.value = false;
  }, 600);
}
</script>

<template>
  <EStack>
    <ECombobox v-model="practitioner" label="Practitioner" placeholder="Type to search" :options="people" hint="Only listed names are accepted." />
    <p>Value: {{ practitioner || "none" }}</p>
    <!-- The server filters, so the local filter lets everything through -->
    <ECombobox v-model="clinic" label="Clinic" :options="found" :loading="searching" :filter="() => true" @input-change="search" />
    <ECombobox label="Visit type" :options="['Checkup', 'Follow-up']" error="Choose a visit type." required />
    <ECombobox label="Region" :options="['North', 'South']" disabled />
  </EStack>
</template>
