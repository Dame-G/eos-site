Every state a text input, select, checkbox, switch and radio can be in, side by side: default, filled, hint, error, read-only and disabled.

- **Default:** a 48px well with a `border-strong` edge (4.5:1). **Hover:** the edge darkens to `ink`. **Focus:** the edge and a 2px outline turn `primary` (7.9:1).
- **Error:** the edge and a second inner line turn `danger`, a red alert icon and the message appear under the field, and the field is marked `aria-invalid`. Focus on an invalid field keeps the red.
- **Read-only:** looks like a filled field on a tint and can still be focused and copied. **Disabled:** a dashed edge, muted text, not focusable. Never use disabled for something the person needs to read; use read-only.
- A hint and an error never appear together; the error replaces the hint.
