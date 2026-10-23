---
title: API reference
description: "Every export of @eos-ui/vue that is not a component: createEos, the config, themes, messages, icons and composables, with signatures."
---

# API reference

Everything below is exported from `@eos-ui/vue`. The components have [their own pages](/components/). Other entry points: `@eos-ui/vue/style.css` (required), `@eos-ui/vue/fonts.css`, `@eos-ui/vue/resolver`, `@eos-ui/vue/icons`, `@eos-ui/vue/icons/iconify`, and `@eos-ui/vue/llms.txt`. The package is ESM only.

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
| `theme` | `Theme \| ThemeInput` | the light theme | A theme from `defineTheme()`, or the same options |
| `themeTarget` | `HTMLElement \| null` | `document.documentElement` | The element the theme is applied to |
| `warnOnContrast` | `boolean` | `true` outside production | Warns in the console when the theme fails a contrast pair |

It returns an `Eos`:

```ts
interface Eos {
  install(app: App): void;
  config: EosConfig; // reactive: change config.locale or config.messages and components follow
  theme: Theme;
}
```

`createEos()` does not touch `document` or `window` on the server.

### `themeCss(theme?, selector?)`

```ts
function themeCss(theme?: Theme | ThemeInput, selector?: string): string;
```

The theme as CSS, for rendering into `<head>` on the server. `selector` defaults to `:root`. See [Nuxt and SSR](/guide/ssr).

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

The key `createEos()` provides the config under. Provide a different `EosConfig` under it to change the language of one subtree. You rarely need it.

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

| Input | Type | What it sets |
| --- | --- | --- |
| `name` | `string` | The `data-e-theme` value |
| `brand`, `accent`, `danger`, `warning` | colour | Action and status colours, each derived to hold contrast |
| `background`, `surface`, `foreground` | colour | Ground, cards and fields, text and lines |
| `fonts` | `{ sans?, mono?, script? }` | Full `font-family` stacks for text, code and signatures. Nothing is bundled |
| `radius` | `"sharp" \| "default" \| "round" \| { sm?, md?, lg? }` | Corners |
| `textScale`, `spaceScale` | `number` | Multipliers for the type and space scales |
| `strokes` | `{ hair?, focus?, edge?, card? }` | Line weights in px |
| `contrast` | `"standard" \| "high" \| "auto"` | Full-strength lines and secondary text. `auto` switches to `high` under `prefers-contrast: more` |
| `scheme` | `"light" \| "dark" \| "auto"` | `auto` follows `prefers-color-scheme` and applies `dark` on a dark page |
| `dark` | `ThemeVariant` | What changes on a dark page when `scheme` is `auto`. The grounds are never inherited |
| `density` | `"comfortable" \| "compact"` | `compact` tightens the space scale and makes controls the 44px tap target |
| `motion` | `"default" \| "snappy" \| "gentle" \| "none"` | Durations and easing |
| `elevation` | `"outline" \| "lifted" \| "bold"` | How depth is drawn |
| `preset` | `"paper" \| "ink" \| "quiet"` | A named look that sets `elevation`, `strokes`, `radius` and `motion` together. Your own entries win |
| `controlHeight` | `number` | Height in px of every tappable control |
| `tokens` | `Record<string, string>` | Any token by name. Wins over everything derived |
| `strict` | `boolean` | Throw on a contrast failure instead of listing it |

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
| `apply(el?)` | Sets the tokens on an element as inline custom properties, and follows the media queries. Browser only |
| `dtcg()` | The tokens as W3C Design Tokens JSON |

See [Theming](/guide/theming) and the [Token reference](/guide/tokens). Types: `Theme`, `ThemeInput`.

### Tokens at a glance

Tokens are CSS custom properties named `--e-*`. The families:

| Family | Examples |
| --- | --- |
| Colour | `--e-primary`, `--e-secondary`, `--e-danger`, `--e-ink`, `--e-muted`, `--e-surface`, `--e-surface-tint`, `--e-background`, `--e-border` |
| Type | `--e-font-sans`, `--e-font-mono`, `--e-text-xs` to `--e-text-4xl` |
| Space | `--e-space-1` to `--e-space-8`, then `--e-space-10`, `-12` and `-16` |
| Shape | `--e-radius-sm`, `--e-radius-md`, `--e-radius-lg`, `--e-stroke-hair`, `--e-stroke-card`, `--e-stroke-edge` |
| Depth | `--e-frame`, `--e-well`, `--e-float` |
| Sizes | `--e-control-height`, `--e-chip-height` |
| Motion | `--e-duration-tap`, `--e-duration-move`, `--e-easing-out` |

The full list, with usage and contrast, is the [Token reference](/guide/tokens).

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
function isApple(): boolean;
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

Reads the configured locale, so changing it re-renders everything that uses it. `formatMoney` always shows two decimals. Also exported: `localeDirection(locale)`, the direction a locale is written in (`"rtl"` for Arabic, Hebrew, Persian and Urdu, else `"ltr"`).

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
  input(describedby?: string): Record<string, unknown>;
};
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

### `useDetails(open, options?)`

Advanced. For a component of your own built on `<details>`.

```ts
function useDetails(
  open: Ref<boolean | undefined>,
  options?: { group?: MaybeRefOrGetter<string | undefined>; disabled?: MaybeRefOrGetter<boolean | undefined> },
): { details: ComputedRef<object>; summary: ComputedRef<object> };
```

Bind `details` to the `<details>` and `summary` to its `<summary>`. The native `toggle` event writes back to `open`, so a click, the keyboard, a `group` that closes its siblings and your `v-model:open` stay in step. A disabled summary stays focusable with `aria-disabled`. `EDisclosure` and `EExpandableRow` use it.

[Guide](/guide/composables#smaller-helpers)

### `useOverflow(scroller, watch?)`

Advanced.

```ts
function useOverflow(scroller: Ref<HTMLElement | null>, watch?: MaybeRefOrGetter<HTMLElement | null>[]): Ref<boolean>;
```

Whether an element scrolls: its content is wider or taller than it is. Make a scrolling region a tab stop and a named landmark only while this is true. It is `false` until mounted, so the server and the first client render agree.

[Guide](/guide/composables#smaller-helpers)

### `useSize(props, component)`

Advanced.

```ts
type Size = "sm" | "md" | "lg";
function useSize(props: { size?: Size; small?: boolean; large?: boolean }, component: string): ComputedRef<Size>;
```

The size of a component that takes `size` and the older `small` and `large` flags. `size` wins, and giving both warns in development.

[Guide](/guide/composables#smaller-helpers)

### `useFieldControl(props)`

Advanced. For a text-like field of your own; use `ETextField` when you can.

```ts
function useFieldControl<El extends HTMLElement = HTMLInputElement>(props: FieldControlProps): {
  attrs: ReturnType<typeof useFieldAttrs>;
  input: Ref<El | null>;
  shell(invalid?: boolean | string): object; // props for the input shell
  bind(field: FieldSlot, describedby?: DescribedBy[]): Record<string, unknown>; // id, aria-*, required, disabled, readonly, data-size
  hidden(name: string | undefined, value: string | number | null | undefined): object; // a hidden input that posts the value
  exposed: { input: Ref<El | null>; focus(): void };
};
```

Use it with `defineOptions({ inheritAttrs: false })` and `defineExpose(control.exposed)`. It does what the library's own fields share: the id, `aria-invalid`, `aria-describedby` (your ids, the hint or error id, then the consumer's own), and the hidden input for a `name`.

[Guide](/guide/composables#smaller-helpers)

### `useFormField(entry)`

Advanced.

```ts
interface FormFieldEntry {
  id: () => string; // the control's id, which the summary links to
  label: () => string;
  error: () => string | undefined;
}
function useFormField(entry: FormFieldEntry): void;
```

Registers a field of your own with the [`EForm`](/components/Form) around it so its `error` is listed in the error summary. Outside a form it does nothing. Also exported: `FORM_KEY`, the injection key `EForm` provides, and the `FormContext` type.

[Guide](/guide/composables#smaller-helpers)
