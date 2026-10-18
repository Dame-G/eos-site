Signing a form by typing your name, drawing it, or either. Props: `label`, `mode` (`type` the default, `draw`, or `both` which adds a Type and Draw switch), `defaultName`, `agreement` (the sentence the person agrees to), `date` and `onChange({ method, name, image, agreed })`.

- **Typed:** the name appears on a signature line in a handwriting face with the date beside it, so the person sees what they are signing.
- **Drawn:** a SignaturePad with a signature line, a Clear button and the date. `image` is a PNG data URL.
- Signing needs the signature and the agreement checkbox. Say what the form is in the label, and link to the full text before the field.
- A drawn signature cannot be done from a keyboard. Always allow the typed signature, so `both` is the right choice unless the practice's rules say otherwise.
