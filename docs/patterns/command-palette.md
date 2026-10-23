---
title: Command palette
description: "Reach any page or action from the keyboard, with a button for everyone else."
aside: false
---

<script setup>
import Pattern from "./Palette.vue";
</script>

# Command palette

Built from: [`ECommandPalette`](/components/CommandPalette), [`EButton`](/components/Button), [`EKbd`](/components/Kbd), [`EDescriptionList`](/components/DescriptionList), [`EToastProvider`](/components/ToastProvider), and the layout and text components.

<div class="pattern-stage">
  <Pattern />
</div>

- Press the button, or Ctrl or Cmd with K, and type a few letters. Words match in any order and ignore case and accents. "bills" finds Statements through its `keywords`.
- Commands are plain data: `id`, `label`, an optional `group`, `icon`, `description` and `keywords`. Rebuild the list when the state changes, so the label can say "off" when it is on.
- "Pay October statement" is disabled once there is nothing due, and stays listed so people learn it exists.
- Choosing a command closes the palette, returns focus to the button, and runs `@select`. The result shows in the list below and in a toast.
- `shortcut` on an item only draws keycaps. To bind keys to the same actions, use [`useShortcuts`](/guide/composables#useshortcuts-map-options).

## Decisions

- **A button beside the shortcut.** A shortcut alone hides the feature from people who do not use one. The visible button is the way in for touch and for screen reader users who have not found the key.
- **`ECommandPalette`, not `ECombobox`.** A combobox chooses a value for a form field. The palette runs an action or moves somewhere. Swap to `ESearchResults` when the results are pages to open, not commands to run.
- **Default matching.** It covers label, description, group and keywords. Pass `score` when you need fuzzy matching or recent-first ordering, and `loading` when the commands come from a server.
- **A toast for the outcome.** The palette closes on choice, so the result needs a place to land that the person can see.

<EDisclosure title="Palette.vue">

<<< @/patterns/Palette.vue

</EDisclosure>
