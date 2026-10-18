<script setup lang="ts">
import { EField, EStack } from "@eos-ui/vue";
</script>

<template>
  <EStack>
    <EField label="Preferred pharmacy" hint="We send the prescription here." v-slot="{ id, ariaInvalid, ariaDescribedby }">
      <input :id="id" class="e-input" :aria-invalid="ariaInvalid" :aria-describedby="ariaDescribedby" />
    </EField>
  </EStack>
</template>
