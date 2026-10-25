---
title: Why eos
description: "What eos is, how its themes keep contrast, what it is built on, and what it deliberately leaves out."
---

# Why eos

eos is a component library for Vue 3.5 and later: about eighty components, a plugin, a few composables and a token package. It is for forms, tables and the screens around them, where people read, compare and pay, and where text that is hard to read is a bug.

## A theme you cannot break by accident

A theme is a set of `--e-*` CSS variables. [`defineTheme()`](/guide/theming) builds every one of them from a few inputs, such as a brand colour, a surface and a font, and checks the colour pairs the components rely on: body text, secondary text, button labels, error text, card outlines, control edges and focus rings. When a brand colour is too light to carry white text, the action colour is derived from it, deep enough to pass, and the brand colour itself is kept for decoration. A pair that still fails is listed in `theme.issues`, and logged outside production.

The same inputs give a dark theme and a high-contrast one (`scheme` and `contrast`), and those are checked too. The layout rules (spacing rhythm, where depth is allowed, one control height) are not options, so a rebranded app still looks like one system. See [Design principles](/guide/design-principles).

## Built on Reka UI

The parts with the hardest keyboard and focus rules, such as Select, Combobox, Menu, Dialog, Tabs, Tooltip, Slider and the date pickers, are built on [Reka UI](https://reka-ui.com). eos adds the look, the labels, hints and errors, and the words.

## Accessible by default

eos targets WCAG 2.2 AA, and AAA for text contrast wherever the brand allows. Every field has a visible label, statuses have a word and an icon as well as a colour, and controls are at least the 44px tap target. Every component is tested with axe in a real browser. What is tested, and what is not, is on [Accessibility](/guide/accessibility).

## Any language, currency and direction

Every word a component writes is a message you can replace, with plural forms picked by the locale's rules. Dates, numbers and amounts follow `createEos({ locale, currency })`, and an Arabic, Hebrew, Persian or Urdu locale lays the page out right to left, with arrow keys that follow the reading direction. See [Words and language](/guide/language).

## Server rendering

Components render with `renderToString`, with ids that match between server and client. `themeCss()` writes the theme into the page head so the first paint is right. The JavaScript imports no CSS, so it runs in plain Node. See [Nuxt and SSR](/guide/ssr).

## What eos leaves out

- **No CommonJS or script-tag build.** It ships ES modules only.
- **One stylesheet.** All component CSS is in `@eos-ui/vue/style.css`, which you import once. There are no per-component CSS files and no CSS-in-JS.
- **No fonts by default.** The theme uses system fonts until you load your own, or opt in to `fonts.css` from Google Fonts. See [Install options](/guide/install#fonts).
- **No syntax highlighting.** `ECodeBlock` shows code; bring your own highlighter for colour.
- **No charts, rich-text editor or payment-card fields.** There are no components for these. Pair eos with a library that does them, and use the [tokens](/guide/tokens) for its colours.
- **No margins on components.** Spacing comes from layout components and colours from the theme. For anything else your own CSS wins over the library's [cascade layers](/guide/tailwind-and-css#layer-order) without `!important`.

eos is pre-1.0 and run by one maintainer. Minor versions can change the API; every change is in the [changelog](/changelog), with the ones that need a code change listed under **Breaking**.
