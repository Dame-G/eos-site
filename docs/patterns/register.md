---
title: Register
description: "A multi-step form with a stepper, field errors and a review step."
aside: false
---

<script setup>
import Pattern from "./Register.vue";
</script>

# Register

Built from: [`EStepper`](/components/Stepper), [`EFieldset`](/components/Fieldset), [`EDatePicker`](/components/DatePicker), [`EPhoneField`](/components/PhoneField), [`ESignatureField`](/components/SignatureField), and the layout and text components.

<div class="pattern-stage">
  <Pattern />
</div>

- Press Continue on an empty first step to see the field errors.
- Only the first step has rules. The same computed error list works for every step.

## Decisions

- **`EStepper` with one step on screen at a time.** Continue checks the step before moving on, so the person never faces errors on a page they have not seen. Use a single page when there are fewer than about eight fields.
- **`EFieldset` for each group.** It names the group for screen readers. Swap to `ESurface` only when the group needs no name.
- **`EDatePicker` and `EPhoneField`, not `ETextField`.** They parse and format with the configured locale and keep the typed value usable. Use `ETextField` for names and free text.
- **`ESignatureField` on its own step.** Typing a name is the signature, so it gets a step and a hint that says so, after the details it covers.

<EDisclosure title="Register.vue">

<<< @/patterns/Register.vue

</EDisclosure>
