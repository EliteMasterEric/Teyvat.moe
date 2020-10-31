/**
 * Handle data stored in Local browser Storage.
 */
import React from 'react';
import localStorage from 'local-storage';

import { toBase64, fromBase64 } from './Util';

const LOCAL_STORAGE_KEY = 'genshinmap-preferences';
const GENSHINMAP_DATA_VERSION = 'GM_001';
const PREFERENCES_PREFIX = `${GENSHINMAP_DATA_VERSION}~`;

export const DEFAULT_MAP_PREFERENCES = {
  /**
   * Store of currently displayed marker layers.
   * Each key is the internal name of the feature,
   * and each value is a boolean for whether it is currently displayed.
   */
  displayed: {
    anemoculus: false,
  },

  /**
   * Store of "done" markers.
   * Each key is the internal name of the feature,
   * and each value is an array of marker IDs marked as "done".
   */
  marked: {
    anemoculus: [],
  },

  /**
   * Store information from the last editor draft.
   */
  editor: {
    enabled: false,

    feature: {
      name: 'New Feature',
      region: 'mondstadt',
      category: 'special',
      cluster: false,
      data: [],
    },
  },
};

export const importData = (input, setMapPreferences) => {
  const decodedData = fromBase64(input);
  const versionCode = input.substring(0, PREFERENCES_PREFIX.length);
  const jsonData = JSON.parse(input.substring(PREFERENCES_PREFIX.length));

  setMapPreferences((old) => ({ ...old, ...jsonData }));
};

export const exportData = (mapPreferences) => {
  // Create a JSON string of the current preferences.
  const jsonData = JSON.stringify(mapPreferences);
  // Prepend a version for backwards compatibility between releases.
  const base64Data = toBase64(`${PREFERENCES_PREFIX}${jsonData}`);

  return base64Data;
};

/**
 * Store a value in local storage. Behaves similar to useState.
 * @param {*} localStorageKey The key to store the value in.
 * @param {*} defaultValue The default value. Defaults to an empty JSON object.
 */
export const useStateStored = (
  localStorageKey = 'genshinmap-preferences',
  defaultValue = DEFAULT_MAP_PREFERENCES
) => {
  const [value, setValue] = React.useState(defaultValue);

  // Load once.
  React.useEffect(() => {
    setValue(JSON.parse(localStorage(localStorageKey)) ?? defaultValue);
  }, []);

  // Save on change.
  React.useEffect(() => {
    localStorage(localStorageKey, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
};

export const resetLocalStorage = (localStorageKey = LOCAL_STORAGE_KEY) => {
  localStorage(localStorageKey, JSON.stringify(DEFAULT_MAP_PREFERENCES));
};
