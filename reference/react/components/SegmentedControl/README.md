A joined set of two to five options where exactly one is active. Props: `label` (read by screen readers), `options` (`{value, label, icon, disabled}`), `value` or `defaultValue`, `onChange(value)`. It is a radio group underneath, so arrow keys work. The active option is filled with `primary` and bold, with white text. Use it to switch how a list is filtered or shown; use Tabs to switch between different content.

Also takes `hint`, `error` and `disabled`. With a hint or error it adds them under the control and links them with `aria-describedby`.
