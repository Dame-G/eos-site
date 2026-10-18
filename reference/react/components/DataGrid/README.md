A data table you can sort, filter per column, resize, hide columns of, select from, page through, or scroll through thousands of rows of.

**Columns** are `{key, label, sortable, numeric, align, width, minWidth, resizable, render(row), value(row), filter}`. Set `value` when a cell shows a node but should sort and filter on text, a number or a Date. `filter` is `{type: "text"}`, `{type: "select", options}` or `{type: "number"}` (a min and max), and shows when the grid has `filterable`.

**Rows** are objects with a unique `id`.

**Props:** `caption` (required for screen readers), `searchable` (one box over all columns), `filterable`, `resizable`, `stickyFirst` (keeps the first column in view while scrolling sideways), `columnToggle` (a Columns popover to show and hide), `selectable` with `onSelectionChange(ids)` and `bulkActions`, `toolbar`, `pageSize` (default 10), `defaultSort`, `maxHeight`, `cards` (default true), `loading`, `emptyTitle`, `emptyText`, `emptyIcon`.

**Large data:** `virtual` (true or `{rowHeight, height, overscan}`) renders only the rows in view, with `aria-rowcount` and `aria-rowindex` so screen readers still know the size; it replaces paging. For data that lives on a server set `manual`: the grid then shows the rows you pass, takes `total`, and reports every change through `onQueryChange({sort, page, pageSize, search, filters})`.

**Behaviour:** clicking a heading cycles ascending, descending, off, and the heading carries `aria-sort`. Column edges are draggable and also keyboard operable (focus the edge, Arrow Left or Right to resize, Shift for larger steps, Home to reset; double-click also resets). Selection covers the current page, or all filtered rows when virtual. A live region announces the sort and row count.

**On a phone:** below 40rem of its own width, a grid turns into a list of cards: each row becomes a card with every cell labelled by its column, the header row is hidden visually, and a Sort by menu replaces the clickable headings. Set `cards={false}` to keep a scrolling table; grids that are `virtual` or `resizable` always keep the table. Table roles are set explicitly so screen readers still read it as a table.

`plain` renders a bare table (no toolbar, filters, paging or footer) for a short static list. Use StatementRow when each row should open to a card.
