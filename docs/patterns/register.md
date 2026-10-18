---
title: Register
description: "A multi-step form with a stepper, an error summary and a review step."
aside: false
---

<script setup>
import Pattern from "./Register.vue";
</script>

# Register

A multi-step form with a stepper, an error summary and a review step.

**Built from:** EStepper, EFormSection, ETextField, EDatePicker, EPhoneField, EAddressField, ERadioGroup, ESignatureField, EDescriptionList, EErrorSummary, EActions, EButton.

<div class="pattern-stage">
  <Pattern />
</div>

## Notes

- Press Continue with the first step empty to see the error summary and the field errors.
- Steps are named by what the person does, not by number. The stepper marks the current step with more than colour.
- Only the first step has rules here. The same shape (a computed list of errors, shown in the summary and beside each field) works for every step.

## Source

::: details Register.vue
<<< @/patterns/Register.vue
:::
