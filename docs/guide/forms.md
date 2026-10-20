---
title: Forms and validation
description: "v-model, labels, hints and errors, your own controls with EField, and the error summary."
---

# Forms and validation

The main value of every control is `v-model`. A range picker has two (`v-model:start`, `v-model:end`). Leave it off and the control keeps its own state. Other signals are events with the value first, such as `@submit` on [`ESearchBar`](/components/SearchBar) and `@select` on [`EMenu`](/components/Menu).

Every field takes:

- `label`: required, and visible.
- `hint`: help under the control.
- `error`: replaces the hint, turns the edge red and is announced. Say how to fix it: "Enter a mobile number with 10 digits".
- `required` or `optional`: shows the word. Flag whichever is rarer.
- `hideLabel`: hides the label visually and keeps it for assistive technology.

## Your own control

[`EField`](/components/Field) gives a control of yours the label, hint and error, and hands you the ids:

```vue
<EField label="Preferred pharmacy" hint="We send the prescription here." v-slot="{ id, ariaInvalid, ariaDescribedby }">
  <MyAutocomplete :id="id" :aria-invalid="ariaInvalid" :aria-describedby="ariaDescribedby" />
</EField>
```

For a text-like control, use `useFieldAttrs()` with `inheritAttrs: false`: `class` and `style` stay on the wrapper, the rest goes to the input.

## Errors

After a failed submit, give each field its own `error`, so the message sits next to the control it describes. Put `novalidate` on the form so your messages show, not the browser's.

```vue
<script setup lang="ts">
import { computed, ref } from "vue";

const first = ref("");
const submitted = ref(false);
const firstError = computed(() => (submitted.value && !first.value.trim() ? "Enter your first name" : undefined));
</script>

<template>
  <form novalidate @submit.prevent="submitted = true">
    <ETextField v-model="first" label="First name" autocomplete="given-name" :error="firstError" />
    <EButton type="submit">Continue</EButton>
  </form>
</template>
```

See [Register](/patterns/register) and [Sign in](/patterns/sign-in) end to end.

Controls with a `name` submit with the form, including Select, which carries its value in a hidden input.
