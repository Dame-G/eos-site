---
title: Loading, empty and error
description: "Every state a list can be in, then a paged list from a server: skeletons while it loads, an error with a retry, an empty state and a pager that keeps its place."
aside: false
---

<script setup>
import Paged from "./PagedList.vue";
import States from "./EmptyError.vue";
</script>

# Loading, empty and error

Built from: [`EPagination`](/components/Pagination), [`ESkeleton`](/components/Skeleton), [`ENotice`](/components/Notice), [`EEmptyState`](/components/EmptyState), [`ESegmented`](/components/Segmented), [`ESurface`](/components/Surface), [`EStamp`](/components/Stamp), [`EPageHeader`](/components/PageHeader), and the layout and text components.

## A paged list from a server

<div class="pattern-stage">
  <Paged />
</div>

- Press Next and watch skeletons the size of a row hold the place while the page loads.
- Go to page 3: it fails the first time. Press Try again and it loads, while the pager stays usable.
- Press Next twice quickly: the list never shows page 2 under "Page 3".
- Use the pager from the keyboard: focus stays on the button you pressed, even at the ends.

## One list in every state

<div class="pattern-stage">
  <States />
</div>

- Pick each state with the segmented control: loading, error, empty and loaded.
- On the error, press Try again and it moves through loading to the list.

## Decisions

- **`ESkeleton` rows, not a spinner.** The layout stays still and nothing jumps when the rows arrive; the list is marked `aria-busy` meanwhile. Use `ESpinner` for a single wait that has no shape, and `EProgress` when you know the fraction.
- **`ENotice` for the error, in place of the list, with Try again.** It says what happened, that nothing is lost, and how to recover, and it stays until dealt with. A toast would vanish and leave an empty page.
- **`EEmptyState` when there is nothing yet.** It explains why and offers the first step. A blank list reads as broken.
- **Announce the result.** When a page arrives, `useAnnouncer` says how many rows loaded. The pager already announces "Page 2 of 5".
- **Ignore a late answer.** The request remembers which page it asked for, so an older reply cannot overwrite a newer page.
- **Previous and Next use `aria-disabled` at the ends, not `disabled`.** The button you pressed keeps focus.
- **`EPagination`, not infinite scroll.** People can return to a place, link to it and reach the footer. For a list the server already pages, give `EPagination` an `href` so each page is a real link and the back button works. Swap to a "Load more" button when order does not matter and the list is short.
- **Not `EDataGrid`.** A list of cards has no columns to sort. For rows with columns, sorting and filtering, use [`EDataGrid` in manual mode](/guide/data-tables#manual-mode), which has its own `loading`, empty and `error` states.
- **A real page has no segmented control.** It only previews the states here. Derive the state from the request.

<EDisclosure title="PagedList.vue">

<<< @/patterns/PagedList.vue

</EDisclosure>

<EDisclosure title="EmptyError.vue">

<<< @/patterns/EmptyError.vue

</EDisclosure>
