# eos-site

Private source of https://eos.dame.gg, the documentation and live-preview site for the public [Eos](https://github.com/Dame-G/eos) library.

The site is built with [VitePress](https://vitepress.dev) and uses the library it documents. The page frame (header, navigation, search, footer), the home page, the tokens page and the playground are Eos components. Only the markdown prose and code blocks use VitePress styles, and those read the library's tokens.

- `docs/`: guide pages, the tokens page, the theme playground, patterns, and one generated page per component.
## Run it

The library sits beside this repo (`../eos`) and is built. Set `EOS_DIR` to use a checkout elsewhere.

```bash
# once, in ../eos
corepack pnpm install
corepack pnpm build           # tokens, then the Vue package

# in this repo
corepack pnpm install
corepack pnpm docs:dev        # http://localhost:5173
corepack pnpm docs:build      # static site in docs/.vitepress/dist
corepack pnpm docs:preview    # serve the build
corepack pnpm test            # Vitest browser mode with Playwright (Edge locally, Chromium when CI is set)
corepack pnpm pages:check     # checks the pages of a running preview (pass its URL)
corepack pnpm ssr:check       # renders components with renderToString and reports the result
corepack pnpm llms            # writes docs/public/llms.txt (dev and build run it)
```

The site imports the library's built `dist`. After a library change (a new component, a changed prop), rebuild `../eos`. A component that exists in `src` but not in `dist` fails its demo test.

## Add a component page

Component pages are generated from the library's folders. A new component appears in the sidebar and gets a page after two steps:

1. Add `docs/components/demos/<Name>.vue`, named after the component folder (`Chip.vue`). Copy an existing demo. Show the default and the interesting states: error, disabled, loading, open.
2. Add the component to `docs/.vitepress/groups.mjs` so it lands in the right sidebar group. Without a line it appears under "More".

The page is the component's `README.md` from the library, read at build time and never copied. The demo follows the introduction, with its source in a panel. `tests/demos.test.ts` fails if a component has no demo, and checks every demo for console errors and axe violations.

## What is where

| Path | What |
| --- | --- |
| `docs/.vitepress/config.mts` | Sidebar (from the library folders), search, build settings |
| `docs/.vitepress/eos-source.mjs` | Reads the library checkout: component list, READMEs, props tables |
| `docs/.vitepress/groups.mjs` | Component to sidebar group (the library's layers) |
| `docs/.vitepress/theme/` | Installs `createEos`, maps `--e-*` to VitePress variables (`custom.css`), demo and token components, the playground |
| `docs/components/[name].md`, `[name].paths.mjs` | One page per component folder |
| `docs/components/demos/` | One hand-written demo per component |
| `docs/patterns/` | Six example pages, each a Vue component and a page |
| `docs/data/` | Build-time loaders for the component list, the tokens page and the contrast table |
| `scripts/gen-llms.mjs` | Writes `docs/public/llms.txt` (pages and component props) |
| `scripts/check-pages.mjs` | Page checks against a running preview |
| `scripts/ssr-check.mjs` | The server rendering checks behind the Nuxt and SSR page |
| `tests/` | Demo and pattern tests |

## Two copies of Vue, and CSS layers

- The library is linked from `../eos`, which has its own `node_modules`. `resolve.dedupe: ["vue"]` and `ssr.noExternal` in the config keep one copy of Vue in the dev server, the build and the tests.
- VitePress ships unlayered CSS, which would beat the library's `@layer e.*` rules inside the demos. A small Vite plugin in the config wraps the VitePress default theme CSS in `@layer e.reset`, the lowest Eos layer. The site's own `custom.css` is unlayered and wins over both.

## Use the published packages

`package.json` links both packages to the checkout beside this repo:

```json
"@eos-ui/vue": "link:../eos/packages/vue",
"@eos-ui/tokens": "link:../eos/packages/tokens"
```

To use registry versions, replace the two lines with versions (`"@eos-ui/vue": "^0.1.0"`) and run `corepack pnpm install`. The component pages still read the library's `README.md` files from the checkout of `Dame-G/eos` beside this repo (or `EOS_DIR`).

## Deploy

`wrangler.jsonc` describes a Worker named `eos-site` that serves `docs/.vitepress/dist` as static assets. Unknown paths get VitePress's `404.html`. The Worker uses the custom domain `eos.dame.gg`, and Cloudflare creates the DNS record and certificate on deploy.

- `.github/workflows/ci.yml`: on pull requests, checks out `Dame-G/eos` beside the site, builds the library and the docs, runs the tests, `pages:check` and `ssr:check`. No deploy.
- `.github/workflows/deploy.yml`: runs on demand from the Actions tab. It builds and tests, then runs `wrangler deploy`. It needs the repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. To deploy from your machine instead, run `pnpm docs:build` and `pnpm deploy`.
