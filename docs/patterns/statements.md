---
title: Statements
description: "Find, filter and open statements."
aside: false
---

<script setup>
import Pattern from "./Statements.vue";
</script>

# Statements

Find, filter and open statements.

**Built from:** EPageHeader, ESearchBar, EButtonGroup, EToggle, EStatementRow, EEmptyState, EPagination, EButton.

<div class="pattern-stage">
  <Pattern />
</div>

## Notes

- Search narrows the list, the toggles filter it, and the count is announced politely.
- Each row opens to show the amount, what it covers and the actions. "Needs payment" includes overdue statements.
- When nothing matches, an empty state says so instead of leaving a blank.

## Source

::: details Statements.vue
<<< @/patterns/Statements.vue
:::
