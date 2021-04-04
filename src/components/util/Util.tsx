import { Typography } from '@material-ui/core';

import * as clipboard from 'clipboard-polyfill/text';
import _ from 'lodash';
import ObjectHash from 'object-hash';
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  FunctionComponent,
  ReactElement,
} from 'react';

import sanitizeHTML from 'sanitize-html';

// It gets added to window.
import { mapStackTrace } from 'sourcemapped-stacktrace';

// The app version is defined in only one location.
// eslint-disable-next-line no-restricted-imports
import packageJson from '../../../package.json';

export const canUseDOM = (): boolean => {
  return window != null && !!window.document && !!window.document.createElement;
};

let dev: boolean | null = null;
export const isDev = (): boolean => {
  // Cache the result.
  if (dev != null) return dev;

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
 * @param stackTrace The stack trace to parse.
 * @returns A Promise to parse the stack trace asynchronously.
 */
export const applySourcemapToStackTrace = (stackTrace: string): Promise<string> => {
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
export const getURLParams = (): Record<string, Array<string>> => {
  if (typeof window === 'undefined') return {};
  const urlParams = new URLSearchParams(window.location.search);
  const keys = Object.fromEntries([...urlParams.keys()].map((key) => [key, urlParams.getAll(key)]));
  return keys;
};

/**
 * Use object-hash to generate a hash of an object.
 * Used to easily compare an object's state.
 * @param {any} input The object to hash.
 * @param {ObjectHash.IOptions} options How do you define a variable of this type?
 * @returns {String} The hashed object.
 */
type ObjectHashOptions = Parameters<typeof ObjectHash>[1] & {
  debug?: boolean;
  upperCase?: boolean;
};
export const hashObject = (input: unknown, options?: ObjectHashOptions): string => {
  try {
    const fullOptions: ObjectHashOptions = {
      algorithm: 'sha1',
      unorderedArrays: false,
      unorderedSets: true,
      unorderedObjects: true,
      upperCase: true,
      debug: false,
      ...options,
    };

    if (fullOptions.debug) {
      // writeToStream will display the information that WOULD have been hashed.
      // Used for debugging.
      let output = '';
      ObjectHash.writeToStream(input, fullOptions, {
        write: (x) => {
          output += x;
        },
      });
      console.debug(output);
    }
    // Actually return the hash.
    let result = ObjectHash(input, fullOptions);

    // Convert to uppercase.
    if (fullOptions.upperCase) result = result.toUpperCase();

    // Print the result.
    if (fullOptions.debug) console.debug(result);

    // Return the result.
    return result;
  } catch (err) {
    console.error(input);
    throw new Error(`Could not hash data: ${input}`);
  }
};

/**
 * Open a URL in another tab.
 * @param url The URL to open.
 */
export const openURLInWindow = (url: string): void => {
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
export const getUnixTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

/**
 * Reload the browser window.
 */
export const reloadWindow = (): void => {
  window.location.reload();
};

/**
 * Put the provided text into the clipboard.
 * @param text The text to copy.
 * @returns A promise to write the data.
 */
export const setBrowserClipboard = (text: string): Promise<void> => {
  return clipboard.writeText(text);
};

/**
 * Fetches the current application version from the package.json file.
 * @returns {string} The package version.
 */
export const getApplicationVersion = (): string => {
  return packageJson.version;
};

/**
 * https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29
 * @param lat Latitude
 * @param lng Longitude
 * @param zoom Zoom level
 * @returns The x and y of the tile.
 */
export const latLngToTile = (lat: number, lng: number, zoom: number): [number, number] => {
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
 * @param children The child element should be only text.
 * @param other You can pass other parameters, such as className, and they will be used by the
 */
type SafeHTMLProps = Omit<React.ComponentProps<typeof Typography>, 'children'> & {
  children: string;
};
export const SafeHTML: FunctionComponent<SafeHTMLProps> = ({ children, ...other }) => {
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
 * @param defaultValue The default state value.
 * @param onStateChanged The default state value.
 * @param debounce Only call onStateChanged if the value has not changed in x milliseconds.
 *
 * @returns [stateValue, setStateValue] The getter and setter of the state.
 *   When setStateValue is called, and hasn't been called again after 300 milliseconds,
 *   onStateChanged will be called with the new value.
 */
export const useDebouncedState = <T extends unknown>(
  defaultValue: T,
  onStateChanged: (newValue: T) => void,
  debounce = 300
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  // Create an internal local state, that is always correct.
  // The value will be committed to the state once it has been unchanged for <debounce> milliseconds.
  const [stateValue, setStateValue] = useState<T>(defaultValue);

  // Whenever the value passed in changes, update the internal state.
  useEffect(() => {
    setStateValue(defaultValue);
  }, [defaultValue]);

  // This web of references creates a reference that updates every render,
  // to call the onStateChanged, preventing stale data.
  // However, the debouncer calls a wrapper function.
  // The result is a function that never changes, that calls a function that constantly changes.
  // This allows the debounce function to hook onto the former and prevent repeated calls.
  // Thanks to: https://stackoverflow.com/questions/59183495/cant-get-lodash-debounce-to-work-properly-executed-multiple-times-reac
  const onStateChangedRef = useRef((newValue: T) => onStateChanged(newValue));
  // useCallback is specifically designed for inline functions.
  // In other cases, useMemo should be used.
  const onStateChangedDebounced: _.DebouncedFunc<(newValue: T) => void> = useMemo(
    () => _.debounce((newValue: T) => onStateChangedRef.current(newValue), debounce),
    [debounce]
  );

  // Call the debounced function whenever stateValue changes.
  useEffect(() => {
    onStateChangedDebounced(stateValue);
  }, [stateValue, onStateChangedDebounced]);

  // Pass the reference to the state getter and setter.
  return [stateValue, setStateValue];
};

/**
 * MaterialUI can break if it can't assign props to certain children.
 * @see https://github.com/mui-org/material-ui/issues/12597#issuecomment-455244379
 *
 * @param children A function which takes the other props passed to this component as an argument.
 */
interface ClonePropsProps {
  children: (other: { [key: string]: any }) => ReactElement;
  [key: string]: any;
}
export const CloneProps: FunctionComponent<ClonePropsProps> = ({ children, ...other }) =>
  children(other);

// Depending on the file type being imported, the main value desired
// may or may not be in the .default property.
export const importFromContext = (context: __WebpackModuleApi.RequireContext, key: string): any => {
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

export const truncateFloat = (value: number, decimals = 0): number => {
  return Math.trunc(value * 10 ** decimals) / 10 ** decimals;
};

/**
 * Given an array of key-value pairs, returns an object of key: [value] pairs.
 * Appends to existing arrays to smoothly handle duplicates,
 * and trims null and undefined values by default.
 */
export const fromPairsToArrays = (
  pairs: Array<[string, any]>,
  trimNulls = true
): Record<string, Array<any>> => {
  const result: Record<string, Array<any>> = {};

  _.forEach(pairs, ([key, value]) => {
    const shouldSkip = trimNulls && value == null;
    if (!shouldSkip) {
      const resultKey = result[key];
      if (resultKey != null) {
        result[key] = [...resultKey, value];
      } else {
        result[key] = [value];
      }
    }
  });

  return result;
};

/**
 * Retrieve the time of the last Monday reset.
 */
export const getPreviousMondayReset = (): Date => {
  const date = new Date();
  const day = date.getDay();
  const prevMonday = new Date();
  if (date.getDay() == 0) {
    prevMonday.setDate(date.getDate() - 7);
  } else {
    prevMonday.setDate(date.getDate() - (day - 1));
  }
  // Reset at 9 AM UTC = 4 AM EST.
  prevMonday.setUTCHours(9, 0, 0);

  return prevMonday;
};

export const getPreviousDailyReset = (): Date => {
  const date = new Date();
  // Reset at 9 AM UTC = 4 AM EST.
  date.setUTCHours(9, 0, 0);

  return date;
};
