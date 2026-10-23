---
title: Sign in
description: "Sign in with a password or a code, and choose a new password."
aside: false
---

<script setup>
import Pattern from "./SignIn.vue";
</script>

# Sign in

Built from: [`ENotice`](/components/Notice), [`ELink`](/components/Link), [`EPasswordField`](/components/PasswordField), [`EOtpField`](/components/OtpField), [`ECheckbox`](/components/Checkbox), and the layout and text components.

<div class="pattern-stage">
  <Pattern />
</div>

- Press Sign in with empty fields to see the error summary and the field errors. Each entry in the summary moves focus to its field, and focus starts on the first.
- Password rules say "met" or "not met yet" in words.
- The code field takes a pasted or autofilled code.

## Decisions

- **Error summary above the form, field errors beside the controls.** The summary lists what to fix and each entry moves focus to its field. The field error stays so the message is still there while the person types.
- **`EPasswordField` with `mode="current"` or `"new"`.** The mode sets `autocomplete` so password managers fill or suggest. Its `rules` show a new password's requirements in words.
- **`EOtpField`, not six `ETextField`s.** One field takes a pasted or autofilled code and is announced as one input.
- **`ENotice` for the summary.** A `danger` notice is announced at once. Swap for inline field errors alone on a single-field form.

<EDisclosure title="SignIn.vue">

<<< @/patterns/SignIn.vue

</EDisclosure>
