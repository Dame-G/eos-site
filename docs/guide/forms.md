---
title: Forms and validation
description: "v-model, labels, hints and errors, wiring your own control with EField, and the error summary."
---

# Forms and validation

## v-model

The main value of every control is `v-model`. A range picker has two (`v-model:start`, `v-model:end`). Leave `v-model` off and the control keeps its own state, so there is no `defaultValue` prop.

```vue
<script setup lang="ts">
import { ref } from "vue";
const first = ref("");
const day = ref<Date | null>(null);
</script>

<template>
  <ETextField v-model="first" label="First name" autocomplete="given-name" required />
  <EDatePicker v-model="day" label="Date of birth" />
</template>
```

Other signals are events with the value first: `@change`, `@clear`.

## Labels, hints and errors

Every field takes the same props:

- `label`: required, always visible unless `hideLabel`. A placeholder is only an example.
- `hint`: help under the control.
- `error`: replaces the hint, turns the edge red, adds an alert glyph, sets `aria-invalid` and is announced. Colour is never the only signal.
- `required` or `optional`: shows the word "Required" or "Optional". Flag whichever is rarer. There are no asterisks.

Say what is wrong and how to fix it: "Enter a mobile number with 10 digits".

## Your own control

For a control Eos does not wrap, `EField` gives you the label, hint and error, and hands you the ids:

```vue
<EField label="Preferred pharmacy" hint="We send the prescription here." v-slot="{ id, ariaInvalid, ariaDescribedby }">
  <MyAutocomplete :id="id" :aria-invalid="ariaInvalid" :aria-describedby="ariaDescribedby" />
</EField>
```

For a text-like control of your own, use `useFieldAttrs()` with `inheritAttrs: false`: `class` and `style` stay on the wrapper, and the rest (name, autocomplete, aria attributes, listeners) goes to the input.

## ErrorSummary

After a failed submit, list what went wrong at the top of the form. It takes focus when errors appear, and each field still shows its own error.

```vue
<script setup lang="ts">
import { computed, ref } from "vue";

const first = ref("");
const phone = ref("");
const submitted = ref(false);

const errors = computed(() => {
  if (!submitted.value) return [];
  const list = [];
  if (!first.value.trim()) list.push({ field: "First name", message: "Enter your first name" });
  if (phone.value.replace(/\D/g, "").length < 10) list.push({ field: "Mobile phone", message: "Enter a mobile number with 10 digits" });
  return list;
});
</script>

<template>
  <form novalidate @submit.prevent="submitted = true">
    <EErrorSummary :errors="errors" />
    <ETextField v-model="first" label="First name" :error="errors.find((e) => e.field === 'First name')?.message" />
    <EPhoneField v-model="phone" label="Mobile phone" :error="errors.find((e) => e.field === 'Mobile phone')?.message" />
    <EButton type="submit">Continue</EButton>
  </form>
</template>
```

Use `novalidate` so your messages, not the browser's, are shown. The [Register](/patterns/register) and [Sign in](/patterns/sign-in) patterns do this end to end.

## Autofill and submitting

Give inputs an `autocomplete` token (`given-name`, `email`, `one-time-code`) so browsers can fill them, as WCAG 1.3.5 asks.

Controls with a `name` submit with the form. Select and others carry their value in a hidden input, so a plain `<form method="post">` works.
