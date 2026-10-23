/** The guide's sidebar groups, in order. Each page in GUIDE names its group. */
export const GUIDE_GROUPS = ["Start", "Theming", "Build", "Platform", "Reference"];

export const GUIDE = [
  { group: "Start", slug: "getting-started", name: "Getting started", note: "Install, plugin, first component, a working form, Vite auto-import" },
  { group: "Start", slug: "choosing", name: "Which component?", note: "Select, Combobox, RadioGroup or Segmented; Dialog, Drawer or Disclosure; Notice or Toast" },
  { group: "Start", slug: "design-principles", name: "Design principles", note: "Spacing rhythm, depth, control height, actions, and the spacing and layout conventions" },
  { group: "Theming", slug: "theming", name: "Theming", note: "defineTheme inputs, light and dark, CSS variables, scoped themes, portalTarget, cascade layers" },
  { group: "Theming", slug: "tokens", name: "Token reference", note: "The tokens you will use most, the theme inputs, then every colour, size, radius, shadow and motion token with usage notes and contrast" },
  { group: "Theming", slug: "tailwind-and-css", name: "Tailwind and CSS", note: "Cascade layer order, overriding a component with your own classes, using EOS beside Tailwind" },
  { group: "Theming", slug: "icons", name: "Icons", note: "Built-in icons and bringing your own icon set" },
  { group: "Build", slug: "layouts", name: "Composing layouts", note: "Stack, Inline, Grid, Surface, Container and AppShell" },
  { group: "Build", slug: "forms", name: "Forms and validation", note: "v-model, labels, hints, errors, the error summary and focusing the first invalid field" },
  { group: "Build", slug: "data-tables", name: "Data tables", note: "ETable or EDataGrid, client and manual mode, sorting, filtering, selection, formatting" },
  { group: "Build", slug: "toasts", name: "Toasts and notifications", note: "useToast, EToastProvider, Toast or Notice, announcing without a toast" },
  { group: "Build", slug: "language", name: "Words and language", note: "Messages, locale, currency, right to left" },
  { group: "Build", slug: "recipes", name: "Recipes", note: "Toggle button, button group, link card, back link and panel built from other components" },
  { group: "Platform", slug: "ssr", name: "Nuxt and SSR", note: "What was verified about server rendering" },
  { group: "Platform", slug: "accessibility", name: "Accessibility", note: "Contrast table, keyboard, forced colours, what is tested" },
  { group: "Platform", slug: "versioning", name: "Versioning and support", note: "Pre-1.0 stability, semver, supported Vue and browsers" },
  { group: "Platform", slug: "upgrading", name: "Upgrading", note: "Before and after for every breaking change since 0.x" },
  { group: "Reference", slug: "api", name: "API reference", note: "createEos options, config, themes, messages, icons and the signature of every composable" },
  { group: "Reference", slug: "composables", name: "Composables", note: "useAnnouncer, useShortcuts, useCopy, useToast and the smaller helpers: when to reach for each one" },
];

/** The guide as sidebar sections: [{ title, pages }]. The changelog closes the last section. */
export function guideSections() {
  return GUIDE_GROUPS.map((title) => ({ title, pages: GUIDE.filter((g) => g.group === title) }));
}

export const PATTERNS = [
  { slug: "pay-a-bill", name: "Pay a bill" },
  { slug: "sign-in", name: "Sign in" },
  { slug: "register", name: "Register" },
  { slug: "sign-a-form", name: "Sign a form" },
  { slug: "statements", name: "Statements" },
  { slug: "dashboard", name: "Dashboard overview" },
  { slug: "settings", name: "Settings page" },
  { slug: "search-filters", name: "Search with filters" },
  { slug: "data-table", name: "Data table with bulk actions" },
  { slug: "empty-and-error", name: "Empty and error states" },
  { slug: "confirm-destructive-action", name: "Confirm a destructive action" },
  { slug: "app-shell", name: "AppShell page frame" },
  { slug: "upload-flow", name: "Upload flow" },
  { slug: "command-palette", name: "Command palette" },
  { slug: "loading-and-paging", name: "Loading and paging" },
];

export const DESIGN = [
  {
    slug: "playground",
    name: "Theme playground",
    note: "change the theme inputs (colours, corners, elevation, strokes, fonts, text and space scale, control height, motion), locale and currency, with exportable defineTheme code",
  },
];

/** Every page that is not a component page, as site paths. */
export const STATIC_PATHS = [
  "/",
  ...GUIDE.map((g) => `/guide/${g.slug}`),
  "/changelog",
  ...DESIGN.map((d) => `/${d.slug}`),
  "/patterns/",
  ...PATTERNS.map((p) => `/patterns/${p.slug}`),
  "/components/",
];
