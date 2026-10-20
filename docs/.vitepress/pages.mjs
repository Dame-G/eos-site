export const GUIDE = [
  { slug: "getting-started", name: "Getting started", note: "Install, plugin, first component, Vite auto-import" },
  { slug: "theming", name: "Theming", note: "defineTheme inputs, CSS variables, scoped themes, portalTarget, cascade layers" },
  { slug: "tokens", name: "Token reference", note: "The tokens you will use most, the theme inputs, then every colour, size, radius, shadow and motion token with usage notes and contrast" },
  { slug: "icons", name: "Icons", note: "Built-in icons and bringing your own icon set" },
  { slug: "language", name: "Words and language", note: "Messages, locale, currency, right to left" },
  { slug: "forms", name: "Forms and validation", note: "v-model, labels, hints, errors" },
  { slug: "accessibility", name: "Accessibility", note: "Contrast table, keyboard, forced colours, what is tested" },
  { slug: "design-principles", name: "Design principles", note: "Spacing rhythm, depth, control height, actions" },
  { slug: "ssr", name: "Nuxt and SSR", note: "What was verified about server rendering" },
  { slug: "recipes", name: "Recipes", note: "Toggle button, button group, link card, back link and panel built from other components" },
  { slug: "vuetify", name: "Migrating from Vuetify", note: "Concept mapping and coexistence" },
  { slug: "versioning", name: "Versioning and support", note: "Pre-1.0 stability, semver, supported Vue and browsers" },
];

export const PATTERNS = [
  { slug: "pay-a-bill", name: "Pay a bill" },
  { slug: "sign-in", name: "Sign in" },
  { slug: "register", name: "Register" },
  { slug: "sign-a-form", name: "Sign a form" },
  { slug: "statements", name: "Statements" },
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
  ...DESIGN.map((d) => `/${d.slug}`),
  "/patterns/",
  ...PATTERNS.map((p) => `/patterns/${p.slug}`),
  "/components/",
];
