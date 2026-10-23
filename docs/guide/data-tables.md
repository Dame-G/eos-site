---
title: Data tables
description: "Choose between ETable and EDataGrid, then sort, filter, select and format rows in the browser or from a server."
---

<script setup>
import ClientGrid from "./examples/ClientGrid.vue";
import ServerGrid from "./examples/ServerGrid.vue";
</script>

# Data tables

## Which one

- [`ETable`](/components/Table) is a plain table for facts that are read: prices, specifications, comparisons. You write the `thead` and `tbody`.
- [`EDataGrid`](/components/DataGrid) is for rows people work with: sort, filter, search, select, page. You give it `columns` and `rows`.

A short static list in a grid, with no toolbar, is `bare`.

## Client mode

The default. Give the grid all the rows and it sorts, filters, searches and pages them in the browser. Each row needs a unique `id`.

<div class="pattern-stage">
  <ClientGrid />
</div>

```vue
<EDataGrid
  v-model:selected="selected"
  v-model:sort="sort"
  caption="Statements"
  :columns="columns"
  :rows="rows"
  :page-size="4"
  searchable
  filterable
  selectable
>
  <template #cell-date="{ row }">{{ formatDate(row.date) }}</template>
  <template #cell-status="{ row }"><EStamp :status="row.status" size="sm" /></template>
  <template #cell-amount="{ row }">{{ formatMoney(row.amount) }}</template>
  <template #bulk-actions><EButton variant="outline" icon="download">Download receipts</EButton></template>
</EDataGrid>
```

```ts
const columns = [
  { key: "date", label: "Date", sortable: true, value: (r) => r.date },
  { key: "service", label: "Service", sortable: true, filter: { type: "text" } },
  { key: "status", label: "Status", filter: { type: "select", options: ["due", "paid"] } },
  { key: "amount", label: "Amount", numeric: true, sortable: true, filter: { type: "number" } },
];
```

### Sorting

Mark a column `sortable`. The heading becomes a button that cycles ascending, descending, off. Bind `v-model:sort` to start sorted or to read the sort: `{ key, dir }` or `null`.

### Filtering and search

`searchable` adds one search box over every column. `filterable` adds a filter row under the headings, for columns with a `filter`: `text`, `select` (with `options`) or `number` (a minimum and maximum). Bind `v-model:filters` and `v-model:search` to read or preset them.

### Selection

`selectable` adds a checkbox per row and a select-all. `v-model:selected` holds the row ids, and keeps them across pages and filters. Buttons in the `bulk-actions` slot appear beside the "n selected" count.

### Formatting

A cell shows `row[key]` until you fill the `cell-<key>` slot. A slot changes how a cell looks, not how it sorts, so give the column a `value` function that returns what should sort, filter and search: a `Date`, a number or a string. Use [`useLocale()`](/guide/api#uselocale) for dates and money, so the grid follows `createEos({ locale, currency })`. Set `numeric` to right-align figures.

### Many rows

Set `virtual` to render only the rows in view, for thousands of rows. It replaces paging. A grid narrower than 40rem turns rows into cards unless you set `:cards="false"`.

## Manual mode

When the data lives on a server, set `manual`. The grid then leaves the rows alone: it shows the rows you give it, in the order you give them, and reports what the person asked for through `@query-change`. The event carries `{ sort, page, pageSize, search, filters }`. It does not fire on mount, so load the first page yourself.

<div class="pattern-stage">
  <ServerGrid />
</div>

```vue
<EDataGrid
  manual
  searchable
  caption="Visits from the server"
  :columns="columns"
  :rows="rows"
  :total="total"
  :loading="loading"
  :page-size="5"
  @query-change="load"
/>
```

- `total` is the number of rows in all, not on this page. The pager needs it.
- `loading` shows placeholder rows and sets `aria-busy`.
- An empty `rows` shows `emptyTitle` and `emptyText`. Set them so the empty state says something useful.
- A failed request is yours to show: an [`ENotice`](/components/Notice) above the grid, or a [toast](/guide/toasts).

## States to cover

| State | How |
| --- | --- |
| Loading | `loading` |
| Empty | `emptyTitle` and `emptyText` |
| No search results | the same empty state, with words that mention the search |
| Long text | cells wrap. Fix a column with `width` if it should not grow |
| Error | an `ENotice` with a retry button, above the grid |

See [Data table with bulk actions](/patterns/data-table) for a whole page.
