---
title: Sign in
description: "Sign in with a password or a code, and choose a new password."
aside: false
---

<script setup>
import Pattern from "./SignIn.vue";
</script>

# Sign in

Built from: [`EForm`](/components/Form), [`ELink`](/components/Link), [`EPasswordField`](/components/PasswordField), [`EOtpField`](/components/OtpField), [`ECheckbox`](/components/Checkbox), and the layout and text components.

<div class="pattern-stage">
  <Pattern />
</div>

- Press Sign in with empty fields: the summary appears, takes focus, and each entry moves focus to its field.
- Type a new password and watch its rules say "met" or "not met yet" in words.
- Paste a six-digit code into the code field.

## Decisions

- **`EForm` checks the fields and draws the summary.** Its summary, a `danger` notice announced at once, lists what to fix. The field error stays so the message is still there while the person types. Both rules are also browser checks (`required`, `type="email"`), so `EForm` stops the first submit by itself and `@invalid` turns the words on.
- **`EPasswordField` with `mode="current"` or `"new"`.** The mode sets `autocomplete` so password managers fill or suggest. Its `rules` show a new password's requirements in words.
- **`EOtpField`, not six `ETextField`s.** One field takes a pasted or autofilled code and is announced as one input.
- **Field errors alone on a one-field form.** There, set `:summary="false"` and focus goes to the field.

<EDisclosure title="SignIn.vue">

<<< @/patterns/SignIn.vue

</EDisclosure>
