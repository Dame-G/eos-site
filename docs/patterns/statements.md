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

- Search narrows the list, the toggles filter it, and the count is announced.
- "Needs payment" includes overdue statements.

<EDisclosure title="Statements.vue">

<<< @/patterns/Statements.vue

</EDisclosure>
