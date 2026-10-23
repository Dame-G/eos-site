---
title: Register
description: "A multi-step form with a stepper, an error summary and a review step."
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

- Press Continue on an empty first step to see the error summary.
- Only the first step has rules. The same computed error list works for every step.

<EDisclosure title="Register.vue">

<<< @/patterns/Register.vue

</EDisclosure>
