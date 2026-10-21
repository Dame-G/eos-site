// Whether a string is, as a whole, a literal colour: a hex value or a colour function with plain numbers. Used to show a swatch beside it.
const HEX = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const FUNCTION = /^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\d\s.,%/a-z-]+\)$/i;

/** @param {string} value */
export const isColor = (value) => HEX.test(value.trim()) || FUNCTION.test(value.trim());
