---
title: Statements
description: "Find, filter and open statements."
aside: false
---

<script setup>
import Pattern from "./Statements.vue";
</script>

# Statements

Built from: [`EPageHeader`](/components/PageHeader), [`EStack`](/components/Stack), [`EInline`](/components/Inline), [`EText`](/components/Text), [`ESearchBar`](/components/SearchBar), [`EActions`](/components/Actions), [`EExpandableRow`](/components/ExpandableRow), [`EStamp`](/components/Stamp), [`EDescriptionList`](/components/DescriptionList), [`EEmptyState`](/components/EmptyState), [`EPagination`](/components/Pagination), [`EButton`](/components/Button).

<div class="pattern-stage">
  <Pattern />
</div>

- Search narrows the list, the toggles filter it, and the count is announced.
- "Needs payment" includes overdue statements.

<EDisclosure title="Statements.vue">

<<< @/patterns/Statements.vue

</EDisclosure>
