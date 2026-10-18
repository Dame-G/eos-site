A dropdown built from a button and a listbox, for when options need more than a line of text. Props: `label`, `options` (strings or `{value, label, description, icon, group, disabled}`), `value` or `defaultValue`, `onChange(value)`, `placeholder`, `hint`, `error`, `required` or `optional`, `disabled`, `name` (adds a hidden input for forms).

Keyboard: Arrow keys, Home and End move, Enter or Space chooses, Escape closes, and typing jumps to a matching option. The list matches the field's width, flips above when there is no room below, and closes on an outside press. The selected option is bold with a check, so it never relies on colour.

There is deliberately no native select in this system: one control looks and behaves the same everywhere. Use RadioGroup or SegmentedControl for five or fewer options, Combobox when the list is long enough that people need to type to find things. `bare` returns just the control, with `ariaLabel`, for dense places such as DataGrid filters.

Pass `name` to submit the chosen value with a form (a hidden input carries it), and `id` to link a label to it.
