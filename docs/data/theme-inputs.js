/**
 * Hand-written notes for the `defineTheme()` inputs on the token reference. The list of inputs itself is read from
 * `ThemeInput` in @eos-ui/tokens (see theme-source.js), so an input the library adds shows up with its own doc comment
 * even before it has a note here. `tests/theme-docs-sync.test.ts` fails when a guide page leaves one out.
 *
 * `neutral` is what the input does when left out: a literal, or `{ token }` for the default value of a token.
 */
export const INPUT_NOTES = {
  brand: { controls: "The brand colour: action colour, tinted ground, input focus edge.", neutral: { token: "brand" } },
  accent: { controls: "A second brand colour for the secondary action. It does not change the success tone.", neutral: { token: "brand-accent" } },
  danger: { controls: "The destructive action colour, its text and tint.", neutral: { token: "danger" } },
  warning: { controls: "The caution colour: warning text and tint.", neutral: { token: "warning-strong" } },
  success: { controls: "The positive colour (paid, done, saved): success text and tint.", neutral: { token: "success" } },
  background: { controls: "The page ground: the colour behind everything.", neutral: { token: "background" } },
  surface: { controls: "Cards, fields, popovers and panels. A dark surface lifts the action colours.", neutral: { token: "surface" } },
  foreground: { controls: "Text and lines: secondary text, edges, the focus outline.", neutral: { token: "ink" } },
  fonts: { controls: "Font stacks, { sans, mono, script }. Never bundled.", neutral: "Bricolage Grotesque, Geist Mono" },
  radius: { controls: "Corner style: sharp, default or round, a base radius in px, or { sm, md, lg }.", neutral: "default" },
  preset: { controls: "A named look that sets elevation, strokes, radius and motion together: paper, ink or quiet. Your own entries win.", neutral: "paper" },
  elevation: { controls: "How depth is drawn: outline, lifted or bold.", neutral: "outline" },
  strokes: { controls: "Line weights in px, { hair, focus }. The edge and card strokes follow hair; pin one with stroke-edge or stroke-card in tokens.", neutral: "{ hair: 1, focus: 2 }" },
  contrast: { controls: "high draws borders in the foreground colour, muted text at 15:1, a neutral tint and a darker scrim. auto switches to high under prefers-contrast: more.", neutral: "standard" },
  scheme: { controls: "auto keeps the theme light and applies the dark input when the visitor prefers a dark page.", neutral: "fixed" },
  dark: { controls: "The inputs that change on a dark page when scheme is auto, usually surface and foreground.", neutral: "a dark surface" },
  density: { controls: "compact tightens the space scale to 0.75 and sets controls to the 44px tap target.", neutral: "comfortable" },
  textScale: { controls: "Multiplier for the type scale.", neutral: "1" },
  spaceScale: { controls: "Multiplier for the spacing scale.", neutral: "1" },
  controlHeight: { controls: "Height in px of every tappable control; chips follow at half.", neutral: "48" },
  motion: { controls: "How state changes feel: default, snappy or gentle.", neutral: "default" },
};

/** Members of ThemeInput that are options, not inputs that derive tokens. */
export const NOT_INPUTS = ["name", "tokens", "strict"];
