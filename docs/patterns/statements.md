---
title: Statements
description: "Find, filter and open statements."
aside: false
---

<script setup>
import Pattern from "./Statements.vue";
</script>

# Statements

Built from: [`ESearchBar`](/components/SearchBar), [`EActions`](/components/Actions), [`EExpandableRow`](/components/ExpandableRow), [`EEmptyState`](/components/EmptyState), [`EPagination`](/components/Pagination), and the layout and text components.

<div class="pattern-stage">
  <Pattern />
</div>

- Search for "Lab", then turn on a filter: the list narrows and the count is announced.
- Turn on "Needs payment": overdue statements are included.

## Decisions

- **`EExpandableRow`, not a table.** Each statement has a few facts and an action. Use `ETable` or `EDataGrid` when people compare values across rows.
- **`ESearchBar` plus toggle buttons in `EActions`.** Search and a two-way filter are cheap to learn. Swap the toggles for `ESegmented` when the options are exclusive.
- **`EPagination` only when there is more than one page.** Six rows need none. It shows how paging sits under the list.
- **`EEmptyState` when filters match nothing.** It says why and offers a way out, which is better than an empty list.

<EDisclosure title="Statements.vue">

<<< @/patterns/Statements.vue

</EDisclosure>
