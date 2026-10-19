<script setup lang="ts">
import { ref } from "vue";
import { ECalendar, EGrid, EStack, EText } from "@eos-ui/vue";

const oct = new Date(2026, 9, 1, 12);
const visit = ref<Date | null>(new Date(2026, 9, 22, 12));
const from = ref<Date | null>(null);
const to = ref<Date | null>(null);
const openDays = [new Date(2026, 9, 20, 12), new Date(2026, 9, 22, 12), new Date(2026, 9, 27, 12)];
const show = (d: Date | null) => (d ? d.toDateString() : "none");
</script>

<template>
  <EGrid>
    <EStack>
      <EText variant="small" muted>Visit day: {{ show(visit) }}</EText>
      <ECalendar
        v-model="visit"
        :month="oct"
        :min="new Date(2026, 9, 5, 12)"
        :max="new Date(2026, 11, 31, 12)"
        :disabled-date="(d) => d.getDay() === 0"
        :marked="openDays"
        mark-label="times available"
        @clear="visit = null"
      />
    </EStack>
    <EStack>
      <EText variant="small" muted>Stay: {{ show(from) }} to {{ show(to) }}</EText>
      <ECalendar mode="range" v-model:start="from" v-model:end="to" :month="oct" :footer="false" />
    </EStack>
  </EGrid>
</template>
