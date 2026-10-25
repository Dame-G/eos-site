---
title: Confirm a destructive action
description: "Ask before removing something, name the button for what it does, and offer Undo after."
aside: false
---

<script setup>
import Pattern from "./ConfirmDestructive.vue";
</script>

# Confirm a destructive action

Built from: [`EDialog`](/components/Dialog), [`EButton`](/components/Button), [`EToastProvider`](/components/ToastProvider), [`ESurface`](/components/Surface), [`EDescriptionList`](/components/DescriptionList), [`EStamp`](/components/Stamp), and the layout and text components.

<div class="pattern-stage">
  <Pattern />
</div>

- Press Remove: focus moves to the dialog. Press Escape or Keep card, and focus returns to Remove.
- Confirm, then press Undo in the toast to put the card back.

## Decisions

- **`EDialog` with `role="alertdialog"`, not `ENotice`.** A notice stays on the page and can be ignored. A removal needs an answer, and the dialog keeps focus until it gets one. A screen reader reads its description straight away.
- **Name the thing and the verb.** The question names it ("Remove Visa ending 4242?") and the red button repeats the verb ("Remove card"). "OK" and "Yes" make people read the question again.
- **Ask once.** A confirmation for every row of a bulk action trains people to click through. See the [bulk version](/patterns/data-table).
- **Not a browser `confirm()`.** It cannot be styled, translated or named for the action, and it blocks the page.
- **The danger button comes first and says the verb.** Swap `variant="danger"` for the default button when the action is reversible and you only want a pause.
- **Undo in a toast, not a second dialog.** A toast with an action sits where the eye already is. Offer Undo when putting the thing back is cheap; when it is not, say so in the dialog description and skip it. Swap the toast for `ENotice` when the message must stay until it is read.

<EDisclosure title="ConfirmDestructive.vue">

<<< @/patterns/ConfirmDestructive.vue

</EDisclosure>
