# Handing this to Vue

The CSS is the source of truth and is framework-free: `tokens.css` (generated from `tokens.json`, every family, not only colours) and `components/bundle.css` copy across unchanged, with the same `op-` class names. What changes is the component code. This page says how each convention in the React bundle maps to Vue 3, lists the composables to write, and lists every component's API. The layers and what each component is built from are in the Architecture page.

## Conventions

| In the bundle | In Vue 3 |
| --- | --- |
| `value` or `checked` plus `onChange(value, event)` | `v-model` (`modelValue` and `update:modelValue`) for the main value. The value is always the first argument, so the mapping is one to one. Components with two values use named models: `v-model:start` and `v-model:end` on the range picker |
| `defaultValue` | An optional initial value when `modelValue` is not passed (uncontrolled use). Keep both; `defineModel` with a local default does it |
| `onX(...)` callbacks | `emit("x", ...)`, declared with `defineEmits`. The Emits column below lists them |
| `children` | The default slot |
| Props that take a node (`action`, `actions`, `header`, `footer`, `sidebar`, `logo`, `status`, `trigger`) | Named slots with the same names |
| A function as children (`FormField`) | A scoped slot: `<FormField v-slot="{ id, ariaInvalid, ariaDescribedby }">` |
| Column `render(row)` in DataGrid | A scoped slot per column: `#cell-date="{ row }"`. Keep `value(row)` as a prop, since it feeds sort and filter |
| Native attributes on inputs (`name`, `autoComplete`, `aria-*`, `data-*`) | `inheritAttrs: false` and `v-bind="$attrs"` on the `input`, so a consumer's attributes land on the input, not the wrapper |
| `ItemsCtx` (a flag so a lone ItemRow wraps itself in an ItemList) | `provide` in ItemList and `inject` in ItemRow |
| `ToastProvider` and `useToast()` | `provide` the same API from a plugin or a root component; render the region once. `app.use(OpenPractice, { locale, currency })` is a good place |
| `configure({ locale, currency, dir, messages })` and `t(key, vars)` | A plugin that holds the same config as a reactive object. If the app uses vue-i18n, build `messages` from it and set `locale` from `useI18n().locale`; the date and number formats then follow without any other change |
| `React.useEffect` blocks | `watch` or `onMounted` and `onBeforeUnmount` for listeners |
| Icons by name (`<Icon name="search">`) | A single `Icon` component mapping the same names to Phosphor (`@phosphor-icons/vue`, regular and bold weights). `Icon.names` becomes the list of keys |
| `useState` inside DataGrid and Calendar | `ref` and `computed`. Sorting, filtering and the virtual window are pure functions of the inputs and move over as they are |
| Container queries in CSS | Unchanged: they are CSS |

## Composables to write

| Name | What it does | Used by |
| --- | --- | --- |
| `useUid(prefix)` | A stable unique id. `useId()` from Vue 3.5 or a counter | Every field |
| `useFloating(open, anchor, panel)` | Places a manual popover under its anchor: matches the anchor width, flips above when short of room, closes on an outside press | Select, Combobox, DatePicker, DateRangePicker |
| `usePopover()` | The same for a native `popover="auto"` trigger | Popover, Menu |
| `useLocale()` | The configured locale, month and weekday names, week start, date order, `formatDate`, `parseDate`, `formatMoney` | Calendar, pickers, AmountFigure |
| `useToast()` | `show`, `dismiss`, `clear` | Anything that confirms an action |
| `useControllable(props, name)` | The controlled or uncontrolled pattern (11 components): a prop wins when passed, otherwise local state | Most form controls |

## Porting order

1. Tokens and CSS (`tokens.css`, `bundle.css`, fonts: self-host Jost and Spline Sans Mono), the plugin with `configure`, and `Icon`.
2. Primitives and building blocks (layers 1 and 2): they have almost no logic, and everything else is made of them.
3. The form field family: the shell (`FormField`, `Fieldset`), `Field`, `Textarea`, `Checkbox`, `RadioGroup`, `Switch`, `NumberField`, `SegmentedControl`, `FileUpload`, `OtpField`.
4. The floating family: `useFloating`, then `Select`, `Combobox` (with `Autocomplete` and `MultiSelect`), `Calendar`, `DatePicker`, `DateRangePicker`, `Popover`, `Menu`, `Tooltip`.
5. Containers and feedback: `Dialog`, `Drawer`, `Notice`, `Toast` and its provider, `Panel`, `Tabs`, `Accordion`, `Disclosure`.
6. `DataGrid`, then the account components and the composite controls (`PasswordField`, `AddressFields`, `SignatureField`, `ErrorSummary`).
7. The page: `AppShell`, `AppHeader`, `PageHeader`, navigation. Then port the six patterns as pages, as the first integration test of the port.

## Tests to carry over

`tests/suite.js` has 49 tests, each one a short story: mount, act with real events, assert on the DOM. They are written with three helpers (`mount`, `setValue`, `key`) so each ports one for one to Vitest with Vue Test Utils or Testing Library:

```js
// suite.js
test("Checkbox: onChange gets the checked state first", () => mount(h(P.Checkbox, { label: "Agree", onChange: c => a.push(c) })).then(m => { m.$(".op-check").click(); ... eq(a, [true]) }));

// Vitest + Vue Testing Library
test("Checkbox emits the checked state", async () => {
  const { emitted } = render(Checkbox, { props: { label: "Agree" } });
  await userEvent.click(screen.getByRole("checkbox", { name: "Agree" }));
  expect(emitted()["update:modelValue"][0]).toEqual([true]);
});
```

- Keep the layout tests (Notice, ItemRow, DataGrid cards, AppointmentCard height) in a real browser with Playwright: they need a layout engine.
- Run axe-core against every story and every pattern, with listboxes, calendars and menus open, and fail the build on any component-level violation. Add the Accessibility page's contrast table as a snapshot test generated from the tokens.
- Add visual snapshots (Playwright screenshots at 360 and 1024px) for every preview card.
- The build's lint (no local named `t`, every export defined, valid syntax) becomes an ESLint rule and a type check.

## Component APIs

`components/index.d.ts` lists every component's props. Each `on…` prop becomes an emit, each prop that takes a node becomes a slot, and `children` is the default slot.
