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
| Browsers | Current evergreen releases of Chrome, Edge, Firefox and Safari |
| Server rendering | `renderToString`; see [Nuxt and SSR](/guide/ssr) |
| Accessibility | WCAG 2.2 AA; see [Accessibility](/guide/accessibility) |

## Changelog

Changes are published as [GitHub releases](https://github.com/Dame-G/eos/releases).
