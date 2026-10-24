<script setup lang="ts">
import { ref } from "vue";
import { EField, ESelect, EStack } from "@eos-ui/vue";

const pharmacy = ref("");
const PHARMACIES = ["Main Street Pharmacy", "Riverside Drugs", "Hillcrest Chemist"];
</script>

<template>
  <EStack>
    <EField label="Preferred pharmacy" hint="We send the prescription here." v-slot="{ id, ariaInvalid, ariaDescribedby }">
      <ESelect :id="id" v-model="pharmacy" bare label="Preferred pharmacy" :options="PHARMACIES" :aria-invalid="ariaInvalid" :aria-describedby="ariaDescribedby" />
    </EField>
  </EStack>
</template>
