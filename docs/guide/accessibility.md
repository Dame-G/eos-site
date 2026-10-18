---
title: Accessibility
description: "The target, the contrast of every colour pair, keyboard use, forced colours, reduced motion and what is tested."
---

# Accessibility

**Target:** WCAG 2.2 level AA throughout, and AAA for text contrast wherever the brand allows. WCAG 3.0 is still a draft, so Eos claims nothing against it.

## What is tested

- **axe-core** runs over every component in a real browser, in every state that changes the page: open, invalid, disabled, loading. Page-level rules (landmarks, document title) are checked on whole pages.
- **Keyboard tests** cover every interactive component.
- **This site** runs axe on every demo and every [pattern](/patterns/) on each change. A violation or console error fails the build.
- **Contrast** of every text and surface pair is computed from the tokens at build time.

**Needs a person:** real screen readers (NVDA, JAWS, VoiceOver, TalkBack), the text-spacing override (WCAG 1.4.12), zoom to 200% and 400%, real touch devices, and forced colours in a real browser. Automation finds about a third of accessibility problems. Test your own pages with people.

## Contrast

Every pair is generated from `@eos-ui/tokens` at build time. `defineTheme()` checks the same pairs for your theme.

<ContrastTable />

WCAG 2 needs 4.5:1 for small text (AA) and 7:1 for AAA. Edges, outlines and fills that must show on white need 3:1. Pale tints (`*-soft`, `surface-tint`) are about 1.1:1 against white, so they never mark a boundary alone: every tinted chip, stamp or notice is also outlined in its strong colour.

See every colour with its partner on the [tokens page](/tokens#colour).

### White text on deep action colours

The logo blue gives moderate contrast with black text and too little with white. Eos uses deep action colours with white text instead: `primary`, `secondary` and `danger`. Every filled control and selected state reaches 7.9:1 or better. The exact logo colours stay available as `brand-blue` and `brand-green` for brand surfaces and never carry text.

`defineTheme()` derives the deep action colour from your brand colour so white text reaches 7:1.

### Two focus colours

Buttons, links, tabs and rows use a black focus ring (21:1). Text inputs and everything built on them use the primary teal (7.9:1), and red when invalid. The colour tells a person which kind of control they are on. Focus is never removed.

## Keyboard

| Component | Keys |
| --- | --- |
| Select | Enter, Space, ArrowDown and ArrowUp open it; arrows move and skip disabled options; Home and End; letters jump to an option; Escape closes and returns focus |
| Combobox, Autocomplete, MultiSelect | Focus stays in the input; arrows move through options; Enter chooses; Escape closes; each tag has a labelled Remove button |
| Calendar | Arrows move by day and week (mirrored in right to left); Page Up and Page Down by month, with Shift by year; Home and End; Enter chooses; Escape goes back a step |
| Tabs | Roving focus with arrows, Home and End |
| Menu, Popover | Escape closes; arrows move between menu items |
| Dialog, Drawer | Focus moves in and is trapped; Escape closes; focus returns to the opener |
| Checkbox, Radio, Switch | Native inputs, styled. Space toggles; arrows move between radios |

## Rules every component follows

- **Colour never carries meaning alone.** A status has a word and a glyph. A selected item is bold or outlined as well as coloured. Errors have an alert glyph.
- **Target size.** Every control is 48px tall (`--e-control-height`), and smaller buttons inside a field get a 48px tap area. Only links in running text and a few dense parts are smaller, all above the WCAG minimum of 24px.
- **Reduced motion.** Hover and press take 80ms. Everything else that moves stops under `prefers-reduced-motion`, and the loading bar becomes a static stripe.
- **Forced colours.** Selected states, checked controls, borders and the loading bar have rules for Windows high contrast (`Highlight`, `ButtonText`).
- **Forms.** Inputs take `autocomplete`. Errors appear in an [ErrorSummary](/components/ErrorSummary) and beside the field. Required and optional are words, not asterisks.
- **Language.** Set `lang` and `dir` on your `html` element. [Words and language](/guide/language) replaces every built-in word.
- **Headings are yours.** Components that render a title take `headingLevel`, so a page keeps one `h1` and a sensible outline.
