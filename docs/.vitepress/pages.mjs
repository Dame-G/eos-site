export const GUIDE = [
  { slug: "getting-started", name: "Getting started", note: "Install, plugin, first component, Vite auto-import" },
  { slug: "theming", name: "Theming", note: "defineTheme inputs, CSS variables, scoped themes, portalTarget, cascade layers" },
  { slug: "tailwind-and-css", name: "Tailwind and CSS", note: "Cascade layer order, overriding a component with your own classes, using EOS beside Tailwind" },
  { slug: "tokens", name: "Token reference", note: "The tokens you will use most, the theme inputs, then every colour, size, radius, shadow and motion token with usage notes and contrast" },
  { slug: "icons", name: "Icons", note: "Built-in icons and bringing your own icon set" },
  { slug: "layouts", name: "Composing layouts", note: "Stack, Inline, Grid, Surface and AppShell" },
  { slug: "data-tables", name: "Data tables", note: "ETable or EDataGrid, client and manual mode, sorting, filtering, selection, formatting" },
  { slug: "toasts", name: "Toasts and notifications", note: "useToast, EToastProvider, Toast or Notice, announcing without a toast" },
  { slug: "composables", name: "Composables", note: "useAnnouncer, useShortcuts, useCopy, useToast: screen reader announcements, keyboard shortcuts, copying, toasts" },
  { slug: "language", name: "Words and language", note: "Messages, locale, currency, right to left" },
  { slug: "forms", name: "Forms and validation", note: "v-model, labels, hints, errors" },
  { slug: "accessibility", name: "Accessibility", note: "Contrast table, keyboard, forced colours, what is tested" },
  { slug: "choosing", name: "Which component?", note: "Select, Combobox, RadioGroup or Segmented; Dialog, Drawer or Disclosure; Notice or Toast" },
  { slug: "design-principles", name: "Design principles", note: "Spacing rhythm, depth, control height, actions" },
  { slug: "ssr", name: "Nuxt and SSR", note: "What was verified about server rendering" },
  { slug: "recipes", name: "Recipes", note: "Toggle button, button group, link card, back link and panel built from other components" },
  { slug: "api", name: "API reference", note: "createEos options, config, themes, messages, icons and every composable with signatures" },
  { slug: "versioning", name: "Versioning and support", note: "Pre-1.0 stability, semver, supported Vue and browsers" },
];

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
