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

export const canUseDOM = (): boolean => {
  return window != null && !!window.document && !!window.document.createElement;
};

/**
 * For url https://localhost:3000?id=test&id=test2&query=fun
 * Returns {"id": ["test", "test2"], "query": ["fun"]}
 */
export const getURLParameters = (): Record<string, Array<string>> => {
  if (typeof window === 'undefined') return {};
  const urlParameters = new URLSearchParams(window.location.search);
  const urlParameterKeys = [...urlParameters.keys()];
  const keys = Object.fromEntries(
    _.map(urlParameterKeys, (key) => [key, urlParameters.getAll(key)])
  );
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
    if (fullOptions.upperCase) result = _.toUpper(result);

    // Print the result.
    if (fullOptions.debug) console.debug(result);

    // Return the result.
    return result;
  } catch {
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
  const onStateChangedReference = useRef((newValue: T) => onStateChanged(newValue));
  // useCallback is specifically designed for inline functions.
  // In other cases, useMemo should be used.
  const onStateChangedDebounced: _.DebouncedFunc<(newValue: T) => void> = useMemo(
    () => _.debounce((newValue: T) => onStateChangedReference.current(newValue), debounce),
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
  } catch (error) {
    console.warn(`WARNING: Could not load module ${key}.`);
    console.warn(error);
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

  for (const [key, value] of pairs) {
    const shouldSkip = trimNulls && value == null;
    if (!shouldSkip) {
      const resultKey = result[key];
      if (resultKey != null) {
        result[key] = [...resultKey, value];
      } else {
        result[key] = [value];
      }
    }
  }

  return result;
};

/**
 * Retrieve the time of the last Monday reset.
 */
export const getPreviousMondayReset = (): Date => {
  const date = new Date();
  const day = date.getDay();
  const previousMonday = new Date();
  if (date.getDay() == 0) {
    previousMonday.setDate(date.getDate() - 7);
  } else {
    previousMonday.setDate(date.getDate() - (day - 1));
  }
  // Reset at 9 AM UTC = 4 AM EST.
  previousMonday.setUTCHours(9, 0, 0);

  return previousMonday;
};

export const getPreviousDailyReset = (): Date => {
  const date = new Date();
  // Reset at 9 AM UTC = 4 AM EST.
  date.setUTCHours(9, 0, 0);

  return date;
};
