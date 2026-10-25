/** The guide's sidebar groups, in order. Each page in GUIDE names its group. */
export const GUIDE_GROUPS = ["Get started", "Build", "Style", "Accessibility", "Platform", "Reference", "Help"];

export const GUIDE = [
  { group: "Get started", slug: "getting-started", name: "Getting started", note: "Install, the stylesheet, the plugin, the toast region and a working form" },
  { group: "Get started", slug: "install", name: "Install options", note: "Self-hosted fonts, auto-import, TypeScript and global component types, llms.txt, Nuxt and script tags" },
  { group: "Get started", slug: "choosing", name: "Which component?", note: "Select, Combobox, RadioGroup or Segmented; Dialog, Drawer or Disclosure; Notice or Toast" },
  { group: "Get started", slug: "why-eos", name: "Why eos", note: "What eos is, what it is built on, and what it deliberately leaves out" },
  { group: "Build", slug: "layouts", name: "Composing layouts", note: "Stack, Inline, Grid, Surface, Container and AppShell, and the named gaps" },
  { group: "Build", slug: "forms", name: "Forms and validation", note: "EForm, v-model, labels, hints, errors, the error summary and your own controls" },
  { group: "Build", slug: "data-tables", name: "Data tables", note: "ETable or EDataGrid, client and manual mode, sorting, filtering, selection, formatting, failed loads" },
  { group: "Build", slug: "toasts", name: "Toasts and notifications", note: "useToast, EToastProvider, Toast or Notice, announcing without a toast" },
  { group: "Build", slug: "icons", name: "Icons", note: "Every built-in icon, and bringing your own icon set" },
  { group: "Build", slug: "language", name: "Words and language", note: "Messages, locale, currency, right to left" },
  { group: "Style", slug: "theming", name: "Theming", note: "defineTheme inputs, presets, light and dark, CSS variables, scoped themes" },
  { group: "Style", slug: "design-principles", name: "Design principles", note: "Compose, the parent owns space, one control height, depth, spacing, tone, variant and status" },
  { group: "Style", slug: "tailwind-and-css", name: "Tailwind and CSS", note: "Overriding a component with your own classes, cascade layers, and using eos beside Tailwind" },
  { group: "Accessibility", slug: "accessibility", name: "Accessibility", note: "The target, contrast table, keyboard, how it is tested, known limitations and how to report an issue" },
  { group: "Platform", slug: "ssr", name: "Nuxt and SSR", note: "Server rendering, the theme in the head without a flash, and Nuxt setup" },
  { group: "Platform", slug: "versioning", name: "Versioning and support", note: "Pre-1.0 stability, semver, version ranges, supported Vue and browsers" },
  { group: "Reference", slug: "api", name: "API reference", note: "createEos options, config, themes, messages, icons and the signature of every composable" },
  { group: "Reference", slug: "composables", name: "Composables", note: "useAnnouncer, useShortcuts, useCopy and the smaller helpers: when to reach for each one" },
  { group: "Reference", slug: "tokens", name: "Token reference", note: "The tokens you will use most, the theme inputs, then every colour, size, radius, shadow and motion token with usage notes and contrast" },
  { group: "Reference", slug: "building-components", name: "Building your own components", note: "The slab, hover and press by family, focus, concentric rows, selected and disabled states, for components of your own" },
  { group: "Reference", slug: "glossary", name: "Glossary", note: "The words the docs use: ground, ink, wash, well, slab, frame, tone, value and place, preset, density and more" },
  { group: "Help", slug: "faq", name: "FAQ", note: "Unstyled components, overriding CSS, tree-shaking, icons, SSR, Tailwind, fonts and privacy" },
];

/** Pages outside /guide/ that sit in the guide's sidebar, at the end of their group. */
const GUIDE_EXTRAS = [{ group: "Reference", name: "Changelog", link: "/changelog", note: "Release notes for every version of the library, breaking changes first" }];

/** The guide as sidebar sections: [{ title, pages: [{ name, link, slug?, note? }] }]. */
export function guideSections() {
  return GUIDE_GROUPS.map((title) => ({
    title,
    pages: [...GUIDE.filter((g) => g.group === title).map((g) => ({ ...g, link: `/guide/${g.slug}` })), ...GUIDE_EXTRAS.filter((g) => g.group === title)],
  }));
}

/** The pattern groups, in order, as the overview lists them. Each pattern names its group. */
export const PATTERN_GROUPS = ["Forms and flows", "Lists and data", "Pages"];

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
  { group: "Lists and data", slug: "loading-empty-and-error", name: "Loading, empty and error" },
  { group: "Pages", slug: "page-frame", name: "Page frame" },
  { group: "Pages", slug: "command-palette", name: "Command palette" },
  { group: "Pages", slug: "dashboard", name: "Dashboard overview" },
];

/**
 * Old pattern addresses and where they went. The production redirects (_redirects) are written by the build, which the
 * site engineering owns: this list says which ones the content needs.
 */
export const PATTERN_MOVES = {
  "/patterns/empty-and-error": "/patterns/loading-empty-and-error",
  "/patterns/loading-and-paging": "/patterns/loading-empty-and-error",
  "/patterns/app-shell": "/patterns/page-frame",
};

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
