Finding a statement: a page title, a search, a few filters, then the list. Each row shows the status and the amount, and opens to what you owe, why, and how to pay.

- **Built from:** PageHeader, SearchBar, ButtonGroup with ToggleButtons, StatementRow, Actions.
- Put the filters people actually use as buttons (All, Needs payment, Paid); keep a date range (DateRangePicker) for the longer history.
- Say how many results there are, and what to do when there are none (EmptyState).
- For history older than a year, switch to a DataGrid with paging; its rows become cards on a phone.
