A single line for a form, receipt or document. Props: `title`, `subtitle`, `icon`, `status` (or `tone` and `label`) and `action` (a Button or IconButton).

Where the status goes depends on the width. At 36rem or more it sits in its own column before the action, so the title keeps a clean line. Below that it moves under the subtitle, and a text Button drops to its own line under it; an IconButton stays at the end of the row. Show several rows inside an ItemList so the columns match between rows. Use StatementRow when a row should open to a card.
