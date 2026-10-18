# Porting from the React reference

Working notes for porting the original React design system into the public Eos library (in C:/dev/aegis, with this repo checked out beside it as ../eos-site). The visual and behavioural spec is the React design system in `../eos-site/reference/react/` (its READMEs, `src/*.js`, `bundle.css`, `index.d.ts` and `tests/suite.js`). The Vue components reproduce it with the same class names and the same CSS, written the way Vue and modern CSS want.

```
packages/tokens   @eos-ui/tokens   tokens.json -> CSS variables, defineTheme(), contrast checks
packages/vue      @eos-ui/vue      the components, plugin, composables
reference/react   the spec being ported (read only)
```

## Commands (run in `packages/vue`)

| Command                                                 | Use                                                                                                     |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `npx vitest run src/components/Chip`                    | tests for one component, in a real browser (Edge locally, Chromium in CI)                               |
| `node scripts/check-css.mjs`                            | every rule is inside `@layer e.*`, no `!important`, no raw z-index                                     |
| `node scripts/check-layers.mjs`                         | a component only uses components of its own layer or an earlier one                                     |
| `node scripts/css-parity.mjs --grep e-chip`            | compares your CSS with the reference `bundle.css`, rule by rule                                         |
| `npx vue-tsc --noEmit -p tsconfig.json`                 | types, including `.vue` files                                                                           |
| `node scripts/gen-index.mjs`                            | rewrites `src/index.ts` from what is on disk (never edit `src/index.ts`)                                |
| `corepack pnpm --filter @eos-ui/vue build` | the library build (needs `node ../tokens/scripts/build.mjs` once, which `build` and `test` already run) |

`pnpm` is only available as `corepack pnpm`. Do not run the full `build` or `test` scripts while others are working; run the single-component commands above.

## A component, start to finish

`src/components/<Name>/` holds:

```
EChip.vue        script setup + template + <style> (the component's own CSS)
EChip.test.ts    Vitest browser tests (see Button for the shape)
README.md         what the consumer provides, what it does, the rules (adapt the reference README for Vue)
index.ts          export { default as EChip } from "./EChip.vue";   (plus exported types)
```

`EButton` is the model. Read `src/components/Button/` before writing anything.

### Naming and files

The reference (React, `Op*` components, `op-*` classes) has been renamed in Eos. **Use the new names everywhere**; the reference name is only for finding the source.

| Reference name | Eos name |
| --- | --- |
| FormField | Field (the label, hint and error shell) |
| Field | TextField |
| StatusStamp | Stamp |
| SegmentedControl | Segmented |
| ToggleButton | Toggle |
| DateRangePicker | RangePicker |
| PaymentCardField | CardField |
| AddressFields | AddressField |
| FileUpload | Upload |
| ActivityList | Timeline |
| AmountFigure | Amount |
| AppointmentCard | BookingCard |
| TimeSlots | SlotPicker |
| Pattern* (PatternPayBill ...) | not library components: they become example pages in the site and integration tests (see 'Patterns') |

Every other component keeps its name. The prefix is `Ae` (`EButton`), classes are `ae-*`, custom properties are `--e-*` (`var(--e-space-4)`), cascade layers are `e.*`. Naming rules for new names: one word where it reads well; `*Field` is a labelled input built on `EField`; `*Picker` chooses from a popup; `*Group` is a fieldset of choices; `*Row` is a compact line; `*Card` is a bordered summary; `*List` repeats items. Practice-specific words stay out of names and docs: the library is general. Components are `Ae` + the name above: `EChip`, `EStatementCard`. The folder is the name without the prefix (`Chip`). A component with sub-parts keeps them in its folder (`ETabs.vue`, `ETab.vue`).
- Keep the reference's class stems and swap the prefix: `.op-chip` becomes `.e-chip`. Consumers theme through tokens, not class renames.
- Composables are `src/composables/useThing.ts`, one per file, one named export per file (`gen-index` exports them).

### Props, events, slots

- Props are typed with `defineProps<{ ... }>()`, with a one-line doc comment per prop (it becomes the editor tooltip). Use `withDefaults` for defaults. Optional booleans are `boolean | undefined`; do not set `false` defaults.
- The main value is `defineModel()` (`v-model`). Components with two values use named models (`v-model:start`, `v-model:end`). There is no `defaultValue` prop: leaving `v-model` off already gives local state. Where the reference has `defaultOpen` and the like, the model is the same thing with an initial value.
- The reference's `onChange(value, event)` becomes `update:modelValue(value)`. Other callbacks become emits declared with `defineEmits<{ select: [value: string] }>()`, value first. Never emit a bare DOM event as the primary signal.
- Props that take a node in the reference (`action`, `actions`, `header`, `footer`, `trigger`, `reveal`) are named slots; `children` is the default slot. Declare them with `defineSlots`. A function as children is a scoped slot (`Field` passes `{ id, ariaInvalid, ariaDescribedby }`).
- Native attributes land on the element the consumer expects. For inputs that is the `<input>`: `defineOptions({ inheritAttrs: false })` and `v-bind="$attrs"` on the input, with the wrapper's own `class` and `style` kept on the wrapper. Listeners such as `@click` and `@keydown` then fall through with the attributes.
- Component names, props and slots are the API. Do not invent extra props; if the reference lacks something, note it in your report instead.

### Accessibility is the feature

- Real elements first: `button`, `input`, `fieldset`/`legend`, `details`/`summary`, `dialog`, native `popover` where the reference uses it. ARIA only where no element does the job.
- Ids for label, hint and error wiring come from `useUid(() => props.id)`. Never a module counter.
- Every interactive state is tested with the keyboard (`page.keyboard`, `userEvent`), not only the mouse.
- Every component test file ends with an axe run over each state (`expectNoViolations` from `test/axe.ts`), including open, invalid, disabled and loading.
- Focus management (dialogs, drawers, popovers, menus) goes in a composable with a test: trap, return focus, Escape.
- Respect `prefers-reduced-motion` for anything that moves.

### Words and icons

- Every string a component writes is `const t = useMessages(); t("key")`. Keys already exist in `src/messages.ts`; add a key there only when the reference component has one that is missing. A local variable named `t` that is not that function is a bug.
- Money, dates and numbers use the configured `locale` and `currency` from `useConfig()` (`Intl`), never hard-coded.
- Icons are `<EIcon name="..." />`. Never inline SVG paths.

### CSS

- Write the component's CSS in its own `<style>` block (not scoped; the `op-*` classes are the contract) inside one `@layer e.<layer> { ... }`:

  | Layer           | Reference layer           |
  | --------------- | ------------------------- |
  | `e.primitives` | 1 Primitives              |
  | `e.blocks`     | 2 Building blocks         |
  | `e.controls`   | 3 Form controls           |
  | `e.composites` | 4 Composite controls      |
  | `e.containers` | 5 Containers and feedback |
  | `e.account`    | 6 The account             |
  | `e.page`       | 7 The page                |
  | `e.patterns`   | 8 Patterns                |

  A component uses only components of its own layer or an earlier one (`check-layers`).

- `import "../../styles/base.css";` at the top of the script so the tokens, the focus ring, `.e-kicker` and `.e-sr` are present wherever the component is used.
- Take every rule for your classes from the reference `bundle.css`, including the ones in cross-cutting sections: `@media print`, `forced-colors`, `:dir(rtl)`, container queries, the "polish" sections, and rules where your class appears inside another selector. `css-parity --grep e-yourclass` must report no missing rules and no changed values, except what you record in `packages/vue/parity-allow.json` with a reason. A rule that styles a child component's class (`.e-actions--bar > .e-btn`) lives with the parent that sets the context.
- Format as expanded, one declaration per line, lowercase `currentcolor`. Values come from tokens (`var(--e-space-4)`); a raw colour, size or duration is a missing token. Logical properties only (`margin-inline-start`, `inset-inline-end`).
- Dark mode and other themes work by changing token values; never hard-code a colour that should theme.

### Tests

Port the relevant tests from `../eos-site/reference/react/tests/suite.js` one for one, then add what the reference lacked: keyboard, accessible name and role, `v-model` round trip, attribute fall-through, the axe pass. Use `vitest-browser-vue` (`render` is async) and `vitest/browser` locators (`page.getByRole`). Layout assertions (heights, wrapping, container queries) are real here because the tests run in a browser; keep the reference's.

```ts
import { render } from "vitest-browser-vue";
import { page } from "vitest/browser";
const { container } = await render(EChip, { props: { tone: "success" }, slots: { default: "Paid" } });
```

### Definition of done

1. `npx vitest run src/components/<Name>` passes.
2. `check-css`, `check-layers`, `vue-tsc` are clean for your files.
3. `css-parity --grep` for each of your classes is clean (or allowed with a reason).
4. The component has a README, an `index.ts`, and exported prop types where a consumer would name them.
5. The component works without `createEos()` installed (the config has a fallback) and with a theme applied.

## Themes

`defineTheme({ brand, accent, fonts, radius, tokens })` returns `{ tokens, css(), apply(el), issues }`. Components read variables only. A change that cannot be expressed by a token is a missing token, which is added in `packages/tokens/src/tokens.json` with its usage note.

## Releases

Changesets: `pnpm changeset` per user-facing change; merging to `main` opens a release PR; merging that publishes to GitHub Packages (`.github/workflows/release.yml`). The registry is private; consumers need a token with `read:packages` and `@dame-g:registry=https://npm.pkg.github.com` in their `.npmrc`.

## Dependencies

Use a dependency where it is best in class and would otherwise mean hand-rolling hard behaviour. Add it to `packages/vue/package.json` (`dependencies` for runtime) with a one-line reason in your report. Approved:

- **reka-ui** (headless, accessible widgets, the successor of Radix Vue): Select, Combobox (Autocomplete and MultiSelect are Combobox variants), Popover, DropdownMenu (Menu), Tooltip, Dialog (Dialog and Drawer), Tabs, Accordion, Toast. Render its parts with our `ae-*` classes and structure so the CSS from the reference applies unchanged; use its `as-child` where the reference's element differs. Reka gives keyboard handling, typeahead, focus management, positioning and ARIA; do not re-implement those. If Reka's DOM cannot reach the reference's look without fighting it, say so and write the component natively.
- **@vueuse/core**: `onClickOutside`, `useEventListener`, `useResizeObserver`, `useMediaQuery`, `useVirtualList`, `useFocusTrap` (via @vueuse/integrations/focus-trap if needed). Prefer it to writing the same listener code.
- **@tanstack/vue-table** and **@tanstack/vue-virtual** for the DataGrid engine (sorting, filtering, selection, column sizing, row virtualization). Keep the reference's feature set and its card layout on narrow containers.
- Native first: `<dialog>`, `popover`, `<details>`, `<input type="radio">`. No dependency for what an element already does.
- No date library: Calendar uses `Intl` and the reference's own logic.

## Patterns

The reference's six Pattern* previews (PayBill, Register, Schedule, SignForm, SignIn, Statements) are not components. They become example pages in eos-site and integration tests there.
