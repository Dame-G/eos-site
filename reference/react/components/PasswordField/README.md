A password with a Show and Hide button and, if you give it `rules`, a checklist that updates as you type. Props: `label`, `mode` (`current` for signing in, `new` for choosing one; sets the autocomplete token so a password manager can fill or suggest), `rules` (`[{ label, test(value) }]`), `value`, `onChange(value, event)`, `hint`, `error`, `required` and `disabled`.

- Each rule shows a tick or an empty circle and says "met" or "not met yet" to a screen reader, so it never relies on colour.
- The toggle is a real button with `aria-pressed`. Never block paste into this field.
- Do not enforce composition rules the practice does not need; length matters most.
