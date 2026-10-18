---
title: Schedule a visit
description: "Choose a day and a time, then see the booking."
aside: false
---

<script setup>
import Pattern from "./ScheduleVisit.vue";
</script>

# Schedule a visit

Choose a day and a time, then see the booking.

**Built from:** EPageHeader, ECalendar, ESlotPicker, ENotice, EBookingCard, ESurface, EInline, EStack, EActions, EButton.

<div class="pattern-stage">
  <Pattern />
</div>

## Notes

- Days with a dot have times open. Wednesdays and weekends are closed, so they are faded and skipped by the arrow keys.
- Choosing a different day clears the time, because the old time may not exist on the new day.
- The calendar and the times are separate controls, so each has its own label and keyboard use.

## Source

::: details ScheduleVisit.vue
<<< @/patterns/ScheduleVisit.vue
:::
