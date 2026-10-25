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

- Press the button, or Ctrl or Cmd with K, and type a few letters in any order: "bills" finds Statements through its `keywords`.
- Choose a command: the palette closes, focus returns to the button, and the result shows below and in a toast.
- Pay the October statement, then open the palette again: the command is still listed, but disabled.

## Decisions

- **A button beside the shortcut.** A shortcut alone hides the feature from people who do not use one. The visible button is the way in for touch and for screen reader users who have not found the key.
- **`ECommandPalette`, not `ECombobox`.** A combobox chooses a value for a form field. The palette runs an action or moves somewhere. Swap to `ESearchResults` when the results are pages to open, not commands to run.
- **Commands as plain data.** `id`, `label`, an optional `group`, `icon`, `description` and `keywords`. Rebuild the list when the state changes, so a label can say "off" when it is on, and keep a command that does not apply listed but disabled, so people learn it exists.
- **Default matching.** Words match in any order and ignore case and accents, across label, description, group and keywords. Pass `score` when you need fuzzy matching or recent-first ordering, and `loading` when the commands come from a server.
- **`shortcut` only draws keycaps.** To bind keys to the same actions, use [`useShortcuts`](/guide/composables#useshortcuts-map-options).
- **A toast for the outcome.** The palette closes on choice, so the result needs a place to land that the person can see.

<EDisclosure title="Palette.vue">

<<< @/patterns/Palette.vue

</EDisclosure>
