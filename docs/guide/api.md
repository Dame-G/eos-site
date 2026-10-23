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
| `locale` | `string` | `"en-US"` | BCP 47 tag: month and weekday names, week start, date order, number formats |
| `currency` | `string` | `"USD"` | ISO 4217 code for amounts |
| `dir` | `"ltr" \| "rtl" \| null` | `null` | Text direction. `null` follows the document. Otherwise sets `dir` on the theme target |
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
| `fonts` | `{ sans?, mono? }` | Full `font-family` stacks. Nothing is bundled |
| `radius` | `"sharp" \| "default" \| "round" \| { sm?, md?, lg? }` | Corners |
| `textScale`, `spaceScale` | `number` | Multipliers for the type and space scales |
| `strokes` | `{ hair?, focus?, edge?, card? }` | Line weights in px |
| `contrast` | `"standard" \| "high"` | Full-strength lines and secondary text |
| `motion` | `"default" \| "snappy" \| "gentle" \| "none"` | Durations and easing |
| `elevation` | `"outline" \| "lifted" \| "bold"` | How depth is drawn |
| `controlHeight` | `number` | Height in px of every tappable control |
| `tokens` | `Record<string, string>` | Any token by name. Wins over everything derived |
| `strict` | `boolean` | Throw on a contrast failure instead of listing it |

A `Theme` has:

| Member | What it is |
| --- | --- |
| `name` | The theme's name |
| `tokens` | Every token, by name without the leading `--` |
| `issues` | Contrast pairs that fail. Empty when the theme is sound |
| `css({ selector?, layer?, header? })` | The theme as CSS custom properties. `layer: false` writes them outside `@layer e.tokens` |
| `apply(el?)` | Sets the tokens on an element as inline custom properties. Browser only |
| `dtcg()` | The tokens as W3C Design Tokens JSON |

See [Theming](/guide/theming) and the [Token reference](/guide/tokens). Types: `Theme`, `ThemeInput`.

### Tokens at a glance

Tokens are CSS custom properties named `--e-*`. The families:

| Family | Examples |
| --- | --- |
| Colour | `--e-primary`, `--e-secondary`, `--e-danger`, `--e-ink`, `--e-muted`, `--e-surface`, `--e-surface-tint`, `--e-background`, `--e-border` |
| Type | `--e-font-sans`, `--e-font-mono`, `--e-text-xs` to `--e-text-4xl` |
| Space | `--e-space-1` to `--e-space-8` |
| Shape | `--e-radius-sm`, `--e-radius-md`, `--e-radius-lg`, `--e-stroke-hair`, `--e-stroke-card`, `--e-stroke-edge` |
| Depth | `--e-frame`, `--e-well`, `--e-float` |
| Sizes | `--e-control-height`, `--e-chip-height` |
| Motion | `--e-duration-tap`, `--e-duration-move`, `--e-easing-out` |

The full list, with usage and contrast, is the [Token reference](/guide/tokens).

## Composables

### `useToast()`

```ts
function useToast(): ToastApi;

interface ToastApi {
  show(options: ToastOptions): string; // returns the toast's id
  dismiss(id: string): void;
  clear(): void;
}

interface ToastOptions {
  title: string;
  message?: string;
  tone?: "info" | "success" | "warning" | "danger";
  action?: VNodeChild | (() => VNodeChild);
  duration?: number; // ms. 5000 by default, 0 for none, 0 for danger and with an action
}
```

Throws outside an app that installed `createEos()` or provided `TOAST_KEY`, and outside an `EToastProvider`. See [Toasts and notifications](/guide/toasts).

Related exports: `createToasts()` makes a store (`ToastStore`: `items`, `show`, `dismiss`, `clear`, `pause`, `resume`). `TOAST_KEY` is the injection key. Types: `ToastTone`, `ToastItem`.

### `useAnnouncer()`

```ts
function useAnnouncer(): { announce(message: string, options?: AnnounceOptions): void };
interface AnnounceOptions {
  assertive?: boolean;
}
```

Speaks to screen readers without showing anything. Does nothing on the server.

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
```

Binds keys for as long as the component lives. Returns a function that removes them early.

`formatShortcut(combo, apple?)` returns the keycaps to show in [`EKbd`](/components/Kbd): `string[]`. `isApple()` says whether `mod` means Cmd.

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

### `useUid(given?)`

```ts
function useUid(given?: MaybeRefOrGetter<string | undefined>): ComputedRef<string>;
```

A stable id for a label, hint and error. Matches between server and client. Pass your `id` prop to let the consumer choose: `useUid(() => props.id)`.

### `useFieldAttrs()`

```ts
function useFieldAttrs(): {
  wrapper(): { class: unknown; style: unknown };
  input(describedby?: string): Record<string, unknown>;
};
```

For a control built on [`EField`](/components/Field), with `defineOptions({ inheritAttrs: false })`. `class` and `style` go to the wrapper. Everything else, joined `aria-describedby` included, goes to the input.

### `focusInside(event)`

```ts
function focusInside(e: MouseEvent): void;
```

A `@click` handler for a boxed input: a click on the padding or the symbol puts the cursor in the input. Buttons and links inside keep their own click. The library's own fields use it. Most apps build fields from [`ETextField`](/components/TextField) or [`EField`](/components/Field) and never need it.
