<script setup lang="ts">
import { EButton, EConfigProvider, EDatePicker, EStack, ESurface, EText } from "@eos-ui/vue";
import { ref } from "vue";

const visit = ref<Date | null>(new Date(2026, 9, 22));
</script>

<template>
  <EStack>
    <EConfigProvider :theme="{ brand: '#8a2be2' }" scheme="dark">
      <ESurface>
        <EStack gap="base">
          <EText>A dark panel in another brand colour, on whatever page it sits on.</EText>
          <EButton>Pay $162.40</EButton>
        </EStack>
      </ESurface>
    </EConfigProvider>
    <EConfigProvider locale="en-GB" currency="GBP">
      <EDatePicker v-model="visit" label="Visit date" hint="Day first, as in the UK." />
    </EConfigProvider>
  </EStack>
</template>
