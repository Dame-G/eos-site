The list that holds ItemRows. Its rows share one set of columns, so every status and every action lines up down the list. Put it on a Panel or on the page; rows are separated by hairlines.

Layout is decided by the width of the list, not of the screen: wide lists put the status and the action at the end of each row; narrow ones put the status under the subtitle, a text Button below that, and an IconButton at the end of the row. A lone ItemRow outside an ItemList wraps itself in one.

In Vue, provide a flag from ItemList and inject it in ItemRow to wrap a lone row.
