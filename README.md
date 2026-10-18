# aegis-site

Private source of https://aegis.dame.gg: the documentation and live-preview site for the public [Aegis](https://github.com/Dame-G/aegis) library.

- `reference/react/`: the original React design system the library is being ported from (spec, tests, CSS). Development aid only.
- `PORTING.md`: conventions for the port.
- The site itself (VitePress, deployed to Cloudflare) is added here next to the library it documents; CI checks out `Dame-G/aegis` beside this repo and builds both.
