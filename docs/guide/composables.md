---
title: Composables
description: "useAnnouncer, useShortcuts, useCopy, useToast and the smaller helpers: when to reach for each one."
---

# Composables

Functions to call inside `setup()`. Each is exported from `@eos-ui/vue`. This page says what each one is for. The types and signatures are in the [API reference](/guide/api#composables).

| I want to | Use |
| --- | --- |
| Tell a screen reader something that is not on screen | [`useAnnouncer`](#useannouncer) |
| Run code on a key press | [`useShortcuts`](#useshortcuts-map-options) |
| Copy text and show that it worked | [`useCopy`](#usecopy-options) |
| Show a message that goes away | [`useToast`](#usetoast) |
| Format a date or an amount like the components do | [`useLocale`](#smaller-helpers) |
| Build my own field or popup | [`useUid`, `useFieldAttrs`, `useQuietFocus`](#smaller-helpers) |

## `useAnnouncer()`

Says something to screen reader users without showing it. One hidden live region per politeness is shared by the whole page and created on first use. On the server it does nothing.

```ts
const { announce } = useAnnouncer();
announce("3 rows selected");
announce("Payment failed", { assertive: true }); // interrupts: for errors
```

Announce the result of an action the person cannot otherwise see. Do not repeat what is already in a live region on screen. The same message twice in a row is still spoken.

## `useShortcuts(map, options?)`

Binds keys to functions for as long as the component lives, and returns a function that removes them early.

```ts
useShortcuts({
  "mod+k": openSearch, // Cmd on Apple devices, Ctrl elsewhere
  "mod+shift+p": openPalette,
  escape: close,
  "?": showHelp,
});
```

Combine `mod`, `ctrl`, `cmd` (or `meta`), `alt` and `shift` with `+`. Key names are `event.key` in lower case, with `esc`, `space`, `up`, `down`, `left` and `right` as short forms. Modifiers must match exactly. Shift is ignored for symbols such as `?`.

- Key-only shortcuts (no Ctrl, Cmd or Alt) are skipped while a text field has focus, so typing "g" in a search box does not fire `g`. Shortcuts with a modifier, and Escape, still run. Set `allowInInputs` to change that.
- A held key does not repeat, and text being composed (an IME) is left alone.
- Options: `target` (an element or ref, the document by default), `enabled` (a ref or getter), `allowInInputs`, `preventDefault` (on by default).

`formatShortcut("mod+k")` gives the keycaps to show in [`EKbd`](/components/Kbd): `["⌘", "K"]` on a Mac, `["Ctrl", "K"]` elsewhere. [`ECommandPalette`](/components/CommandPalette) uses both.

## `useCopy(options?)`

Copies text and tells you when it worked. [`ECopyButton`](/components/CopyButton) and [`ECodeBlock`](/components/CodeBlock) use it.

```ts
const { copied, failed, copy } = useCopy({ timeout: 2000 });
await copy("npm install @eos-ui/vue"); // true if it reached the clipboard
```

`copied` and `failed` go back to false after `timeout` (2000 ms). "Copied" is announced politely and "Couldn't copy" assertively through `useAnnouncer`. Pass `announce: false` to stay silent. Where the async clipboard is missing (an insecure page) it falls back to selecting hidden text.

## `useToast()`

Shows a toast from anywhere in an app that installed `createEos()`, or from inside an [`EToastProvider`](/components/ToastProvider) without the plugin. The toast appears once an `EToastProvider` is mounted. See [Toasts and notifications](/guide/toasts).

```ts
const toast = useToast();
toast.show({ title: "Saved", tone: "success" });
```

## Smaller helpers

- `useUid(given?)`: a stable id for wiring a label, hint and error to a control. It matches between server and client. Pass the component's own `id` prop to let the consumer choose: `useUid(() => props.id)`.
- `useLocale()`: month and weekday names, the first day of the week, date order and separator, and formatting and parsing of dates and money, from the configured locale.
- `useFieldAttrs()`: for a control built on [`EField`](/components/Field). Keeps `class` and `style` on the wrapper and sends every other attribute to the real input. Use it with `defineOptions({ inheritAttrs: false })`.
- `focusInside(event)`: a `@click` handler for a boxed input. A click on the padding or the symbol puts the cursor in the input, and buttons and links inside keep their own click. The library's own fields use it. Most apps build fields from [`ETextField`](/components/TextField) or [`EField`](/components/Field) and never need it.
- `useQuietFocus(open, inside)`: for a popup of your own. A popup that opens or closes from outside (`v-model:open`, or open on first render) should not move focus, but one a person opened with the pointer or keys on its trigger should. Call `intent()` on that pointer or key, and `personOpened()` when the popup opens to ask which it was. `returnsFocus()` says whether focus was inside when it closed. `undoFocusSteal()` hands focus back to the element that had it, for a short window, when a popup library grabs it on mount.
- `useDir()`: the text direction to use, from `createEos({ dir })` or else the locale. Pass it to a third-party part that assumes left to right.
- `useConfig()`, `useMessages()`, `usePortalTarget()` and `useIconResolver()` read what `createEos()` provided: locale, words, where floating parts render and where icons come from. They are in the [API reference](/guide/api#config).
- `useDetails(open, options?)`, `useOverflow(scroller)`, `useSize(props, name)`, `useFieldControl(props)` and `useFormField(entry)` are the helpers the library's own components share, for a component of your own that should behave the same: `<details>` that toggles and groups, a region that is a tab stop only while it scrolls, `size` with the older `small` and `large` flags, the id and ARIA wiring of a text field, and registering a field with [`EForm`](/components/Form). They are [advanced](/guide/api#usedetails-open-options).
