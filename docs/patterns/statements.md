---
title: Statements
description: "Find, filter and open statements."
aside: false
---

<script setup>
import Pattern from "./Statements.vue";
</script>

# Statements

Built from: EPageHeader, EStack, EInline, EText, ESearchBar, EActions, EExpandableRow, EStamp, EDescriptionList, EEmptyState, EPagination, EButton.

<div class="pattern-stage">
  <Pattern />
</div>

- Search narrows the list, the toggles filter it, and the count is announced.
- "Needs payment" includes overdue statements.

<EDisclosure title="Statements.vue">

<<< @/patterns/Statements.vue

</EDisclosure>
