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

<EDisclosure title="EmptyError.vue">

<<< @/patterns/EmptyError.vue

</EDisclosure>
