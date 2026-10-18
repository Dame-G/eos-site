A date field with a calendar. Props: `label`, `value` or `defaultValue` (a Date), `onChange(date or null)`, `min`, `max`, `name` (submits `YYYY-MM-DD`), `hint`, `error`, `required` or `optional`, `disabled`.

- The text box takes the locale's order with slashes, dashes or dots (MM/DD/YYYY for en-US, DD.MM.YYYY for de-DE) and rewrites it in the standard form. An invalid or out-of-range entry shows an error and leaves the value alone.
- Alt + Down opens the calendar on the selected day. The calendar's month and year are buttons that open a month grid and a scrolling year list.
- There is no native date input in the system.
