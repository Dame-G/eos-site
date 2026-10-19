---
title: Schedule a visit
description: "Choose a day and a time, then see the booking."
aside: false
---

<script setup>
import Pattern from "./ScheduleVisit.vue";
</script>

# Schedule a visit

Built from: EPageHeader, ECalendar, ESlotPicker, ENotice, EBookingCard, ESurface, EInline, EStack, EActions, EButton.

<div class="pattern-stage">
  <Pattern />
</div>

- Days with a dot have times open. Wednesdays and weekends are closed and skipped by the arrow keys.
- Choosing another day clears the time.

<EDisclosure title="ScheduleVisit.vue">

<<< @/patterns/ScheduleVisit.vue

</EDisclosure>
