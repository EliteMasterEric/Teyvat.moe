/**
 * Encode an input string in base64.
 * @param {string} input The string to encode.
 * @returns {string} The encoded string.
 */
export const toBase64 = (input: string): string => {
  return btoa(input);
};

/**
 * Decode an input string in base64.
 * @param {String} input The string to decode.
 * @returns {String} The decoded string.
 */
export const fromBase64 = (input: string): string => {
  // Can't have newlines in it.
  return atob(input.replace(/[ \t\r\n\f]/g, ''));
};
