An input that filters a list as you type and only accepts an option from it. Props: `options` (same shape as Select), `value` or `defaultValue`, `onChange(value)`, `onInputChange(text)` (to fetch options from a server), `loading`, `emptyText`, `placeholder`, `hint`, `error`, `required` or `optional`, `disabled`, `clearable` (default on) and `filter(option, query)` to replace the default match.

Matching text is bold and underlined. When focus leaves, the text snaps back to the chosen option, so the field never holds something that is not a valid choice. Arrow keys move, Enter chooses, Escape closes and then clears. Use Autocomplete when any text is allowed, MultiSelect for several choices, Select when the list is short.

Pass `name` to submit the value (one hidden input per chosen value), `autoComplete`, `inputRef` and `onBlur` or `onFocus` for the text input. `required` is satisfied by a chosen value.
