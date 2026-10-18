<script setup lang="ts">
import { computed, ref } from "vue";
import { EActions, EBookingCard, EButton, ECalendar, EInline, ENotice, EPageHeader, ESlotPicker, EStack, ESurface, useLocale } from "@eos-ui/vue";

// Times that are open on each weekday (0 is Sunday). Wednesday and the weekend are closed.
const TIMES: Record<number, string[]> = {
  1: ["9:00 am", "9:30 am", "10:30 am", "1:00 pm"],
  2: ["8:30 am", "11:00 am", "2:00 pm", "3:30 pm"],
  4: ["9:30 am", "10:00 am", "4:00 pm"],
  5: ["9:00 am", "1:30 pm"],
};
const isOpen = (d: Date) => (TIMES[d.getDay()]?.length ?? 0) > 0;

const { formatLong } = useLocale();
const day = ref<Date>(new Date(2026, 9, 22, 12));
const time = ref<string | null>("9:30 am");
const booked = ref(false);

const slots = computed(() => TIMES[day.value.getDay()] ?? []);
const when = computed(() => formatLong(day.value));

function pick(d: Date | null) {
  if (!d) return;
  day.value = d;
  time.value = null; // the old time may not exist on the new day
}
</script>

<template>
  <div class="pattern" style="max-width: 760px">
    <EStack :gap="6">
      <EPageHeader :heading-level="2" title="Book a visit" description="Follow-up visit with Amara Singh, Main office" />

      <EInline align="start" :gap="6">
        <ESurface pad="md">
          <ECalendar
            :model-value="day"
            :month="day"
            :min="new Date(2026, 9, 18, 12)"
            :marked="isOpen"
            :disabled-date="(d: Date) => !isOpen(d)"
            :footer="false"
            @update:model-value="pick"
          />
        </ESurface>

        <EStack :gap="4" style="flex: 1 1 16rem">
          <ESlotPicker v-model="time" :label="`Times on ${when}`" :slots="slots" />

          <ENotice v-if="time && !booked" tone="info" :title="`${when} at ${time}`">Main office, 120 Park Street. You can reschedule up to 24 hours before.</ENotice>

          <EBookingCard
            v-if="booked && time"
            :date="day"
            :time="time"
            title="Follow-up visit"
            :provider="{ name: 'Amara Singh', role: 'Family doctor' }"
            location="Main office, 120 Park Street"
            status="confirmed"
            :heading-level="3"
          />

          <EActions>
            <EButton :disabled="!time || booked" @click="booked = true">Confirm appointment</EButton>
            <EButton variant="outline" @click="((booked = false), (time = null))">Cancel</EButton>
          </EActions>
        </EStack>
      </EInline>
    </EStack>
  </div>
</template>
