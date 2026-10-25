---
title: Forms and validation
description: "EForm, v-model, labels, hints and errors, the error summary, a summary of your own, and your own controls with EField."
---

<script setup>
import FormSummary from "./examples/FormSummary.vue";
import ErrorSummary from "./examples/ErrorSummary.vue";
</script>

# Forms and validation

The main value of every control is `v-model`. A range picker has two (`v-model:start`, `v-model:end`). Leave it off and the control keeps its own state. Other signals are events with the value first, such as `@submit` on [`ESearchBar`](/components/SearchBar) and `@select` on [`EMenu`](/components/Menu).

Every field takes:

- `label`: required, and visible.
- `hint`: help under the control.
- `error`: replaces the hint, turns the edge red and is announced. Say how to fix it: "Enter a mobile number with 10 digits".
- `required` or `optional`: shows the word. Flag whichever is rarer.
- `hideLabel`: see [Labels](#labels).

## Labels

A visible label is the default and the better choice: it stays on screen while the person types, and it is the biggest click target. Use `hideLabel` only when something nearby already names the field, such as a search box beside a heading or an amount next to "Another amount". The label is kept for screen readers.

```vue
<ETextField v-model="amount" label="Amount" prefix="$" hide-label />
```

A checkbox in a table cell uses `hideLabel` in the same way; its hint or error stays visible. More on labels and keys: [Accessibility](/guide/accessibility).

## Checking a form

Wrap the fields in [`EForm`](/components/Form). On submit it checks every field: its `error` prop, and the browser's own rules (`required`, `pattern`, `min`, `max`, `type="email"`). Every eos control that takes an `error` takes part, including checkboxes, switches, segmented controls, groups and fieldsets, with no extra code.

- When a field fails, the submit stops, `@invalid` fires with the list of problems, a summary appears at the top and focus moves to it.
- When every field passes, `@submit` fires. Use `@submit.prevent` to send the data yourself.
- The form has `novalidate`, so your messages show, not the browser's bubbles.
- Set `submitting` while you send it: the form is `aria-busy` and ignores a second submit. If the server's answer puts `error` text on fields, the summary shows again when `submitting` goes back to false.

Give each field its own `error` too, so the message is beside the control while the person fixes it. Show errors only after the first submit, so nobody is told off for a field they have not reached. In the example, `@invalid` turns them on when a browser check fails. A rule only your code knows, such as ten digits in a phone number, is not there until the errors are on, so the submit handler turns them on and calls the form's `validate()` before it sends anything.

<div class="pattern-stage">
  <FormSummary />
</div>

<<< @/guide/examples/FormSummary.vue

See [Register](/patterns/register) and [Sign in](/patterns/sign-in) end to end.

## Error summary

EForm's summary is a danger [`ENotice`](/components/Notice), announced as it appears. Each line is a link that moves focus to its field, and the list follows the fields while it is up, so a fixed field drops out.

The wording follows one convention, which a summary of your own should keep:

- **The title says there is a problem**: "There is a problem". It is the `errorSummary` message, so change it for the whole app with `createEos({ messages: { errorSummary: "…" } })`, or per language.
- **Each line names the field, then says what to do**: "Mobile phone: Enter a mobile number with 10 digits". The line is the `formIssue` message, `{label}: {message}`, so the `error` you write is the second half.
- **A one-field form needs no summary.** Set `:summary="false"` and focus goes to the field, as in [Getting started](/guide/getting-started#_4-build-a-form). `focusTarget="field"` also skips the summary for focus on a longer form.

### A custom summary

Build the summary yourself only when it must look or behave differently, such as a summary that lives outside the form. Turn EForm's off with `:summary="false"`, or build it on a plain `form` as below. The rules are the same as EForm's:

<div class="pattern-stage">
  <ErrorSummary />
</div>

<<< @/guide/examples/ErrorSummary.vue

- Build one list of `{ id, label, message }` and derive each field's `error` from it, so the summary and the fields cannot disagree.
- Each link needs a handler that focuses the field. A `#id` link alone scrolls but does not move focus in every browser or router. Give each field an `id`: the control takes it, and the label points at it.
- Move focus after the errors have rendered (`await nextTick()`), not before.
- Use the same words as EForm: `useMessages()` gives you `errorSummary` and `formIssue`, so the title and the lines match the rest of the app and its translations.

## Your own control

[`EField`](/components/Field) gives a control of yours the label, hint and error, and hands you the ids. A control built on it takes part in `EForm`'s checks through its `error`:

```vue
<EField label="Preferred pharmacy" hint="We send the prescription here." v-slot="{ id, ariaInvalid, ariaDescribedby }">
  <MyAutocomplete :id="id" :aria-invalid="ariaInvalid" :aria-describedby="ariaDescribedby" />
</EField>
```

For a text-like control, use `useFieldAttrs()` with `inheritAttrs: false`: `class` and `style` stay on the wrapper, the rest goes to the input.

A control that is not inside an `EField` joins the form with `useFormField()`, called in its setup with getters for its id, label and error. A failed submit then lists it in the error summary, linked to its id:

```ts
import { useFormField } from "@eos-ui/vue";

useFormField({ id: () => props.id, label: () => props.label, error: () => props.error });
```

Controls with a `name` submit with the form, including Select, which carries its value in a hidden input.

For choosing between controls, see [Which component?](/guide/choosing). For a whole settings form with a toast, see [Settings page](/patterns/settings).
