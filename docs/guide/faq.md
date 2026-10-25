---
title: FAQ
description: "Short answers: unstyled components, overriding CSS, bundle size, icons, server rendering, Tailwind, fonts and privacy, and where to ask."
---

# FAQ

## The components render unstyled

Import the stylesheet once, in your entry file: `import "@eos-ui/vue/style.css"`. It holds every component's styles and the default theme, and the JavaScript imports no CSS, so nothing is styled without it. This is needed with or without the plugin. In Nuxt, add it to `css` in `nuxt.config.ts`. See [Getting started](/guide/getting-started).

## My CSS does not override a component

eos puts every rule in a cascade layer (`@layer e.*`), and CSS outside any layer beats every layered rule, whatever its specificity. So a plain class on the component wins. If it does not, your CSS is probably in a layer itself, such as Tailwind's `components`, declared before the eos layers. Declare the layer order once, before both stylesheets: see [Tailwind and CSS](/guide/tailwind-and-css#layer-order). `class` and `style` land on a component's outer element. To change every instance, change a token instead: see [Theming](/guide/theming).

## How do I change the brand colour?

`createEos({ theme: { brand: "#2c95b4" } })`. `defineTheme()` derives every colour from it and checks contrast. Try values in the [playground](/playground).

## Does importing from the package root pull in every component?

No. Each component is exported by name, so a production build keeps only the ones you import. The root also registers the built-in icons (about 9 kB gzipped). To leave those out, import components from their own paths (`@eos-ui/vue/components/EButton`): see [Install options](/guide/install#import-only-what-you-use). The stylesheet is one file for all components either way.

## Which icons are built in, and can I use my own?

The built-in set is a selection of Phosphor icons, listed on [Icons](/guide/icons#built-in-icons). Adapters plug in Lucide, Tabler, Heroicons, Phosphor's Vue package or Iconify, and anything your set lacks falls back to the built-in icon. An icon given as an SVG string is drawn as markup, so it must come from your app, never from user data.

## Does it work with server rendering and Nuxt?

Yes. Components render with `renderToString`, with stable ids. Render the theme into the head with `themeCss()` so the first paint is right. See [Nuxt and SSR](/guide/ssr).

## Can I use it with Tailwind?

Yes. Declare one layer order with Tailwind's `utilities` after the eos layers, so utilities win over eos and eos wins over Tailwind's preflight. See [Tailwind](/guide/tailwind-and-css#tailwind).

## Why does the text use a system font?

eos bundles no fonts. `@eos-ui/vue/fonts.css` loads Bricolage Grotesque and Geist Mono from Google Fonts, which sends your visitors' IP addresses to Google, so it is opt-in. Self-host the fonts, or set `defineTheme({ fonts })` to fonts you already load: see [Install options](/guide/install#fonts).

## Is `useToast()` not working?

It throws when there is no toast store. Install `createEos()`, which provides one for the whole app, and mount one `EToastProvider` near the root to show the toasts. See [Toasts and notifications](/guide/toasts#set-up).

## Can I use it from a script tag or with `require()`?

There is no script-tag or CommonJS build: eos is ES modules only. Use a bundler, Node's `import`, or `require()` of ES modules on Node 22 and later.

## Will updating break my app?

Before 1.0 a minor version can change the API, and a patch never does. npm's default caret range (`^0.17.1`) stays inside one minor before 1.0. See [Versioning and support](/guide/versioning), and each release's **Breaking** list in the [changelog](/changelog).

## Where do I ask a question or report a bug?

Open an issue on [GitHub](https://github.com/Dame-G/eos/issues). For an accessibility problem, see [Report an accessibility issue](/guide/accessibility#report-an-accessibility-issue). Report a security problem privately, as the library's [security policy](https://github.com/Dame-G/eos/security/policy) explains.
