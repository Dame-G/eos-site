# eos-site

Private source of https://eos.dame.gg: the documentation and live-preview site for the public [Eos](https://github.com/Dame-G/eos) library.

- `reference/react/`: the original React design system the library is being ported from (spec, tests, CSS). Development aid only.
- `PORTING.md`: conventions for the port.
- The site itself (VitePress, deployed to Cloudflare) is added here next to the library it documents; CI checks out `Dame-G/eos` beside this repo and builds both.
