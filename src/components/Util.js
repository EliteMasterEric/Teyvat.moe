import hash from 'object-hash';
import { formatDateTime } from './Localization';

export const canUseDOM = () => {
  return typeof window !== 'undefined' && window.document && window.document.createElement;
};

/**
 * Encode an input string in base64.
 * @param {String} input The string to encode.
 * @returns {String} The encoded string.
 */
export const toBase64 = (input) => {
  return btoa(input);
};

/**
 * Decode an input string in base64.
 * @param {String} input The string to decode.
 * @returns {String} The decoded string.
 */
export const fromBase64 = (input) => {
  return atob(input);
};

/**
 * Use object-hash to generate a hash of an object.
 * Used to easily compare an object's state.
 * @param {*} input The object to hash.
 * @returns {String} The hashed object.
 */
export const hashObject = (input) => hash(input);

/**
 * Generate prettified JSON of an object.
 * @param {*} input The object to convert.
 * @returns {String} Prettified JSON, with spacing and newlines.
 */
export const generatePrettyJSON = (input) => {
  return JSON.stringify(input, null, 2);
};

/**
 * Open a URL in another tab.
 * @param {String} url The URL to open.
 */
export const openURLInWindow = (url) => {
  if (window == null) return;

  const win = window.open(url, '_blank');
  if (win != null) {
    win.focus();
  }
};

/**
 * Retrieve the current Unix timestamp, in seconds.
 * @returns A Unix timestamp, in seconds.
 */
export const getUnixTimestamp = () => {
  return Math.floor(Date.now() / 1000);
};
