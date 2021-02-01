import { Typography } from '@material-ui/core';
import * as clipboard from 'clipboard-polyfill/text';
import _ from 'lodash';
import objectHash from 'object-hash';
import React from 'react';
import sanitizeHTML from 'sanitize-html';

import packageJson from '~/../package.json';

export const canUseDOM = () => {
  return typeof window !== 'undefined' && window.document && window.document.createElement;
};

let dev: boolean;
export const isDev = () => {
  // Cache the result.
  if (typeof dev !== 'undefined') return dev;

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    console.debug('Running in development environment.');
    dev = true;
  } else {
    dev = false;
  }

  return dev;
};

/**
 * For url https://localhost:3000?id=test&id=test2&query=fun
 * Returns {"id": ["test", "test2"], "query": ["fun"]}
 */
export const getURLParams = () => {
  if (typeof window === 'undefined') return {};
  const urlParams = new URLSearchParams(window.location.search);
  const keys = _.fromPairs([..._.keys(urlParams)].map((key) => [key, urlParams.getAll(key)]));
  return keys;
};

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
 * @param {string} input The string to decode.
 * @returns {string} The decoded string.
 */
export const fromBase64 = (input: string): string => {
  // Can't have newlines in it.
  return atob(input.replace(/[ \t\r\n\f]/g, ''));
};

/**
 * Use object-hash to generate a hash of an object.
 * Used to easily compare an object's state.
 * @param {*} input The object to hash.
 * @returns {String} The hashed object.
 */
export const hashObject = (input: any, options) => {
  try {
    const fullOptions = {
      algorithm: 'sha1',
      unorderedArrays: false,
      unorderedSets: true,
      unorderedObjects: true,
      upperCase: true,
      ...options,
    };

    if (fullOptions.debug) {
      // writeToStream will display the information that WOULD have been hashed.
      // Used for debugging.
      let output = '';
      objectHash.writeToStream(input, fullOptions, {
        write: (x: string) => {
          output += x;
        },
      });
      console.debug(output);
    }
    // Actually return the hash.
    let result = objectHash(input, fullOptions);

    // Convert to uppercase.
    if (fullOptions.upperCase) result = result.toUpperCase();

    // Print the result.
    if (fullOptions.debug) console.debug(result);

    // Return the result.
    return result;
  } catch (err) {
    console.error(input);
    const output = new Error('Unable to hash object, did an input leak?');
    output.stack = err.stack;
    output.detail = input;
    throw output;
  }
};

/**
 * Checks whether the input string is a valid JSON blob.
 * @param {string} str The input string.
 * @returns {boolean} True if str is valid JSON and false if invalid.
 */
export const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const jsonReplacer = (_key: string, value: any) => {
  if (value instanceof Error) {
    const error = {};

    Object.getOwnPropertyNames(value).forEach((key: string) => {
      error[key] = value[key];
    });

    return error;
  }

  return value;
};

/**
 * Generate JSON of an object.
 * Includes handling for undefined types such as Error.
 *
 * @param {any} input The object to convert.
 * @returns {string} A JSON string representing the object.
 */
export const generateJSON = (input: any): string => {
  return JSON.stringify(input, jsonReplacer);
};

/**
 * Generate prettified JSON of an object, with spaces and line breaks.
 * Includes handling for undefined types such as Error.
 *
 * @param {any} input The object to convert.
 * @returns {string} Prettified JSON, with spacing and newlines.
 */
export const generatePrettyJSON = (input: any): string => {
  return JSON.stringify(input, jsonReplacer, 2);
};

/**
 * Open a URL in another tab.
 * @param {string} url The URL to open.
 */
export const openURLInWindow = (url: any) => {
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
 * @param {string} text The text to copy.
 * @returns A promise to write the data.
 */
export const setBrowserClipboard = (text: string): Promise<void> => {
  return clipboard.writeText(text);
};

/**
 * @returns The current version of the app, as defined in package.json.
 */
export const getApplicationVersion = (): string => {
  return packageJson.version;
};

/**
 * https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29
 * @param {number} lat Latitude
 * @param {number} lng Longitude
 * @param {number} zoom Zoom level
 * @returns {number[]} The x and y of the tile.
 */
export const latLngToTile = (lat: number, lng: number, zoom: number): number[] => {
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
export const SafeHTML = ({ children, ...other }: { children: string }) => {
  const options = {
    allowedTags: ['b', 'i', 'em', 'strong', 'a'],
    allowedAttributes: {
      a: ['href'],
    },
    allowedIframeHostnames: ['www.youtube.com'],
  };
  // Never fear, no danger here! We sanitized this text before rendering it.
  // eslint-disable-next-line react/no-danger
  return (
    <Typography dangerouslySetInnerHTML={{ __html: sanitizeHTML(children, options) }} {...other} />
  );
};

/**
 * A React state which attaches to a debounced callback.
 * @param {*} defaultValue The default state value.
 * @param {*} onStateChanged The default state value.
 * @param {*} debounce Only call onStateChanged if the value has not changed in x milliseconds.
 *
 * @returns [stateValue, setStateValue] The getter and setter of the state.
 *   When setStateValue is called, and hasn't been called again after 300 milliseconds,
 *   onStateChanged will be called with the new value.
 */
export const useDebouncedState = <T extends unknown>(
  defaultValue: T,
  onStateChanged: (newValue: T) => void,
  debounce: number = 300
) => {
  // Create an internal local state, that is always correct.
  // The value will be committed to the state once it has been unchanged for <debounce> milliseconds.
  const [stateValue, setStateValue] = React.useState<T>(defaultValue);

  React.useEffect(() => {
    setStateValue(defaultValue);
  }, [defaultValue]);

  // This web of references creates a reference that updates every render,
  // to call the onStateChanged, preventing stale data.
  // However, the debouncer calls a wrapper function.
  // The result is a function that never changes, that calls a function that constantly changes.
  // This allows the debounce function to hook onto the former and prevent repeated calls.
  // Thanks to: https://stackoverflow.com/questions/59183495/cant-get-lodash-debounce-to-work-properly-executed-multiple-times-reac
  const onStateChangedRef = React.useRef<(newValue: T) => void>();
  onStateChangedRef.current = (newValue: T) => onStateChanged(newValue);
  const onStateChangedDebounced = React.useCallback(
    _.debounce((newValue: T) => {
      if (onStateChangedRef && onStateChangedRef.current) {
        onStateChangedRef.current(newValue);
      }
    }, debounce),
    [debounce]
  );

  // Call the debounced function whenever stateValue changes.
  React.useEffect(() => {
    onStateChangedDebounced(stateValue);
  }, [stateValue]);

  // Pass the reference to the state getter and setter.
  return [stateValue, setStateValue];
};

/**
 * MaterialUI can break if it can't assign props to certain children.
 * @see https://github.com/mui-org/material-ui/issues/12597#issuecomment-455244379
 *
 * @param {*} children A function which takes the other props passed to this component as an argument.
 */
export const CloneProps = ({ children, ...other }: { children: Function }) => children(other);

// Depending on the file type being imported, the main value desired
// may or may not be in the .default property.
// JSON isn't and JSONC is, for example.
export const importFromContext = (context: any, key: String) => {
  const importedModule = context(key);
  if (_.isEqual(_.keys(importedModule), ['default'])) {
    return importedModule.default;
  }

  return importedModule;
};
