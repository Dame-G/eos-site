---
title: Page frame
description: "The frame of a whole page: skip link, header, side navigation, main, footer and a page header."
aside: false
---

<script setup>
import Pattern from "./AppFrame.vue";
</script>

# Page frame

Built from: [`EAppShell`](/components/AppShell), [`EAppHeader`](/components/AppHeader), [`ENavList`](/components/NavList), [`EPageHeader`](/components/PageHeader), [`EBreadcrumb`](/components/Breadcrumb), [`EAppFooter`](/components/AppFooter), [`EGrid`](/components/Grid), [`ESurface`](/components/Surface), and the layout and text components.

<div class="pattern-stage">
  <Pattern />
</div>

- The shell supplies the landmarks: a skip link, `banner`, a named `navigation`, `main` and `contentinfo`. You supply the content of each.
- Start the main content with one `EPageHeader`. It holds the page's title, its breadcrumb and its main action. Only one filled button sits there.
- `current` on `ENavList` is yours to set, normally from the router. The shell does not guess.
- The header and footer span the width and the content sits in a column (`--e-shell-width`). At phone width the sidebar stacks above the content.
- Here the frame sits inside this page, so its title is an `h2`. On a real page leave `heading-level` alone and the title is the page's `h1`.

## Decisions

- **`EAppShell`, not a grid of your own.** It already solves the skip link, focus ring on `main` and the rails beside the column. A hand-made frame loses those quietly.
- **A sidebar for four or more destinations.** For two or three, put `ENavList` in the `EAppHeader` row instead and drop the `sidebar` slot.
- **`ENavList`, not `ETabs`.** Tabs switch panels on one page. Moving between pages is a list of links.
- **Cards as a list.** `EGrid as="ul"` with `ESurface as="li"` gives screen readers a count. Swap it for `ETable` or `EDataGrid` once the items have columns.

<EDisclosure title="AppFrame.vue">

<<< @/patterns/AppFrame.vue

</EDisclosure>
