A sign-in page with the two ways in: email and password, or a code sent by email. It shows the order of things people expect: fields first, the main button, then the way out ("Forgot your password?"), then the alternative below a divider.

- **Built from:** Surface, Stack, Field (autocomplete `username`), PasswordField, Checkbox, Actions, Link, Divider, BackLink, OtpField.
- **The code step** names where the code went (with the address partly hidden), how long it lasts, and offers a new one. "Verify" stays disabled until all six digits are in, and OtpField's `onComplete` can submit for them.
- Never say which of the email or password was wrong; say the pair did not match.
