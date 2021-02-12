import { Typography } from '@material-ui/core';
import * as clipboard from 'clipboard-polyfill/text';
import _ from 'lodash';
import objectHash from 'object-hash';
import React from 'react';
import sanitizeHTML from 'sanitize-html';

// It gets added to window.
import { mapStackTrace } from 'sourcemapped-stacktrace';

import packageJson from '~/../package.json';

export const canUseDOM = () => {
  return typeof window !== 'undefined' && window.document && window.document.createElement;
};

let dev;
export const isDev = () => {
  // Cache the result.
  if (typeof dev !== 'undefined') return dev;

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    console.debug('Running in development environment (LOCAL).');
    dev = true;
  } else if (process.env.BRANCH && process.env.BRANCH === 'develop') {
    console.debug('Running in development environment (NETLIFY).');
    dev = true;
  } else {
    dev = false;
  }

  return dev;
};

/**
 * Applies a sourcemap to a given stack trace.
 * @param {*} stackTrace The stack trace to parse.
 * @returns A Promise to parse the stack trace asynchronously.
 */
export const applySourcemapToStackTrace = (stackTrace) => {
  return new Promise((resolve, _reject) => {
    mapStackTrace(
      stackTrace,
      (mappedStack) => {
        const joinedStack = mappedStack.join('\n');
        resolve(joinedStack);
      },
      {
        filter: (_line) => true,
      }
    );
  });
};

/**
 * For url https://localhost:3000?id=test&id=test2&query=fun
 * Returns {"id": ["test", "test2"], "query": ["fun"]}
 */
export const getURLParams = () => {
  if (typeof window === 'undefined') return {};
  const urlParams = new URLSearchParams(window.location.search);
  const keys = Object.fromEntries([...urlParams.keys()].map((key) => [key, urlParams.getAll(key)]));
  return keys;
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
export const hashObject = (input, options) => {
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
        write: (x) => {
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
 * @returns {Boolean} True if valid and false if invalid.
 */
export const isValidJSON = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const jsonReplacer = (_key, value) => {
  if (value instanceof Error) {
    const error = {};

    Object.getOwnPropertyNames(value).forEach((key) => {
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
 * @param {*} input The object to convert.
 * @returns {String} A JSON string representing the object.
 */
export const generateJSON = (input) => {
  return JSON.stringify(input, jsonReplacer);
};

/**
 * Generate prettified JSON of an object, with spaces and line breaks.
 * Includes handling for undefined types such as Error.
 *
 * @param {*} input The object to convert.
 * @returns {String} Prettified JSON, with spacing and newlines.
 */
export const generatePrettyJSON = (input) => {
  return JSON.stringify(input, jsonReplacer, 2);
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
 * @returns A promise to write the data.
 */
export const setBrowserClipboard = (text) => {
  return clipboard.writeText(text);
};

export const getApplicationVersion = () => {
  return packageJson.version;
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
export const useDebouncedState = (defaultValue, onStateChanged, debounce = 300) => {
  // Create an internal local state, that is always correct.
  // The value will be committed to the state once it has been unchanged for <debounce> milliseconds.
  const [stateValue, setStateValue] = React.useState(defaultValue);

  React.useEffect(() => {
    setStateValue(defaultValue);
  }, [defaultValue]);

  // This web of references creates a reference that updates every render,
  // to call the onStateChanged, preventing stale data.
  // However, the debouncer calls a wrapper function.
  // The result is a function that never changes, that calls a function that constantly changes.
  // This allows the debounce function to hook onto the former and prevent repeated calls.
  // Thanks to: https://stackoverflow.com/questions/59183495/cant-get-lodash-debounce-to-work-properly-executed-multiple-times-reac
  const onStateChangedRef = React.useRef();
  onStateChangedRef.current = (newValue) => onStateChanged(newValue);
  const onStateChangedDebounced = React.useCallback(
    _.debounce((...args) => onStateChangedRef.current(...args), debounce),
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
export const CloneProps = ({ children, ...other }) => children(other);

// Depending on the file type being imported, the main value desired
// may or may not be in the .default property.
// JSON isn't and JSONC is, for example.
export const importFromContext = (context, key) => {
  try {
    const importedModule = context(key);
    if (_.isEqual(_.keys(importedModule), ['default'])) {
      return importedModule.default;
    }

    return importedModule;
  } catch (err) {
    console.warn(`WARNING: Could not load module ${key}.`);
    console.warn(err);
    return null;
  }
};

export const truncateFloat = (value, decimals = 0) => {
  return Math.trunc(value * 10 ** decimals) / 10 ** decimals;
};
