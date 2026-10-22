---
title: Versioning and support
description: "Pre-1.0 stability, how versions change, and what Eos supports."
---

# Versioning and support

## Stability

Eos is pre-1.0. Props, events and tokens can change between minor versions until 1.0. Every breaking change is listed in the release notes.

## Versions

Eos follows semantic versioning. From 1.0, a breaking change means a new major version, a new feature a minor, and a fix a patch.

Pin a minor version while Eos is pre-1.0 (`~0.x.y`). Read the release notes before you update. `@eos-ui/vue` and `@eos-ui/tokens` share one version.

## What is supported

| Area | Support |
| --- | --- |
| Vue | `^3.5` |
| Browsers | Chrome and Edge 120, Firefox 121, Safari 16.4 or newer, see [Browsers](#browsers) |
| Server rendering | `renderToString`, see [Nuxt and SSR](/guide/ssr) |
| Accessibility | WCAG 2.2 AA, see [Accessibility](/guide/accessibility) |

## Browsers

The minimum versions come from the newest CSS feature the stylesheet needs in each browser. Eos does not use the native popover or dialog elements.

| Feature | Used for | Chrome, Edge | Firefox | Safari |
| --- | --- | --- | --- | --- |
| `:dir()` | Right to left icons and switches | 120 | 49 | 16.4 |
| `:has()` | Field, tag and disclosure states | 105 | 121 | 15.4 |
| `color-mix()` | Washes, hover and press states | 111 | 113 | 16.2 |
| `@container` | Components that adapt to their own width | 105 | 110 | 16 |
| `dvh` units | Menu, command palette, dialog and drawer heights | 108 | 101 | 15.4 |
| `@layer` | The cascade layers | 99 | 97 | 15.4 |

Text wrapping (`text-wrap: balance`) and scrollbar colours (`scrollbar-color`, `scrollbar-width`) are extras. Where a browser lacks them, text wraps normally and scrollbars keep their default look.

The JavaScript is built for ES2022, which adds nothing above the CSS minimums. The versions are read from the built `style.css` and the build target using browser compatibility data. They are not tested, since the test suite runs in Chromium.

## Changelog

The [changelog](/changelog) lists every release. The same notes are published as [GitHub releases](https://github.com/Dame-G/eos/releases).
