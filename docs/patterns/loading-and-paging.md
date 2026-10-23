---
title: Loading and paging
description: "A paged list from a server: skeletons while it loads, an error with a retry, and a pager that keeps its place."
aside: false
---

<script setup>
import Pattern from "./PagedList.vue";
</script>

# Loading and paging

Built from: [`EPagination`](/components/Pagination), [`ESkeleton`](/components/Skeleton), [`ENotice`](/components/Notice), [`ESurface`](/components/Surface), [`EStamp`](/components/Stamp), [`EPageHeader`](/components/PageHeader), and the layout and text components.

<div class="pattern-stage">
  <Pattern />
</div>

- Each page shows skeletons the size of a row while it loads, and the list is marked `aria-busy`. Nothing jumps when the rows arrive.
- When the result is in, `useAnnouncer` says how many rows loaded. The pager already announces "Page 2 of 5".
- Page 3 fails the first time. The error sits where the rows were, says the data is safe, and offers Try again. The pager stays usable.
- The request remembers which page it asked for and ignores a late answer, so quickly pressing Next twice cannot show page 2 under "Page 3".
- Focus stays on the pager button. Previous and Next dim at the ends with `aria-disabled`, so the button you pressed keeps focus.
- For a list the server already pages, give `EPagination` an `href` so each page is a real link and the back button works. For rows with columns, sorting and filtering, use [`EDataGrid` in manual mode](/guide/data-tables).

## Decisions

- **`EPagination`, not infinite scroll.** People can return to a place, link to it and reach the footer. Swap to a "Load more" button when order does not matter and the list is short.
- **`ESkeleton` rows, not a spinner.** The layout stays still. Use `ESpinner` for a single wait that has no shape, and `EProgress` when you know the fraction.
- **`ENotice` for the error, in place of the list.** It stays until dealt with and carries its own retry. A toast would vanish and leave an empty page.
- **Not `EDataGrid`.** A list of cards has no columns to sort. The grid pages its own rows, which suits tabular data.

<EDisclosure title="PagedList.vue">

<<< @/patterns/PagedList.vue

</EDisclosure>
