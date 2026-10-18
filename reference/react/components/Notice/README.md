An inline message on a soft tint with a toned icon. Props: `headingLevel` (render the title as a heading), `titleId`, `role` (`false` removes it when a parent announces the notice), `title`, children (one sentence of detail), `tone` (`info` default, `success`, `warning`, `danger`), `icon`, `actions` (Buttons; `outline` and `quiet` suit best), `onDismiss`, `className`.

- **Actions:** at the end of the row, centred on the message, when the notice is 36rem wide or more; under the text, left-aligned, when narrower. The width is the notice's own, so a notice in a sidebar stacks on a wide screen. Actions follow the message in reading and tab order.
- Danger uses `role="alert"`; the others use `role="status"`.
- Say what happened and what to do in two sentences at most. One action is usually enough.
- A Notice stays until dealt with. A message that follows an action and then goes is a Toast.
- For a message about the whole page or session (a closure, a session about to end), put a Notice at the top of the main area.
