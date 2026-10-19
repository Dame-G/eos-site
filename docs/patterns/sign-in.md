---
title: Sign in
description: "Sign in with a password or a code, and choose a new password."
aside: false
---

<script setup>
import Pattern from "./SignIn.vue";
</script>

# Sign in

Built from: ESurface, EGrid, EStack, EHeading, EText, ETextField, EPasswordField, ECheckbox, ELink, EErrorSummary, EOtpField, EBackLink, EActions, EButton.

<div class="pattern-stage">
  <Pattern />
</div>

- Press Sign in with empty fields to see the error summary.
- Password rules say "met" or "not met yet" in words.
- The code field takes a pasted or autofilled code.

<EDisclosure title="SignIn.vue">

<<< @/patterns/SignIn.vue

</EDisclosure>
