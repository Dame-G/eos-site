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

## Decisions

- **One Save for the page.** Switches here save with the form, so there is a single place to confirm. Let a switch act at once when nothing else on the page needs saving.
- **`EFieldset` with `section`.** The group is named for screen readers and gets a heading in the page's outline.
- **A toast for the confirmation.** The person stays on the page, so a message that goes by itself is enough. Use `ENotice` if the save can fail in a way that needs a decision.
- **`ESwitch`, not `ECheckbox`.** A switch is a setting that is on or off. A checkbox is an item in a set, or an agreement.

<EDisclosure title="Settings.vue">

<<< @/patterns/Settings.vue

</EDisclosure>
