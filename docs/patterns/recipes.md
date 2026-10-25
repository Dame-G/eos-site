---
title: Small recipes
description: "Small compositions of eos components that replace single-purpose components: toggle button, group of actions, back link, panel and a light, dark or system theme switch."
---

# Small recipes

Some things are a few lines of the pieces eos already has. They are recipes, not components, so there is less to learn and nothing extra to maintain. Copy one and change the words.

## Toggle button

A button with two states, for a filter or a view option. Use an outline [`EButton`](/components/Button) with `aria-pressed`: eos draws `aria-pressed="true"` filled in the primary colour, like a chosen segment. Keep the label the same in both states. Use [`ESwitch`](/components/Switch) for a setting that saves.

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

## Group of actions

Buttons that belong together, side by side, announced as one labelled group. [`EActions`](/components/Actions) does this when you give it a `label`. Each button does its own thing. Toggle buttons in a group are independent too: each one turns its own option on or off.

```vue
<EActions label="Statement">
  <EButton variant="outline" icon="download">Download</EButton>
  <EButton variant="outline">Print</EButton>
  <EButton variant="outline" :aria-pressed="starred" @click="starred = !starred">Starred</EButton>
</EActions>
```

When the reader picks exactly one option from several, that is not a group of toggle buttons: use [`ESegmented`](/components/Segmented), which is a radio group underneath. See [Which component?](/guide/choosing).

## Back link

A link back to the previous page, with an arrow and words that name the destination ("Back to statements"). It is an [`ELink`](/components/Link) with the `arrow-left` icon. For a router, wrap `RouterLink` in the same way or use the `a` that your router renders.

```vue
<ELink href="/statements" icon="arrow-left">Back to statements</ELink>
```

## Panel

A flat, outlined container for statements, detail rows and forms. Render an `ESurface` as a `section`, and put an [`EHeading`](/components/Heading) (with its `kicker`) at the top. Pick the heading level that fits the page outline.

```vue
<ESurface as="section">
  <EStack gap="base">
    <EHeading :level="3" kicker="Billing">Questions</EHeading>
    <EDisclosure title="Can I set up a payment plan?">Yes. Call billing before the due date.</EDisclosure>
  </EStack>
</ESurface>
```

For an action beside the title, put the heading and an `EButton` in an [`EInline`](/components/Inline) with `justify="between"`.

## Light, dark or system

`scheme: "auto"` in [`defineTheme()`](/guide/theming#light-and-dark) follows the visitor's setting with no code. To let people choose "system", "light" or "dark" themselves, use a fixed theme per choice instead. A fixed theme with a dark `surface` is a dark theme: `defineTheme` lifts the action colours for it.

```ts
const light = defineTheme({ name: "light" });
const dark = defineTheme({ name: "dark", background: "#0a0e11", surface: "#0f1418", foreground: "#ffffff" });
```

Save only "light" and "dark", so no saved value means follow the system. To avoid a flash of the wrong theme, set the scheme before the first paint with a small script in `<head>`, and render the dark tokens under the attribute it sets. This site does it that way (`docs/.vitepress/scheme.ts` and `theme/site-theme.ts` in the [site repository](https://github.com/Dame-G/eos-site)).

```html
<script>
  (function () {
    try {
      var saved = localStorage.getItem("my-scheme");
      var dark = saved === "dark" || (saved !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.dataset.scheme = dark ? "dark" : "light";
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    } catch (e) {}
  })();
</script>
<style>
  /* dark.css({ selector: ':root[data-scheme="dark"]', layer: false }) */
</style>
```

`layer: false` writes the tokens outside `@layer e.tokens`, so they win over the library's default tokens wherever the style sits in the head.

Once the app has mounted, apply the theme that matches and keep it up to date. `apply()` sets every token inline, so one call replaces the other theme completely.

```ts
function paint(isDark: boolean) {
  (isDark ? dark : light).apply(document.documentElement);
  document.documentElement.dataset.scheme = isDark ? "dark" : "light";
}

const query = matchMedia("(prefers-color-scheme: dark)");
query.addEventListener("change", (e) => {
  if (!localStorage.getItem("my-scheme")) paint(e.matches);
});

function choose(choice: "system" | "light" | "dark") {
  if (choice === "system") localStorage.removeItem("my-scheme");
  else localStorage.setItem("my-scheme", choice);
  paint(choice === "dark" || (choice === "system" && query.matches));
}
```

Wrap `localStorage` in `try` as the script does, since storage can be blocked. Both themes should have an empty `issues` list. Offer the choice with an [`ESegmented`](/components/Segmented) or an [`ESelect`](/components/Select).
