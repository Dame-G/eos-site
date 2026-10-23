---
title: Empty and error states
description: "Loading, error, empty and loaded versions of one list."
aside: false
---

<script setup>
import Pattern from "./EmptyError.vue";
</script>

# Empty and error states

Built from: [`ENotice`](/components/Notice), [`EEmptyState`](/components/EmptyState), [`ESkeleton`](/components/Skeleton), [`ESegmented`](/components/Segmented), and the layout and text components.

<div class="pattern-stage">
  <Pattern />
</div>

- The segmented control only previews each state. A real page derives the state from its request.
- Loading holds the place of what is coming. An error says what happened, that nothing is lost, and how to retry. An empty state says why and what to do next.
- Try again moves through loading to loaded.

## Decisions

- **`ESkeleton` while loading.** It holds the layout so nothing jumps. Use a spinner when there is no shape to hold.
- **`ENotice` for an error, with Try again.** It says what happened, that nothing is lost, and how to recover. A toast would leave an empty page.
- **`EEmptyState` when there is nothing yet.** It explains why and offers the first step. A blank list reads as broken.
- **A real page has no segmented control.** The control here only previews the four states. Derive the state from the request.

<EDisclosure title="EmptyError.vue">

<<< @/patterns/EmptyError.vue

</EDisclosure>
