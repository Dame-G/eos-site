A one-time code, one character per box. Props: `label`, `length` (6), `type` (`numeric`, or `text` for letters and digits), `groupSize` (a gap between groups: 6 with 3 reads 123 456), `value` and `onChange(code)`, `onComplete(code)` (once, when the last box fills), `name`, `autoFocus` (starts in the first empty box), `hint`, `error`, `disabled`.

- One keystroke, one character, then focus moves on. Typing over a filled box replaces it. Backspace deletes a character; in an empty box it steps back and deletes the one before. Arrow keys, Home and End move.
- Paste and SMS autofill fill every box (the first has `autocomplete="one-time-code"`). Focus cannot skip past the last filled box, so the code has no gaps.
- Boxes are 48px tall and narrow on a phone so eight fit. Each is labelled "Digit 3 of 6"; the group carries the visible label, and the hint or error is read with each box. Numeric codes open the number pad.
- Keep codes out of URLs and logs. Offer Resend and another way to sign in beneath the field.
