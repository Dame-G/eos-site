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

- Narrow the window: the figures wrap by the grid's own width.
- Press the notice's button: it goes where the problem is solved.

## Decisions

- **`ESurface` cards in `EGrid`.** The grid responds to its own width, so the figures wrap in a sidebar as they do on a phone. The cards are items in a real list, and the one filled button is the next step.
- **`ENotice` first.** One thing needs attention, so it leads. More than two notices is a sign they should be a list.
- **`ETable` for recent activity.** Read-only facts in columns. Swap for `EDataGrid` once rows need sorting, filtering or selection.
- **`EProgress` for the one fraction.** "9 of 12 visits" reads faster as a bar. A plain figure suits a total that has no limit.

<EDisclosure title="Dashboard.vue">

<<< @/patterns/Dashboard.vue

</EDisclosure>
