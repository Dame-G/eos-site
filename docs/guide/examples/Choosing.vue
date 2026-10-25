<script setup lang="ts">
import { ref } from "vue";
import { ECombobox, ERadioGroup, ESegmented, ESelect, EStack } from "@eos-ui/vue";

const radio = ref("card");
const select = ref("");
const view = ref("all");
const clinic = ref("");
</script>

<template>
  <EStack gap="section">
    <ERadioGroup
      v-model="radio"
      label="Pay with"
      :options="[{ value: 'card', label: 'Card' }, { value: 'bank', label: 'Bank account' }, { value: 'cash', label: 'Cash' }]"
    />
    <ESegmented
      v-model="view"
      label="Show"
      :options="[{ value: 'all', label: 'All' }, { value: 'due', label: 'Needs payment' }, { value: 'paid', label: 'Paid' }]"
    />
    <ESelect v-model="select" label="Branch" :options="['Downtown', 'Harbour', 'Northside', 'Online', 'Uptown', 'Westend']" />
    <ECombobox clearable v-model="clinic" label="Clinic" placeholder="Type to search" :options="['Downtown Clinic', 'Harbour Clinic', 'Northside Clinic']" />
  </EStack>
</template>
