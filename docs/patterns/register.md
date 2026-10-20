---
title: Register
description: "A multi-step form with a stepper, an error summary and a review step."
aside: false
---

<script setup>
import Pattern from "./Register.vue";
</script>

# Register

Built from: EStepper, EFieldset, ETextField, EDatePicker, EPhoneField, ESelect, ERadioGroup, ESignatureField, EDescriptionList, ENotice, EStack, EActions, EButton.

<div class="pattern-stage">
  <Pattern />
</div>

- Press Continue on an empty first step to see the error summary.
- Only the first step has rules. The same computed error list works for every step.

<EDisclosure title="Register.vue">

<<< @/patterns/Register.vue

</EDisclosure>
