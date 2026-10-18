The list of what went wrong, placed at the top of a form after a failed submit. It is a danger Notice holding a list. Props: `errors` (`[{ field?, message }]`), `title` (default "There is a problem"), `headingLevel` and `autoFocus` (default true).

- It takes focus when errors appear and announces itself, so keyboard and screen reader users land on it. The list is plain text: it says what to fix, and each field shows its own error beside it.
- `field` is the name of the field, shown first in medium weight ("Email: Enter an email address"). Leave it out when the message names the field already.
- Messages repeat the field's own error text, written the same way: what is wrong and how to fix it.
- Keep the field-level errors; the summary does not replace them.
