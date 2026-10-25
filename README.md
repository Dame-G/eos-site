# eos-site

Source of https://eos.dame.gg, the documentation and live-preview site for the public [eos](https://github.com/Dame-G/eos) library. It is released under the [MIT license](LICENSE).

The site is built with [VitePress](https://vitepress.dev) and uses the library it documents. The page frame (header, navigation, search, footer), the home page, the tokens page and the playground are eos components. No VitePress theme CSS is loaded: the markdown prose has a few rules of the site's own (`custom.css`), written with the library's tokens, and code blocks, tables and inline code are the library's components or their markup.

- `docs/`: guide pages, the tokens page, the theme playground, patterns, and one generated page per component.
## Run it

The library sits beside this repo (`../eos`) and is built. Set `EOS_DIR` to use a checkout elsewhere.

### Which library version the site shows

The site documents whatever commit of the library is checked out. The install command on the home page pins the `version` in that checkout's `package.json`.

To see another version locally, check it out in the library (`git checkout @eos-ui/vue@0.5.3`, or a branch) and restart `docs:dev`, or point `EOS_DIR` at a `git worktree` of it.

In CI the library ref is chosen like this:

- **Production** (the push-to-main deploy, and the deploy the library's release workflow starts) builds against the latest released library: the highest `@eos-ui/vue@x.y.z` tag in `Dame-G/eos`, looked up when the workflow runs. If no such tag can be found the job fails with a message. It never falls back to `main`.
- A manual run of the Deploy workflow with `eos_ref` uses that branch, tag or commit instead. Failing that, the repository variable `EOS_REF` is used. Set `EOS_REF` only to pin production to something other than the latest release, and clear it afterwards.
- **Pull requests** build against the library's `main` (or `EOS_REF` when set), so a site change that needs unreleased library code is caught before it merges.

This means documentation for unreleased library code appears only in pull request builds and local dev. It reaches eos.dame.gg once the library is released and the site is redeployed.

```bash
# once, in ../eos
corepack pnpm install
corepack pnpm build           # tokens, then the Vue package

# in this repo
corepack pnpm install
corepack pnpm docs:dev        # http://localhost:5173
corepack pnpm docs:build      # static site in docs/.vitepress/dist
corepack pnpm docs:preview    # serve the build
corepack pnpm test            # Vitest: logic in Node, components in Chromium (Playwright's, or Edge when it is not installed)
corepack pnpm typecheck       # vue-tsc over the theme, config and tests
corepack pnpm pages:check     # checks the pages of a running preview (pass its URL; --all for every component), desktop in light and dark, phone in light

corepack pnpm llms            # writes docs/public/llms.txt and publishes the library's llms files (dev and build run it)
```

The site imports the library's built `dist`. After a library change (a new component, a changed prop), rebuild `../eos`. A component that exists in `src` but not in `dist` fails its demo test.

## Add a component page

Component pages are generated from the library's folders. A new component appears in the sidebar and gets a page after two steps:

1. Add `docs/components/demos/<Name>.vue`, named after the component folder (`Stamp.vue`). Copy an existing demo. Show the default and the interesting states: error, disabled, loading, open.
2. Add the component to `docs/.vitepress/groups.mjs` so it lands in the right sidebar group. Without a line it appears under "More".

The page is the component's `README.md` from the library, read at build time and never copied. The demo follows the introduction, with its source in a panel. `tests/demos.test.ts` fails if a component has no demo, and checks every demo for console errors and axe violations.

## What is where

| Path | What |
| --- | --- |
| `docs/.vitepress/config.mts` | Sidebar (from the library folders), search, build settings |
| `docs/.vitepress/eos-source.mjs` | Reads the library checkout: component list, READMEs, props tables |
| `docs/.vitepress/groups.mjs` | Component to sidebar group (the library's layers). A component missing here fails the build when `CI` is set |
| `docs/.vitepress/csp.mjs`, `redirects.mjs` | Generate `_headers` (Content-Security-Policy with script hashes) and `_redirects` at the end of the build |
| `docs/.vitepress/lean-theme-chunk.ts` | Points the library's reka-ui imports at the files that define them, so the chunk every page loads carries only what the header uses |
| `docs/.vitepress/theme/playground/` | The playground: `model.ts` (state shape), `build.ts` (state to theme and code), `presets.ts`, `random.ts`, `codec.ts` (share link), `contrast.ts` (contrast pairs); all but `model.ts` and `build.ts`' callers are plain TypeScript with unit tests |
| `docs/.vitepress/theme/` | Installs `createEos`, the layout and prose styles (`custom.css`), the fonts (`fonts.css`), demo and token components, the playground |
| `docs/components/[name].md`, `[name].paths.mjs` | One page per component folder |
| `docs/components/demos/` | One hand-written demo per component |
| `docs/patterns/` | Five example pages, each a Vue component and a page |
| `docs/data/` | Build-time loaders for the component list, the tokens page and the contrast table |
| `scripts/gen-llms.mjs` | Writes `docs/public/llms.txt` (the site's pages, and each component's page beside the library's reference for it) and copies the library's `llms-full.txt` and `llms/` |
| `scripts/check-pages.mjs` | Page checks against a running preview |

| `tests/` | Demo and pattern tests |

## Two copies of Vue, and CSS layers

- The library is linked from `../eos`, which has its own `node_modules`. `resolve.dedupe: ["vue"]` and `ssr.noExternal` in the config keep one copy of Vue in the dev server, the build and the tests.
- The site loads none of VitePress's theme CSS. The library's rules are in `@layer e.*`; the site's own `custom.css` is unlayered, and its prose rules sit in `@scope (.site-prose) to (...)`, so they stop at the demos, patterns and library components.

### Upgrading VitePress

The site uses VitePress's markdown, router, search index and build, not its theme. `lean-theme-chunk.ts` relies on the build putting statically imported theme modules in one chunk, and `config.mts` strips two things VitePress injects for its default theme (`vp-icons.css` and the `check-mac-os` script). Upgrade it on its own, then run `pnpm docs:build`, `pnpm build:check` and `pnpm pages:check`.

## Use the published packages

`package.json` links both packages to the checkout beside this repo:

```json
"@eos-ui/vue": "link:../eos/packages/vue",
"@eos-ui/tokens": "link:../eos/packages/tokens"
```

To use registry versions, replace the two lines with versions (`"@eos-ui/vue": "^0.1.0"`) and run `corepack pnpm install`. The component pages still read the library's `README.md` files from the checkout of `Dame-G/eos` beside this repo (or `EOS_DIR`).

## Headers and redirects

The build writes `_headers` and `_redirects` into `docs/.vitepress/dist` (there is no `public/_headers`). `_headers` carries the Content-Security-Policy: scripts are limited to the site's own files and to the inline scripts of the built pages, listed by SHA-256 hash, so there is no `'unsafe-inline'` for scripts. The hashes are read from the finished HTML, so a changed boot script or a new VitePress inline script is picked up without edits. JSON-LD blocks are data, not scripts, and need no hash. The report-only copy also drops `'unsafe-inline'` for styles, to show what is left to tighten.

Cloudflare static assets match paths case-sensitively, and component pages are written as `/components/Button`. `_redirects` sends each component's lower-case and kebab-case address (`/components/textfield`, `/components/text-field`) to the real page (`/components/TextField`), and `/guide` to `/guide/getting-started`, which has no index page. The dev server answers every path with the app shell and resolves routes in the browser, so these are production-only problems.

## Deploy

`wrangler.jsonc` describes a Worker named `eos-site` that serves `docs/.vitepress/dist` as static assets. Unknown paths get VitePress's `404.html`. The Worker uses the custom domain `eos.dame.gg`, and Cloudflare creates the DNS record and certificate on deploy.

- `.github/actions/verify/action.yml`: the shared steps. It checks out `Dame-G/eos` beside the site, builds the library, installs the site, then runs `knip`, the type check, the docs build, the tests, `pages:check --all` (axe, 404, console and Content-Security-Policy checks on full pages, with the built `_headers` policy applied: desktop in the light and dark scheme, phone in light). Server rendering of every component is checked in the library (`pnpm ssr`). CI and Deploy both call it; with `full: false` it skips `knip` and the tests and checks only a sample of pages. The library's `Site check` workflow calls it too, against each library pull request.
- `.github/workflows/ci.yml`: on pull requests, runs every gate against the library's `main`. No deploy.
- `.github/workflows/deploy.yml`: runs on every push to `main` and on demand from the Actions tab. It builds against the latest released library (see above) and checks a sample of pages (`full: false`, since the pull request ran everything), then runs `wrangler deploy`. It needs the repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. To deploy from your machine instead, run `pnpm docs:build` and `pnpm deploy`.
