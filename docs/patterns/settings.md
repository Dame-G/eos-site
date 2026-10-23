---
title: Settings page
description: "Profile fields and switches with one Save button and a toast."
aside: false
---

<script setup>
import Pattern from "./Settings.vue";
</script>

# Settings page

Built from: [`EFieldset`](/components/Fieldset), [`ETextField`](/components/TextField), [`ESelect`](/components/Select), [`ESwitch`](/components/Switch), [`EToastProvider`](/components/ToastProvider), and the layout and text components.

<div class="pattern-stage">
  <Pattern />
</div>

- Empty the name and press Save changes to see field errors. Save valid values to see the toast.
- The switches save with the form here. A switch that takes effect at once suits a page where nothing else needs saving.
- Each section is an `EFieldset` with `section`, so a group is named for screen readers.

<EDisclosure title="Settings.vue">

<<< @/patterns/Settings.vue

</EDisclosure>
