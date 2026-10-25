---
title: API reference
description: "Every export of @eos-ui/vue that is not a component: createEos, the config, themes, messages, icons and composables, with signatures."
---

# API reference

Everything below is exported from `@eos-ui/vue`. The components have [their own pages](/components/). Other entry points: `@eos-ui/vue/style.css` (required), `@eos-ui/vue/fonts.css`, `@eos-ui/vue/components/E<Name>` (one component), `@eos-ui/vue/plugin` (`createEos` and `themeCss`), `@eos-ui/vue/icons/builtin` (registers the built-in icons, which the per-component paths leave out), `@eos-ui/vue/globals` (opt-in global component types), `@eos-ui/vue/resolver`, `@eos-ui/vue/icons`, `@eos-ui/vue/icons/iconify`, and `@eos-ui/vue/llms.txt`. See [Install options](/guide/install). The package is ESM only.

## Plugin

### `createEos(options?)`

```ts
function createEos(options?: EosOptions): Eos;
```

Provides the config and a toast store, and applies the theme in a browser. Install it with `app.use()`.

```ts
createApp(App).use(createEos({ locale: "en-CA", currency: "CAD", theme: { brand: "#2c95b4" } }));
```

| Option | Type | Default | What it does |
| --- | --- | --- | --- |
| `locale` | `string` | `"en-US"` | BCP 47 tag: month and weekday names, week start, date order, number formats. In a browser, a given locale is also set as `lang` on the theme target |
| `currency` | `string` | `"USD"` | ISO 4217 code for amounts |
| `dir` | `"ltr" \| "rtl" \| null` | `null` | Text direction. `null` follows the locale when you give one (`ar`, `he`, `fa` and `ur` are right to left), and the document otherwise. Sets `dir` on the theme target |
| `messages` | `Record<string, MessageValue>` | `{}` | Overrides for any word, by key. See [Words and language](/guide/language) |
| `icons` | `IconsConfig` | `{}` | Where icons come from. See [Icons](/guide/icons) |
| `portalTarget` | `string \| HTMLElement` | `"body"` | Where menus, dialogs, tooltips and toasts render |
| `theme` | `Theme \| ThemeInput` | None | A theme from `defineTheme()`, or the same options. Left out, nothing is applied: `style.css` already carries the default theme |
| `themeTarget` | `HTMLElement \| null` | `document.documentElement` | The element the theme is applied to |
| `applyTheme` | `boolean` | `true` | Adds the theme to the document as a stylesheet scoped to `themeTarget`, in the `e.tokens` layer, so your own CSS still wins and the theme's light, dark and contrast variants follow the visitor. Turn it off when the page ships the theme as CSS itself (`themeCss()` in a `<style>`, or a stylesheet of its own). `lang` and `dir` are still set |
| `warnOnContrast` | `boolean` | `true` outside production | Warns in the console when the theme fails a contrast pair |

It returns an `Eos`:

```ts
interface Eos {
  install(app: App): void;
  config: EosConfig; // reactive: change config.locale or config.messages and components follow
  theme: Theme;
}
```

`createEos()` does not touch `document` or `window` on the server. Unmounting the app removes the theme it added. `theme` on the returned object is the theme you passed, built, or the default theme `style.css` carries.

### `themeCss(theme?, selector?)`

```ts
function themeCss(theme?: Theme | ThemeInput, selector?: string): string;
```

The theme as CSS, for rendering into `<head>` on the server. `selector` defaults to `:root`. With no theme it returns the default theme that `style.css` carries. See [Nuxt and SSR](/guide/ssr).

## Config

### `useConfig()`

```ts
function useConfig(): EosConfig;
```

The reactive config that `createEos()` provided, or a fallback (English, US dollars) when the plugin is not installed.

```ts
interface EosConfig {
  locale: string;
  currency: string;
  dir: "ltr" | "rtl" | null;
  messages: Record<string, MessageValue>;
  icons: IconsConfig;
  portalTarget: string | HTMLElement;
}
```

### `CONFIG_KEY`

```ts
const CONFIG_KEY: InjectionKey<EosConfig>;
```

The key `createEos()` provides the config under. To change the theme, language or words of one part of the page, use [`EConfigProvider`](/components/ConfigProvider) rather than providing a config yourself.

### `usePortalTarget()`

```ts
function usePortalTarget(): ComputedRef<string | HTMLElement>;
```

The `to` for a `Teleport` in your own floating part, so it inherits a scoped theme: `<Teleport :to="portal">`.

### `useDir()`

```ts
function useDir(): ComputedRef<"ltr" | "rtl">;
```

The direction to use: `dir` from `createEos()` when set, otherwise the one the locale is written in. Give it to anything you build on a library that assumes left to right, such as Reka UI's `ConfigProvider`.

### `useLogicalSide(side)`

```ts
function useLogicalSide(side: () => LogicalSide): ComputedRef<"top" | "bottom" | "left" | "right">;
type LogicalSide = "top" | "bottom" | "start" | "end";
```

The physical side for a floating part of your own: `start` and `end` become `left` and `right` in a left-to-right page, and the other way round in a right-to-left one.

### `useMessages()`

```ts
function useMessages(): Translate;
type Translate = (key: MessageKey | (string & {}), vars?: Record<string, string | number>) => string;
```

Returns `t(key, vars)`. It fills `{name}` placeholders from `vars` and picks a plural form from `vars.n`. An unknown key returns the key. Reactive: changing the locale or messages re-renders what uses it.

```ts
const t = useMessages();
t("pageN", { n: 3 }); // "Page 3"
```

### `defaultMessages`

```ts
const defaultMessages: Record<MessageKey, MessageValue>;
```

Every word the components say, by key. Types: `MessageKey`, `MessageValue` (a string, or a `PluralMessage`), `PluralMessage` (`{ other: string; one?: string; ... }` keyed by `Intl.PluralRules` category).

### `useIconResolver()`

```ts
function useIconResolver(): (icon: string | Component, bold: boolean) => ResolvedIcon;
```

Turns an icon name, or a component, into something renderable. Use it to draw icons the way `EIcon` does, from your set. Order: a component as given, then `icons[name]`, then `resolve(alias ?? name)`, then the built-in icon. Otherwise `{ kind: "none" }`, with one warning in development.

`ResolvedIcon` is `{ kind: "component"; component } | { kind: "svg"; html } | { kind: "glyph"; html; viewBox } | { kind: "none" }`.

### Icon values

`phosphor` is the built-in set. `iconNames` lists the names components ask for, and `IconName` is their type. Also exported: the types `IconProp`, `IconSource`, `IconsConfig`, `IconContext` and `IconMarkup`.

## Theme

### `defineTheme(input)`

```ts
function defineTheme(input: ThemeInput): Theme;
```

Re-exported from `@eos-ui/tokens`. Derives every token from a few colours and checks the contrast of each pair the system promises.

The inputs, with their types and what each one derives, are listed once, under [The inputs](/guide/theming#the-inputs) in Theming.

A `Theme` has:

| Member | What it is |
| --- | --- |
| `name` | The theme's name |
| `tokens` | Every token, by name without the leading `--` |
| `issues` | Contrast pairs that fail, variants included. Empty when the theme is sound |
| `alternates` | Tokens that change under a media query (`scheme: "auto"`, `contrast: "auto"`), in cascade order. Each is `{ media, scheme, tokens }`. Empty for a fixed theme |
| `warnings` | Inputs that were ignored or adjusted, and contrast pairs that could not be evaluated, as sentences |
| `explain(token)` | Where a token's value comes from: its value, the inputs that drive it, which of them you gave, and its usage note |
| `css({ selector?, layer?, header? })` | The theme as CSS custom properties, media queries included. `layer: false` writes them outside `@layer e.tokens` |
| `apply(el?)` | Sets the tokens on an element as inline custom properties, follows the media queries, and returns a function that removes them again. Browser only |
| `dtcg()` | The tokens as W3C Design Tokens JSON |

See [Theming](/guide/theming) and the [Token reference](/guide/tokens). Types: `Theme`, `ThemeInput`.

### Shared types

`Size` (`"sm" | "md" | "lg" | "xl"`), `Tone` and `ElementTag` are the vocabulary the components' props narrow with `Extract`, such as `size?: Extract<Size, "sm" | "md">`.

## Composables

Signatures only. What each one is for, with examples, is on [Composables](/guide/composables).

### `useToast()`

```ts
function useToast(): ToastApi;

interface ToastApi {
  show(options: ToastOptions): string; // returns the toast's id
  update(id: string, patch: Partial<ToastOptions>): void; // changes a toast on screen and restarts its timer
  promise<T>(promise: Promise<T>, options: ToastPromiseOptions<T>): Promise<T>; // loading, then success or error
  dismiss(id: string): void;
  clear(): void;
}

type ToastTone = "neutral" | "info" | "success" | "warning" | "danger";

interface ToastOptions {
  title: string;
  message?: string;
  tone?: ToastTone; // "info" by default
  icon?: IconProp; // replaces the tone's icon
  closable?: boolean; // the Dismiss button. true by default, and always shown when duration is 0
  key?: string; // a toast with the same key updates the one on screen instead of adding another
  action?: VNodeChild | (() => VNodeChild);
  duration?: number; // ms. 0 stays. 5000, or 0 for danger and for a toast with an action
}

interface ToastPromiseOptions<T> {
  loading: string | Omit<ToastOptions, "tone">;
  success: string | Omit<ToastOptions, "tone"> | ((value: T) => string | Omit<ToastOptions, "tone">);
  error: string | Omit<ToastOptions, "tone"> | ((reason: unknown) => string | Omit<ToastOptions, "tone">);
}
```

`update()` with a new `tone` or `action` and no `duration` takes that tone's default again, so a toast turned into `danger` stays. `promise()` returns the promise it was given, so the caller still handles the result; the error toast is `danger`.

Also exported: `createToasts()` (a `ToastStore`: the `ToastApi` plus `items`, `limit`, `pause` and `resume`), `TOAST_KEY`, and the types `ToastItem`, `ToastApi` and `ToastStore`. See [Toasts and notifications](/guide/toasts).

### `useAnnouncer()`

```ts
function useAnnouncer(): { announce(message: string, options?: AnnounceOptions): void };
interface AnnounceOptions {
  assertive?: boolean;
}
```

[Guide](/guide/composables#useannouncer)

### `useShortcuts(map, options?)`

```ts
function useShortcuts(map: ShortcutMap, options?: ShortcutOptions): () => void;
type ShortcutMap = Record<string, (event: KeyboardEvent) => void>;
interface ShortcutOptions {
  target?: MaybeRefOrGetter<EventTarget | null | undefined>;
  enabled?: MaybeRefOrGetter<boolean>;
  allowInInputs?: boolean;
  preventDefault?: boolean; // default true
}
function formatShortcut(combo: string, apple?: boolean): string[];
```

[Guide](/guide/composables#useshortcuts-map-options)

### `useCopy(options?)`

```ts
function useCopy(options?: CopyOptions): CopyState;
interface CopyOptions {
  timeout?: MaybeRefOrGetter<number>; // ms `copied` stays true. Default 2000
  announce?: boolean; // default true
}
interface CopyState {
  copied: Readonly<Ref<boolean>>;
  failed: Readonly<Ref<boolean>>;
  copy(text: string): Promise<boolean>;
}
```

[Guide](/guide/composables#usecopy-options)

### `useLocale()`

```ts
function useLocale(): {
  locale: ComputedRef<string>;
  dir: ComputedRef<"ltr" | "rtl">;
  months: ComputedRef<string[]>;
  monthsShort: ComputedRef<string[]>;
  weekdays: ComputedRef<string[]>; // Sunday first
  weekdaysShort: ComputedRef<string[]>;
  weekStart: ComputedRef<number>; // 0 is Sunday
  dateOrder: ComputedRef<("month" | "day" | "year")[]>;
  dateSeparator: ComputedRef<string>;
  dateFormatLabel(): string; // "MM/DD/YYYY"
  formatDate(d: Date | null | undefined): string; // "10/22/2026"
  parseDate(s: string): Date | null;
  formatLong(d: Date): string;
  formatMoney(n: number, options?: { locale?: string; currency?: string }): string;
};
```

Reads the configured locale, so changing it re-renders everything that uses it. `formatMoney` always shows two decimals.

[Guide](/guide/composables#smaller-helpers)

### `useReducedMotion()`

```ts
function useReducedMotion(): () => boolean;
```

Returns a function that says whether the person asked for less motion (`prefers-reduced-motion: reduce`). Call it when the motion starts, so it follows a change of the setting. On the server it says no.

[Guide](/guide/composables#smaller-helpers)

### `useUid(given?)`

```ts
function useUid(given?: MaybeRefOrGetter<string | undefined>): ComputedRef<string>;
```

[Guide](/guide/composables#smaller-helpers)

### `useFieldAttrs()`

```ts
function useFieldAttrs(): {
  wrapper(): { class: unknown; style: unknown };
  input(describedby?: DescribedBy | readonly DescribedBy[]): Record<string, unknown>; // ids in front of the consumer's aria-describedby
  group(describedby?: DescribedBy | readonly DescribedBy[]): Record<string, unknown>; // the same, with focus and blur as focusin and focusout
};
type DescribedBy = string | false | null | undefined;
```

[Guide](/guide/composables#smaller-helpers)

### `useQuietFocus(open, inside)`

```ts
function useQuietFocus(
  open: Ref<boolean>,
  inside: (el: Element) => boolean,
): {
  intent(): void; // call on the person's pointer or key on the trigger
  personOpened(): boolean; // true once if `intent()` came first
  returnsFocus(): boolean; // whether focus was inside when the popup closed
  undoFocusSteal(): void; // hands focus back for a short window after an outside open
};
```

[Guide](/guide/composables#smaller-helpers)

### `focusInside(event)`

```ts
function focusInside(e: MouseEvent): void;
```

[Guide](/guide/composables#smaller-helpers)

### `useOverflow(scroller, watch?, options?)`

Advanced.

```ts
function useOverflow(
  scroller: Ref<HTMLElement | null>,
  watch?: MaybeRefOrGetter<HTMLElement | null>[], // other elements whose size can change it
  options?: UseOverflowOptions,
): Ref<boolean>;
interface UseOverflowOptions {
  children?: boolean; // also watch the scroller's children as they come and go
}
```

Whether an element scrolls: its content is wider or taller than it is. Make a scrolling region a tab stop and a named landmark only while this is true. It is `false` until mounted, so the server and the first client render agree.

[Guide](/guide/composables#smaller-helpers)

