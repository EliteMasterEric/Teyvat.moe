import React from 'react';
import hash from 'object-hash';
import sanitizeHTML from 'sanitize-html';
import * as clipboard from 'clipboard-polyfill/text';

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
  // Can't have newlines in it.
  return atob(input.replace(/[ \t\r\n\f]/g, ''));
};

/**
 * Use object-hash to generate a hash of an object.
 * Used to easily compare an object's state.
 * @param {*} input The object to hash.
 * @returns {String} The hashed object.
 */
export const hashObject = (input) => {
  try {
    return hash(input);
  } catch (err) {
    console.error('COULD NOT HASH OBJECT');
    console.error(input);
    throw err;
  }
};

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

/**
 * Reload the browser window.
 */
export const reloadWindow = () => {
  window.location.reload();
};

/**
 * Put the provided text into the clipboard.
 * @param {*} text The text to copy.
 */
export const setBrowserClipboard = (text) => {
  clipboard.writeText(text);
};

/**
 * https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29
 * @param {*} lat Latitude
 * @param {*} lng Longitude
 * @param {*} zoom Zoom level
 * @returns {*} The x and y of the tile.
 */
export const latLngToTile = (lat, lng, zoom) => {
  return [
    Math.floor(
      ((1 -
        Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) /
        2) *
        2 ** zoom
    ),
    Math.floor(((lng + 180) / 360) * 2 ** zoom),
  ];
};

/**
 * This component renders the internal text while supporting HTML tags.
 * Strips any unsafe tags such as scripts for security.
 *
 * @param {*} children The child element should be only text.
 * @param {*} other You can pass other parameters, such as className, and they will be used by the
 */
export const SafeHTML = ({ children, ...other }) => {
  if (typeof children !== 'string') return <span>BAD INPUT TO SAFEHTML</span>;
  const options = {
    allowedTags: ['b', 'i', 'em', 'strong', 'a'],
    allowedAttributes: {
      a: ['href'],
    },
    allowedIframeHostnames: ['www.youtube.com'],
  };
  // Never fear, no danger here! We sanitized this text before rendering it.
  // eslint-disable-next-line react/no-danger
  return <span dangerouslySetInnerHTML={{ __html: sanitizeHTML(children, options) }} {...other} />;
};
