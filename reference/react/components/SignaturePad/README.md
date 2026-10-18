A signature drawn with a finger, stylus or mouse on a signature line. Props: `height` (default 160) and `onChange({ empty, image })`, where `image` is a PNG data URL, empty when the pad is clear. A Clear button resets it. SignatureField wraps it with a typed alternative, a date and the agreement checkbox, so most forms should use SignatureField.

A drawn signature cannot be made keyboard-accessible, so always offer the typed signature as well (SignatureField's `mode="both"`). The canvas is labelled for screen readers and says how to use Type instead.
