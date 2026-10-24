/** The guide's sidebar groups, in order. Each page in GUIDE names its group. */
export const GUIDE_GROUPS = ["Start", "Build", "Style", "Platform", "Reference"];

export const GUIDE = [
  { group: "Start", slug: "getting-started", name: "Getting started", note: "Install, the stylesheet, the plugin and a working form" },
  { group: "Start", slug: "install", name: "Install options", note: "Self-hosted fonts, auto-import, TypeScript and global component types, llms.txt, Nuxt and script tags" },
  { group: "Start", slug: "choosing", name: "Which component?", note: "Select, Combobox, RadioGroup or Segmented; Dialog, Drawer or Disclosure; Notice or Toast" },
  { group: "Start", slug: "layouts", name: "Composing layouts", note: "Stack, Inline, Grid, Surface, Container and AppShell" },
  { group: "Start", slug: "forms", name: "Forms and validation", note: "v-model, labels, hints, errors, the error summary and focusing the first invalid field" },
  { group: "Build", slug: "data-tables", name: "Data tables", note: "ETable or EDataGrid, client and manual mode, sorting, filtering, selection, formatting" },
  { group: "Build", slug: "toasts", name: "Toasts and notifications", note: "useToast, EToastProvider, Toast or Notice, announcing without a toast" },
  { group: "Build", slug: "language", name: "Words and language", note: "Messages, locale, currency, right to left" },
  { group: "Build", slug: "icons", name: "Icons", note: "Built-in icons and bringing your own icon set" },
  { group: "Style", slug: "design-principles", name: "Design principles", note: "Spacing rhythm, depth, control height, hover and focus by family, and tone, variant and status" },
  { group: "Style", slug: "theming", name: "Theming", note: "defineTheme inputs, light and dark, CSS variables, scoped themes, portalTarget, cascade layers" },
  { group: "Style", slug: "tokens", name: "Token reference", note: "The tokens you will use most, the theme inputs, then every colour, size, radius, shadow and motion token with usage notes and contrast" },
  { group: "Style", slug: "tailwind-and-css", name: "Tailwind and CSS", note: "Overriding a component with your own classes, and using eos beside Tailwind" },
  { group: "Platform", slug: "ssr", name: "Nuxt and SSR", note: "Server rendering, the theme in the head without a flash, and Nuxt setup" },
  { group: "Platform", slug: "accessibility", name: "Accessibility", note: "Contrast table, keyboard, forced colours, what is tested" },
  { group: "Platform", slug: "versioning", name: "Versioning and support", note: "Pre-1.0 stability, semver, supported Vue and browsers" },
  { group: "Reference", slug: "api", name: "API reference", note: "createEos options, config, themes, messages, icons and the signature of every composable" },
  { group: "Reference", slug: "composables", name: "Composables", note: "useAnnouncer, useShortcuts, useCopy, useToast and the smaller helpers: when to reach for each one" },
];

/** The guide as sidebar sections: [{ title, pages }]. The changelog closes the last section. */
export function guideSections() {
  return GUIDE_GROUPS.map((title) => ({ title, pages: GUIDE.filter((g) => g.group === title) }));
}

/** The pattern groups, in order, as the overview lists them. Each pattern names its group. */
export const PATTERN_GROUPS = ["Forms and flows", "Lists and data", "Pages and states"];

export const PATTERNS = [
  { group: "Forms and flows", slug: "pay-a-bill", name: "Pay a bill" },
  { group: "Forms and flows", slug: "sign-in", name: "Sign in" },
  { group: "Forms and flows", slug: "register", name: "Register" },
  { group: "Forms and flows", slug: "sign-a-form", name: "Sign a form" },
  { group: "Forms and flows", slug: "settings", name: "Settings page" },
  { group: "Forms and flows", slug: "upload-flow", name: "Upload flow" },
  { group: "Forms and flows", slug: "confirm-destructive-action", name: "Confirm a destructive action" },
  { group: "Lists and data", slug: "statements", name: "Statements" },
  { group: "Lists and data", slug: "search-filters", name: "Search with filters" },
  { group: "Lists and data", slug: "data-table", name: "Data table with bulk actions" },
  { group: "Lists and data", slug: "loading-and-paging", name: "Loading and paging" },
  { group: "Pages and states", slug: "app-shell", name: "Page frame" },
  { group: "Pages and states", slug: "command-palette", name: "Command palette" },
  { group: "Pages and states", slug: "dashboard", name: "Dashboard overview" },
  { group: "Pages and states", slug: "empty-and-error", name: "Empty and error states" },
];

/** Pages under /patterns/ that are not whole patterns: no demo of their own, and no "Built from" line. */
export const PATTERN_EXTRAS = [{ slug: "recipes", name: "Small recipes" }];

/** The patterns as sidebar sections: [{ title, pages }]. */
export function patternSections() {
  return PATTERN_GROUPS.map((title) => ({ title, pages: PATTERNS.filter((p) => p.group === title) }));
}

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
  ...PATTERN_EXTRAS.map((p) => `/patterns/${p.slug}`),
  "/components/",
];
