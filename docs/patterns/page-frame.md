---
title: Page frame
description: "The frame of a whole page: skip link, header, side navigation, main, footer and a page header."
aside: false
---

<script setup>
import Pattern from "./PageFrame.vue";
</script>

# Page frame

Built from: [`EAppShell`](/components/AppShell), [`EAppHeader`](/components/AppHeader), [`ENavList`](/components/NavList), [`EPageHeader`](/components/PageHeader), [`EBreadcrumb`](/components/Breadcrumb), [`EAppFooter`](/components/AppFooter), [`EGrid`](/components/Grid), [`ESurface`](/components/Surface), and the layout and text components.

<div class="pattern-stage">
  <Pattern />
</div>

- Press Tab from just above the frame: the first stop is the skip link, which moves focus to the main content.
- Narrow the window to phone width: the sidebar stacks above the content.

## Decisions

- **`EAppShell`, not a grid of your own.** It supplies the landmarks (a skip link, `banner`, a named `navigation`, `main` and `contentinfo`), the focus ring on `main`, and the column (`--e-shell-width`) with the header and footer across the width. A hand-made frame loses those quietly.
- **One `EPageHeader` to start the main content.** It holds the title, the breadcrumb and the one filled button. Here the frame sits inside this page, so its title is an `h2`; on a real page leave `heading-level` alone and the title is the page's `h1`.
- **`current` comes from you.** Set it on `ENavList`, normally from the router. The shell does not guess.
- **A sidebar for four or more destinations.** For two or three, put `ENavList` in the `EAppHeader` row instead and drop the `sidebar` slot.
- **`ENavList`, not `ETabs`.** Tabs switch panels on one page. Moving between pages is a list of links.
- **Cards as a list.** `EGrid as="ul"` with `ESurface as="li"` gives screen readers a count. Swap it for `ETable` or `EDataGrid` once the items have columns.

<EDisclosure title="PageFrame.vue">

<<< @/patterns/PageFrame.vue

</EDisclosure>
