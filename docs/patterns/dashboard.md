---
title: Dashboard overview
description: "A summary page: a notice, key figures and recent activity."
aside: false
---

<script setup>
import Pattern from "./Dashboard.vue";
</script>

# Dashboard overview

Built from: [`EGrid`](/components/Grid), [`ESurface`](/components/Surface), [`EProgress`](/components/Progress), [`ENotice`](/components/Notice), [`ETable`](/components/Table), and the layout and text components.

<div class="pattern-stage">
  <Pattern />
</div>

- Key figures are `ESurface` cards in an `EGrid`, so they wrap by the grid's own width, not the screen's.
- The cards are items in a real list. The one filled button is the next step.
- The notice has a button that goes where the problem is solved.

<EDisclosure title="Dashboard.vue">

<<< @/patterns/Dashboard.vue

</EDisclosure>
