A labelled text input, pressed into the page like a well. Props: `label`, `hint`, `error`, `placeholder`, `type`, `value` or `defaultValue`, `disabled`, `readOnly`, `required` or `optional` (a word beside the label; flag whichever is rarer), `prefix` or `suffix` (a unit such as $ or USD), `onChange(value, event)`.

- Native input attributes go to the input: `name`, `autoComplete`, `maxLength`, `minLength`, `pattern`, `inputMode`, `enterKeyHint`, `spellCheck`, `autoFocus`, `inputRef`, `aria-*`, `data-*`.
- Set `autoComplete` on every personal detail (`given-name`, `family-name`, `email`, `tel`, `street-address`, `postal-code`, `bday`): browsers and password managers then fill it (WCAG 1.3.5).
- The label is a mono kicker above the input; the placeholder is an example, never the label. `hideLabel` keeps the label for screen readers and removes it from the page, for a field whose meaning is clear from what is next to it (an amount that appears under "Another amount"). Every field built on the shared label takes it.
- An error replaces the hint, says what to fix, turns the edge `danger` and adds an alert glyph.
- Hover darkens the edge; focus turns the edge and a 2px outline `focus-field`. Disabled goes dashed and tinted; read-only stays focusable.
