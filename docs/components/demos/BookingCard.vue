<script setup lang="ts">
import { ref } from "vue";
import { EBookingCard, EButton, EStack } from "@eos-ui/vue";

const cancelled = ref(false);
</script>

<template>
  <EStack>
    <EBookingCard
      :date="new Date(2026, 9, 22)"
      time="9:30 am"
      title="Check-up"
      :provider="{ name: 'Dr. Maya Ortiz', role: 'Family doctor' }"
      location="12 Elm Street, Suite 4"
      :status="cancelled ? 'cancelled' : 'confirmed'"
    >
      <template #actions>
        <EButton variant="outline" :disabled="cancelled" @click="cancelled = true">Cancel visit</EButton>
        <EButton variant="quiet" :disabled="!cancelled" @click="cancelled = false">Undo</EButton>
      </template>
    </EBookingCard>
    <!-- No provider: the date tile leads -->
    <EBookingCard
      :date="new Date(2026, 10, 3)"
      time="2:00 pm"
      title="Leo's flu shot"
      subtitle="Bring the insurance card"
      status="scheduled"
      :heading-level="2"
    />
  </EStack>
</template>
