---
title: Token reference
description: "Every EOS design token with its usage note and contrast, generated from @eos-ui/tokens. Start with the tokens you will reach for."
---

# Token reference

Every EOS component is styled with CSS variables named `--e-<name>`, so a theme is a set of variables and nothing else. Use the same variables in your own CSS and your screens will follow the theme, including dark surfaces and high contrast, without a line of extra code.

This page has three parts: the tokens you will use most, the inputs that generate all the rest, and the full reference. The values come from `@eos-ui/tokens`. To change them, see [Theming](/guide/theming) or try values in the [playground](/playground).

## Start here

You will almost never need more than these. Pick by the job, not by the colour.

| Job | Token | Use it for |
| --- | --- | --- |
| Text | `--e-ink` | Body copy, headings and icons. |
| Secondary text | `--e-muted` | Captions, hints and kickers. |
| Page | `--e-background` | The ground behind everything. |
| Cards and fields | `--e-surface` | Anything that sits on the page: cards, inputs, popovers, dialogs. |
| Quiet fill | `--e-surface-tint` | Wells, table headers, footers and empty slots. |
| Hover and selected | `--e-surface-hover` | The fill of a hovered row or item, and the selected item in a list. |
| Lines | `--e-border`, `--e-border-strong` | Hairlines and card outlines, then the edge of a control. |
| Action | `--e-primary`, `--e-on-primary` | The main button and every selected state, then the text on it. |
| Status | `--e-danger`, `--e-warning-strong`, `--e-secondary` | Errors, cautions and success, each with a `-soft` tint for backgrounds. |
| Spacing | `--e-space-1` to `--e-space-8` | Every gap and padding, from 4px to 32px. Larger steps run to `--e-space-16`. |
| Spacing, by job | `--e-gap-snug`, `--e-gap-base`, `--e-pad-card` | Named gaps and paddings that follow `spaceScale` and `density`. [Which one when](/guide/design-principles#spacing-and-layout-conventions). |
| Corners | `--e-radius-sm`, `-md`, `-lg`, `-pill` | Match the component you sit beside. |
| Lines, thick | `--e-stroke-hair`, `--e-stroke-edge`, `--e-stroke-focus` | The width of a hairline, of a control edge and of a focus ring. |
| Focus | `--e-focus-ring`, `--e-stroke-focus` | The colour of the keyboard focus outline, then its width, which is also its distance from the element. |
| Type | `--e-font-sans`, `--e-font-mono`, `--e-text-xs` to `--e-text-4xl` | Mono is for numbers, dates and kickers. |

A custom card built only from those:

```css
.balance {
  padding: var(--e-space-4);
  border: var(--e-stroke-hair) solid var(--e-border);
  border-radius: var(--e-radius-lg);
  background: var(--e-surface);
  color: var(--e-ink);
}

.balance:hover {
  background: var(--e-surface-hover);
}

.balance small {
  color: var(--e-muted);
  font: 500 var(--e-text-sm) / 1.4 var(--e-font-sans);
}
```

Two rules keep a custom screen accessible. Put `ink` and `muted` only on `surface`, `surface-tint` or `background`, since those pairs are checked. Never use `brand-blue` or `brand-green` for text: they are for decoration, and `primary` and `secondary` are the text-safe versions.

## The inputs

`defineTheme()` takes the inputs below and derives every token from them, so you set a brand colour and a surface and the rest follows with its contrast checked. The **Derives** column lists what each input drives. Constants, such as `depth`, never change. Any token can still be set by name in `tokens`, and a token set that way wins over a derived value.

<TokenTables section="inputs" />

## For design tools

`theme.dtcg()` returns the theme as [W3C Design Tokens](https://www.designtokens.org) JSON, and the default theme ships as `@eos-ui/tokens/tokens.dtcg.json`. Import it into Tokens Studio for Figma or feed it to Style Dictionary. A token that is just another token becomes an alias (`{color.ink}`), and each token's usage note is its description. Values no design-token type can hold, such as a stacked shadow, stay as CSS strings.

## Colour

Each swatch lists what the colour is for, which inputs it follows and its contrast against the colour it is paired with. Text needs 4.5:1 (AA), and edges and focus outlines need 3:1. The tints (`*-soft`) never mark a boundary on their own.

<TokenTables section="colour" />

## Type

Two families, then the styles built from them.

<TokenTables section="type" />

### Type sizes

The raw size scale the styles above use.

<TokenTables section="fontSize" />

### Letter spacing

<TokenTables section="tracking" />

### Line height

<TokenTables section="leading" />

## Spacing

A 4px scale from `space-1` (4px) to `space-8` (32px), then `space-10`, `-12` and `-16` for page-sized gaps, and `space-5` and `-7` between the steps. Use the small steps between related things, the middle steps between groups, and `space-8` between sections.

<TokenTables section="spacing" />

### Layout spacing

The gaps, paddings and gutter that components and layouts use, named by role. Each one is a step of the scale above.

<TokenTables section="layout" />

## Radius

<TokenTables section="radius" />

## Shadows

<TokenTables section="shadow" />

## Sizes

Control height (48px), the minimum tap size (44px) and the reading measure.

<TokenTables section="size" />

## Strokes and focus

<TokenTables section="stroke" />

### Slabs

The raised edge under a fill.

<TokenTables section="slab" />

## Motion

Short durations and one easing. Components switch their motion off for people who ask for reduced motion.

<TokenTables section="motion" />

## Z-index

A short, named stack, so layers never need a number you make up.

<TokenTables section="zIndex" />
