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

- Press Remove to open the confirmation. Focus moves to the dialog and returns to Remove when it closes. Escape and Keep card cancel.
- The question names the thing ("Remove Visa ending 4242?"), and the red button repeats the verb ("Remove card"). "OK" and "Yes" make people read the question again.
- The dialog has `role="alertdialog"`, so a screen reader reads the description straight away.
- After the removal a toast says what happened and offers Undo. Use Undo when putting the thing back is cheap. When it is not, say so in the dialog description and skip Undo.
- Do not ask twice. A confirmation for every row of a bulk action trains people to click through. See the [bulk version](/patterns/data-table).

## Decisions

- **`EDialog` with `role="alertdialog"`, not `ENotice`.** A notice stays on the page and can be ignored. A removal needs an answer, and the dialog keeps focus until it gets one.
- **Not a browser `confirm()`.** It cannot be styled, translated or named for the action, and it blocks the page.
- **The danger button comes first and says the verb.** Swap `variant="danger"` for the default button when the action is reversible and you only want a pause.
- **Undo in a toast, not a second dialog.** A toast with an action sits where the eye already is and goes by itself. Swap it for `ENotice` when the message must stay until it is read.

<EDisclosure title="ConfirmDestructive.vue">

<<< @/patterns/ConfirmDestructive.vue

</EDisclosure>
