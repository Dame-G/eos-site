---
title: Tokens
description: "Every Eos design token with its usage note and contrast, generated from @eos-ui/tokens."
---

# Tokens

Every value is read from `@eos-ui/tokens` at build time, so this page matches the code. Each token is a CSS custom property named `--e-<name>`. Components read tokens and never write a raw colour, size or duration.

To change them, see [Theming](/guide/theming).

## Colour

Each colour shows its ratio against its partner, the colour it is used with. Text needs 4.5:1 (AA) and the system aims for 7:1 (AAA). Edges and focus outlines need 3:1.

<TokenTables section="colour" />

## Type

<TokenTables section="type" />

## Type sizes

<TokenTables section="fontSize" />

## Spacing

Related things sit close, groups sit apart. See [Design principles](/guide/design-principles).

<TokenTables section="spacing" />

## Radius

<TokenTables section="radius" />

## Shadows

Depth means "you can click this" or "this floats". Nothing else casts a shadow.

<TokenTables section="shadow" />

## Sizes

<TokenTables section="size" />

## Strokes and focus

<TokenTables section="stroke" />

## Motion

<TokenTables section="motion" />

## Z-index

<TokenTables section="zIndex" />
