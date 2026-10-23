---
title: Composing layouts
description: "Stack, Inline, Grid, Surface and AppShell: spacing and page structure without a custom box."
---

<script setup>
import Layouts from "./examples/Layouts.vue";
</script>

# Composing layouts

Six layout components cover almost every screen. The default `gap` is `base` on a stack, `snug` on an inline and `loose` on a grid. Spacing comes from the `gap` prop on a layout component, never from margins on content.

| Need | Use |
| --- | --- |
| Things in a column | [`EStack`](/components/Stack) |
| Things in a row that wraps | [`EInline`](/components/Inline) |
| Cards in as many columns as fit | [`EGrid`](/components/Grid) |
| A bordered block of content | [`ESurface`](/components/Surface) |
| The width of a page's content, centred | [`EContainer`](/components/Container) |
| The frame of the whole page | [`EAppShell`](/components/AppShell) |

<div class="pattern-stage">
  <Layouts />
</div>

```vue
<EStack :gap="6">
  <EInline justify="between">
    <EHeading :level="3">Visits</EHeading>
    <EInline>
      <EButton variant="outline">Export</EButton>
      <EButton>Book a visit</EButton>
    </EInline>
  </EInline>

  <EGrid min="14rem" as="ul">
    <ESurface v-for="v in visits" :key="v.id" as="li">
      <EStack :gap="2">
        <EStamp :status="v.status" small />
        <EText>{{ v.title }}</EText>
        <EText small muted>{{ v.when }}</EText>
      </EStack>
    </ESurface>
  </EGrid>
</EStack>
```

## Gaps

`gap` takes the name of a gap token (`tight`, `snug`, `base`, `loose` or `section`), a space token number (1 to 8, 10, 12 or 16, meaning `--e-space-N`) or any CSS length as a string. The names say the job and follow a theme's `spaceScale` and `density`, so prefer them. The defaults are `base` for `EStack`, `loose` for `EGrid` and `snug` for `EInline`. The table of which gap to use when is under [Spacing and layout conventions](/guide/design-principles#spacing-and-layout-conventions). Nest layouts to get a tighter gap inside a looser one, as the heading and cards above do.

## Rows and columns

- `EInline` wraps instead of overflowing. `justify="between"` pushes the first and last children apart, `align="baseline"` lines up text, and `nowrap` keeps one line.
- `EGrid` responds to its own width, not the screen's. `min` is the narrowest a column may be. Below it there is one column. `masonry` packs cards of uneven height.
- `EStack` stretches children across the column. `align="center"` or `"end"` positions them instead, and never changes focus order.

## Lists

`as="ul"` or `as="ol"` with `li` children makes a real list that screen readers count. Reset the bullets with your own class if the list is a row of cards.

## The page

`EAppShell` is the frame: a skip link, a header, optional side navigation, the `main` and a footer. Start the main content with an [`EPageHeader`](/components/PageHeader). There is one `h1` per page: set `heading-level` on a header that is not the page's title.

```vue
<EAppShell main-id="main" sidebar-label="Account">
  <template #header><EAppHeader>...</EAppHeader></template>
  <template #sidebar><ENavList label="Sections" :items="sections" /></template>
  <EPageHeader title="Statements" description="Your bills for 2026." />
  <!-- the page -->
  <template #footer><EAppFooter>Elm Street Family Health</EAppFooter></template>
</EAppShell>
```

See the full [`EAppShell`](/components/AppShell) demo, and [Statements](/patterns/statements) for a finished page.

For a page that needs a centred column but not the whole frame, such as a sign-in page or an article, use [`EContainer`](/components/Container). It sets a maximum width (`sm`, `md`, `lg` or `full`), centres itself and keeps the page gutter at its sides. Use `as="main"` for the one main landmark.

```vue
<EContainer as="main" size="md">
  <EStack gap="section">
    <EPageHeader title="Sign in" />
    <ESurface>...</ESurface>
  </EStack>
</EContainer>
```

Inside an `EAppShell` the shell already sets the column, so do not add a container there. For a nested container that sits inside one that has a gutter, pass `:gutter="false"`.

## When you need a custom box

If you reach for a `div` with padding and a border, use `ESurface`. If you need space between things, nest a layout component. If nothing fits, that is a missing building block: say so in an issue on the library, and meanwhile use a small scoped style with `--e-space-*` and `--e-border` tokens.
