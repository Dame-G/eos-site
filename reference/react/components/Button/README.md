The one pressable. Flat, with a 2px inner bottom edge that marks it as clickable. On hover the fill darkens; on press the edge flips to the top. It is exactly as tall as an input (48px), so the two line up side by side.

Props: the label (children), an optional `icon` name, and `onClick`. Use `variant="primary"` (the default) for the one main action on a screen, such as Pay now; `secondary` for a positive confirmation; `outline` for the other actions beside it (Reschedule, Download); `danger` for something that cancels or removes; `quiet` for an underlined text action. `block` makes it full width.

- One primary Button per view; the others beside it are outline or quiet.
- A disabled Button turns into a dashed outline; say why nearby ("Add a card to pay").
- Labels are verbs that say what happens: "Pay $162.40", "Reschedule", "Download receipt".
