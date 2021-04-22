import _ from 'lodash';

/**
 * Encode an input string in base64.
 * @param {string} input The string to encode.
 * @returns {string} The encoded string.
 */
export const toBase64 = (input: string): string => btoa(input);

/**
 * Decode an input string in base64.
 * @param {String} input The string to decode.
 * @returns {String} The decoded string.
 */
export const fromBase64 = (input: string): string => atob(_.replace(input, /[\t\n\f\r ]/g, ''));
