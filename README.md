# eos-site

Private source of https://eos.dame.gg: the documentation and live-preview site for the public [Eos](https://github.com/Dame-G/eos) library.

It is a [VitePress](https://vitepress.dev) site that uses the library it documents. The page frame (header, navigation, search, footer), the home page, the tokens and the playground are built from Eos components; only the markdown prose and code blocks use VitePress styles, and those read the library's tokens.

- `docs/`: the site. Guide pages, the tokens page, the theme playground, patterns, and one generated page per component.
- `reference/react/`: the original React design system the library was ported from (spec, tests, CSS). Development aid only.
- `PORTING.md`: conventions for the port.

## Run it

The library is expected beside this repo, built:

```bash
# once, in ../eos
corepack pnpm install
corepack pnpm -r --workspace-concurrency=1 build   # tokens, then the Vue package (this also rewrites src/index.ts)

# in this repo
corepack pnpm install
corepack pnpm docs:dev        # http://localhost:5173
corepack pnpm docs:build      # static site in docs/.vitepress/dist
corepack pnpm docs:preview    # serve the build
corepack pnpm test            # Vitest browser mode + Playwright (Edge locally, Chromium when CI is set)
corepack pnpm ssr:check       # renders components with renderToString and reports what it finds
corepack pnpm layout:check    # with the preview running: every page at 375 and 1280px, reporting overflow and console errors
```

After the library changes (a new component, a changed prop), rebuild it in `../eos`. The site imports the built `dist`, so a component that exists in `src` but not in `dist` fails its demo test.

Set `EOS_DIR` to use a library checkout somewhere else.

## Adding a component page

Component pages are generated from the library's folders, so a new component appears in the sidebar and gets a page with one new file:

1. Add `docs/components/demos/<Name>.vue` (the folder name, such as `Chip.vue`). Copy an existing demo. Show the default and the interesting states: error, disabled, loading, open.
2. Add the component to `docs/.vitepress/groups.mjs` so it lands in the right sidebar group. Without a line it appears under "More".

The page itself is the component's `README.md` from the library, read at build time and never copied, with the demo placed after the introduction and the demo's source in a panel. `tests/demos.test.ts` fails if a component has no demo, and checks every demo for console errors and axe violations.

## What is where

| Path | What |
| --- | --- |
| `docs/.vitepress/config.mts` | Sidebar (from the library folders), search, build settings |
| `docs/.vitepress/eos-source.mjs` | Reads the library checkout: component list, READMEs, props tables |
| `docs/.vitepress/groups.mjs` | Component to sidebar group (the library's layers) |
| `docs/.vitepress/theme/` | Installs `createEos`, maps `--e-*` to VitePress variables (`custom.css`), demo and token components, the playground |
| `docs/components/[name].md`, `[name].paths.mjs` | One page per component folder |
| `docs/components/demos/` | Hand-written demos, one per component |
| `docs/patterns/` | Six full example pages, each a Vue component and a page |
| `docs/data/tokens.data.js` | Build-time loader for the tokens page and the contrast table |
| `scripts/gen-llms.mjs` | Writes `docs/public/llms.txt` (pages and component props) before dev and build |
| `scripts/ssr-check.mjs` | The server rendering checks behind the Nuxt and SSR page |
| `tests/` | Demo and pattern tests |

## Two copies of Vue, and CSS layers

- The library is linked from `../eos`, which has its own `node_modules`. `resolve.dedupe: ["vue"]` and `ssr.noExternal` in the config keep one copy of Vue in the dev server, the build and the tests.
- VitePress ships unlayered CSS, which would beat the library's `@layer e.*` rules inside the demos. A small Vite plugin in the config wraps the VitePress default theme CSS in `@layer e.reset`, the lowest Eos layer, so it loses to every component wherever it lands in the bundle. The site's own `custom.css` is unlayered and wins over both.

## Switching to the published packages

`package.json` points both packages at the checkout beside this repo:

```json
"@eos-ui/vue": "link:../eos/packages/vue",
"@eos-ui/tokens": "link:../eos/packages/tokens"
```

Once the packages are on npm, replace the two lines with registry versions, for example `"@eos-ui/vue": "^0.1.0"` and `"@eos-ui/tokens": "^0.1.0"`, and run `corepack pnpm install`. Everything the site renders comes from the package `dist`, so nothing else changes.

The component pages also need the library's `README.md` files, which are in the library's `src`. Keep the checkout of `Dame-G/eos` beside this repo for them (the CI workflows already do), or point `EOS_DIR` at it.

## Deploy

`wrangler.jsonc` describes a Worker named `eos-site` that serves `docs/.vitepress/dist` as static assets, with no single-page-app fallback (VitePress's `404.html` is served for unknown paths) and the route `eos.dame.gg/*` on the `dame.gg` zone. A proxied DNS record for `eos` must exist on that zone for the route to receive traffic.

- `.github/workflows/ci.yml`: on pull requests, checks out `Dame-G/eos` beside the site, builds the library, builds the docs and runs the tests. No deploy.
- `.github/workflows/deploy.yml`: on push to `main`, the same, then `wrangler deploy`. It needs the repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
