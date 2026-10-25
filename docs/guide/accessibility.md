---
title: Accessibility
description: "The target, contrast of every colour pair, keyboard use, built-in behaviour, how it is tested, known limitations and how to report an issue."
---

# Accessibility

eos targets WCAG 2.2 AA, and AAA for text contrast wherever the brand allows. Components are built to be used from the keyboard and to have an accessible name, and the automated checks under [How it is tested](#how-it-is-tested) hold them to it. Automated checks do not cover everything: test your own pages with real screen readers, zoom, touch and forced colours.

## Contrast

The ratios below come from `@eos-ui/tokens`. `defineTheme()` checks the same pairs for your theme. Text needs 4.5:1. Edges and focus rings need 3:1. Pale tints (`*-soft`) never mark a boundary alone.

<ContrastTable />

Filled controls use deep action colours with white text (7.9:1 or better in the default theme). `defineTheme()` derives each deep colour from your `brand`, `accent` or `danger` colour. On a dark `surface` it switches to light action colours with black text. Buttons and links have a solid focus ring in the ink colour. Inputs use the primary colour, and red when invalid.

## Keyboard

Every component page has a Keyboard section with its keys. The common ones:

| Component | Keys |
| --- | --- |
| [Select](/components/Select) | Enter, Space, ArrowDown and ArrowUp open. Arrows move, Home and End jump to the ends, letters jump to a match, Escape closes |
| [Combobox](/components/Combobox) (also free text and multiple) | Focus stays in the input. Arrows move, Enter chooses, Escape closes |
| [Calendar](/components/Calendar), [DatePicker](/components/DatePicker) | Arrows move by day and week, Page Up and Page Down by month (with Shift, by year), Home and End jump to the ends, Enter chooses |
| [Tabs](/components/Tabs) | Arrows, Home and End |
| [Menu](/components/Menu) | Arrows move between items, Escape closes |
| [Toggletip](/components/Toggletip) | Enter or Space opens the panel and moves focus into it, Tab moves through it, Escape closes and returns focus to the term |
| [Dialog](/components/Dialog), [Drawer](/components/Drawer) | Focus is trapped. Escape closes and focus returns to the opener |
| [CommandPalette](/components/CommandPalette) | Opens with Ctrl or Cmd and K by default. Arrows move, Enter runs, Escape closes |
| [DataGrid](/components/DataGrid) | Sort buttons and filters are in the tab order. Arrow keys resize a column edge |
| [Checkbox](/components/Checkbox), [RadioGroup](/components/RadioGroup), [Switch](/components/Switch) | Space toggles, arrows move between radios |
| [ToastProvider](/components/ToastProvider) | Timers pause while focus is on a toast, and it can be dismissed from the keyboard |

Add your own shortcuts with [`useShortcuts()`](/guide/composables#useshortcuts-map-options). Keys that type a character are ignored while a text field has focus.

## Built in

- Colour never carries meaning alone: statuses have a word and an icon.
- Controls share `--e-control-height`, 48px by default (`controlHeight`). A small button drops to the 44px [tap target](/guide/glossary#tap-target), `--e-tap`, and no target is smaller.
- Motion stops under `prefers-reduced-motion`.
- Selected states, borders and checked controls work in forced-colours mode.
- Required and optional are words, not asterisks. Inputs take `autocomplete`.
- Components that render a title take `headingLevel`, so the heading order is yours.
- Every field has a visible `label`. `hideLabel` keeps it for assistive technology only. See [Forms and validation](/guide/forms#labels).
- Changes nobody can see are announced with [`useAnnouncer()`](/guide/composables#useannouncer), and confirmations with [toasts](/guide/toasts).
- Set `lang` and `dir` on `<html>`. Words, dates and direction follow the locale: see [Words and language](/guide/language).
- Dark themes are checked for contrast like any other: see [Light and dark](/guide/theming#light-and-dark).

## How it is tested

- **Every component** has browser tests that run [axe](https://github.com/dequelabs/axe-core) on what it renders, open menus and dialogs included. Interactive components also have keyboard tests. They run in Chromium on every change.
- **Other browsers**: the same suite runs in Firefox and WebKit every night. That job reports failures but does not block a release.
- **A theme matrix** runs the core controls, and every tone of Tag, Stamp, Text, Metric, Highlight and Kbd, under the light, dark and high-contrast themes, left to right and right to left, through axe.
- **Right to left keyboard**: Slider, Menu, Tabs, DataGrid column resizing and OtpField are tested to follow the reading direction with the arrow keys.
- **Forced colours**: the rules each component sets under `forced-colors: active` are checked, so selected states, borders and focus rings keep a system colour.
- **Server rendering**: every component is rendered on the server from the built package, with and without the plugin, and must give the same HTML twice (stable ids) without a Vue warning.
- **This site** runs axe on every demo, guide example and pattern, and on whole pages in the light and dark scheme.

There is no automated screen reader testing, and no manual audit has been published.

## Known limitations

These are documented on the component pages:

- [AvatarGroup](/components/AvatarGroup): the avatars inside are not announced one by one. Put a list of links or buttons beside the group when each person must be reachable.
- [SignaturePad](/components/SignaturePad): drawing needs a pointer. Offer a typed signature as well, as [SignatureField](/components/SignatureField) does with `both`.
- [Slider](/components/Slider): tick marks are decoration, so do not rely on them to convey a value. Pass `valueText` so screen readers hear "$40" and not "40".
- [Textarea](/components/Textarea): the resize handle is a pointer control. Give people room with `rows` instead.
- [Tabs](/components/Tabs): tabs wider than the space scroll sideways with no scrollbar, so keep the labels short.
- [CurrencyField](/components/CurrencyField): the currency symbol is hidden from screen readers, so the label must say what the amount is.

## Report an accessibility issue

Open an issue on [GitHub](https://github.com/Dame-G/eos/issues) with the component, the browser and assistive technology you used, what you expected and what happened. Accessibility bugs are treated as bugs, not as security issues, so a public issue is the right place.
