// Whether a string is, as a whole, a literal colour: a hex value or a colour function with plain numbers. Used to show a swatch beside it.
const HEX = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const FUNCTION = /^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\d\s.,%/a-z-]+\)$/i;

/** @param {string} value */
export const isColor = (value) => HEX.test(value.trim()) || FUNCTION.test(value.trim());

// A hex colour anywhere in text, with `#`, three to eight digits, and not part of a longer word or an entity such as &#123; . Three or four digits with no letter (#123) are more likely a number than a colour.
const HEX_IN_TEXT = /(?<![A-Za-z0-9_&#])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![A-Za-z0-9_-])/gi;
const hasLetter = (hex) => /[a-f]/i.test(hex) || hex.length > 5;

/** The library's swatch square for a colour. @param {string} color */
const swatchHtml = (color) => `<span class="e-highlight-swatch" style="--_swatch:${color}" aria-hidden="true"></span>`;

/** Adds a swatch after every hex colour in already-escaped text or markup text. @param {string} text */
export const withSwatches = (text) => text.replace(HEX_IN_TEXT, (hex) => (hasLetter(hex) ? hex + swatchHtml(hex) : hex));

/** Adds a swatch after every hex colour in the text nodes of highlighted code, leaving tags and attributes alone. @param {string} html */
export const withSwatchesInMarkup = (html) => html.replace(/>([^<>]+)</g, (_m, text) => `>${withSwatches(text)}<`);
