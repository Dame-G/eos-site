---
title: Recipes
description: "Small compositions of Eos components that replace single-purpose components: toggle button, button group, link card, back link and panel."
---

# Recipes

Some things are a few lines of the pieces Eos already has. They are recipes, not components, so there is less to learn and nothing extra to maintain. Copy one and change the words.

## Toggle button

A button with two states, for a filter or a view option. Use an outline [`EButton`](/components/Button) with `aria-pressed`: Eos draws `aria-pressed="true"` as selected (a tinted fill and a primary edge, and `Highlight` in forced colours). Keep the label the same in both states. Use [`ESwitch`](/components/Switch) for a setting that saves.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { EButton } from "@eos-ui/vue";

const unpaid = ref(false);
</script>

<template>
  <EButton variant="outline" icon="filter" :aria-pressed="unpaid" @click="unpaid = !unpaid">Unpaid only</EButton>
</template>
```

## Button group

Buttons that belong together, side by side, announced as one labelled group. [`EActions`](/components/Actions) does this when you give it a `label`. Use [`ESegmented`](/components/Segmented) when the reader picks one option from several.

```vue
<EActions label="Show">
  <EButton variant="outline" :aria-pressed="filter === 'all'" @click="filter = 'all'">All</EButton>
  <EButton variant="outline" :aria-pressed="filter === 'due'" @click="filter = 'due'">Needs payment</EButton>
  <EButton variant="outline" :aria-pressed="filter === 'paid'" @click="filter = 'paid'">Paid</EButton>
</EActions>
```

## Link card

A card with a title, a short description and one link, where the whole card is the click target. Put one `a` in an [`ESurface`](/components/Surface), stretch its `::after` over the card, and keep everything else in the card free of links and buttons.

```vue
<ESurface as="li" pad="sm" class="link-card">
  <a href="/components/Button" class="link-card-link">EButton</a>
  <EText small muted>A button for an action, or a link that looks like one.</EText>
</ESurface>
```

```css
.link-card {
  position: relative;
  display: grid;
  gap: var(--e-space-1);
  align-content: start;
}

.link-card:hover {
  outline: var(--e-stroke-edge) solid var(--e-border-strong);
}

.link-card:has(:focus-visible) {
  outline: var(--e-stroke-focus) solid var(--e-focus-ring);
  outline-offset: var(--e-focus-gap);
}

.link-card-link {
  color: var(--e-primary);
  text-decoration: underline;
  text-underline-offset: 4px;
}

.link-card-link::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: var(--e-radius-md);
}

.link-card-link:focus-visible {
  outline: none;
}
```

The component list on this site is built this way.

## Back link

A link back to the previous page, with an arrow and words that name the destination ("Back to statements"). It is an [`ELink`](/components/Link) with the `arrow-left` icon. For a router, wrap `RouterLink` in the same way or use the `a` that your router renders.

```vue
<ELink href="/statements" icon="arrow-left">Back to statements</ELink>
```

## Panel

A flat, outlined container for statements, detail rows and forms. Render an `ESurface` as a `section`, and put an [`EHeading`](/components/Heading) (with its `kicker`) at the top. Pick the heading level that fits the page outline.

```vue
<ESurface as="section" pad="md">
  <EStack :gap="3">
    <EHeading :level="3" kicker="Billing">Questions</EHeading>
    <EDisclosure title="Can I set up a payment plan?">Yes. Call billing before the due date.</EDisclosure>
  </EStack>
</ESurface>
```

For an action beside the title, put the heading and an `EButton` in an [`EInline`](/components/Inline) with `justify="between"`.
