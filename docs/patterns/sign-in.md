---
title: Sign in
description: "Sign in with a password or a code, and choose a new password."
aside: false
---

<script setup>
import Pattern from "./SignIn.vue";
</script>

# Sign in

Built from: [`ESurface`](/components/Surface), [`EGrid`](/components/Grid), [`EStack`](/components/Stack), [`EHeading`](/components/Heading), [`EText`](/components/Text), [`ETextField`](/components/TextField), [`EPasswordField`](/components/PasswordField), [`ECheckbox`](/components/Checkbox), [`ELink`](/components/Link), [`EOtpField`](/components/OtpField), [`EActions`](/components/Actions), [`EButton`](/components/Button).

<div class="pattern-stage">
  <Pattern />
</div>

- Press Sign in with empty fields to see the error summary.
- Password rules say "met" or "not met yet" in words.
- The code field takes a pasted or autofilled code.

<EDisclosure title="SignIn.vue">

<<< @/patterns/SignIn.vue

</EDisclosure>
