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

## Decisions

- **Search on Enter, filters at once.** Typing a query is a commitment, while a filter is a try. Run live search instead if the results are cheap and local.
- **`ESegmented` for the type, `ESelect` for the longer list.** Three or four exclusive options fit a segmented control. More belongs in a select.
- **`ESearchResults` for the results.** They are links with a highlighted match. Use `ETable` or cards when results have more than a title and a line.
- **Count in a status region.** The change is announced without moving focus.

<EDisclosure title="SearchFilters.vue">

<<< @/patterns/SearchFilters.vue

</EDisclosure>
