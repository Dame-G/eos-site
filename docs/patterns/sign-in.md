---
title: Sign in
description: "Sign in with a password or a code, and choose a new password with its rules shown in words."
aside: false
---

<script setup>
import Pattern from "./SignIn.vue";
</script>

# Sign in

Sign in with a password or a code, and choose a new password with its rules shown in words.

**Built from:** ESurface, EGrid, EStack, EHeading, ETextField, EPasswordField, ECheckbox, ELink, EErrorSummary, EOtpField, EBackLink, EActions, EButton.

<div class="pattern-stage">
  <Pattern />
</div>

## Notes

- A failed submit shows an error summary at the top and each field's own message beside it. Try pressing Sign in with the fields empty.
- Password rules are a checklist that says "met" or "not met yet" in words, so colour is never the only signal.
- The code field has one box per character, takes a pasted or autofilled code, and the verify button waits for all six.
- `autocomplete` tokens (`username`, `current-password`, `new-password`, `one-time-code`) let browsers and password managers help.

## Source

::: details SignIn.vue
<<< @/patterns/SignIn.vue
:::
