<script setup lang="ts">
import { ref } from "vue";
import { ECombobox, EStack, EText } from "@eos-ui/vue";

const practitioner = ref("");
const clinic = ref("");
const street = ref("");
const ways = ref<string[]>(["Text", "Email"]);
const streets = ["12 Elm Street", "12 Elmwood Avenue", "120 Harbour Road"];
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
    <ECombobox clearable v-model="practitioner" label="Practitioner" placeholder="Type to search" :options="people" hint="Only listed names are accepted." />
    <EText size="sm" tone="muted">Value: {{ practitioner || "none" }}</EText>
    <ECombobox clearable v-model="clinic" label="Clinic" :options="found" :loading="searching" :filter="() => true" @input-change="search" />
    <ECombobox clearable label="Visit type" :options="['Checkup', 'Follow-up']" error="Choose a visit type." required />
    <ECombobox clearable label="Region" :options="['North', 'South']" disabled />
    <ECombobox clearable v-model="street" freeform label="Street" autocomplete="address-line1" placeholder="Start typing" hint="Pick a suggestion or type your own." :options="streets" />
    <EText size="sm" tone="muted">Text: {{ street || "nothing yet" }}</EText>
    <ECombobox clearable v-model="ways" multiple label="Remind me by" :options="['Text', 'Email', 'Call', 'Post']" hint="Choose as many as you like." />
    <EText size="sm" tone="muted">Chosen: {{ ways.join(", ") || "none" }}</EText>
    <ECombobox clearable multiple label="Locked choices" :model-value="['Email']" :options="['Text', 'Email']" disabled />
  </EStack>
</template>
