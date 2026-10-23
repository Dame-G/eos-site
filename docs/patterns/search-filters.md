---
title: Search with filters
description: "Search, a segmented filter and a select, with a count and a way to clear."
aside: false
---

<script setup>
import Pattern from "./SearchFilters.vue";
</script>

# Search with filters

Built from: [`ESearchBar`](/components/SearchBar), [`ESearchResults`](/components/SearchResults), [`ESegmented`](/components/Segmented), [`ESelect`](/components/Select), and the layout and text components.

<div class="pattern-stage">
  <Pattern />
</div>

- Search runs on Enter or the button. The filters apply at once.
- The count is a status region, so changes are announced. The empty state says why nothing matched and what to do.
- Clear filters appears only when a filter is on.

<EDisclosure title="SearchFilters.vue">

<<< @/patterns/SearchFilters.vue

</EDisclosure>
