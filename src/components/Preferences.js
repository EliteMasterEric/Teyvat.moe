/**
 * Handle data stored in Local browser Storage.
 */
import React from 'react';
import _ from 'lodash';

import localStorage from './local-storage';
import { toBase64, fromBase64 } from './Util';
import { DEFAULT_ZOOM, MAP_CENTER } from './map/EditorMap';

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
    features: {
      anemoculus: false,
    },
    routes: {},
  },

  /**
   * Store of "done" markers.
   * Each key is the internal name of the feature,
   * and each value is an array of marker IDs marked as "done".
   */
  marked: {
    features: {
      anemoculus: [],
    },
  },

  /**
   * The current position on the map.
   * Modify this to reorient the map location.
   */
  position: {
    latlng: {
      lat: MAP_CENTER[0], // Default latitude
      lng: MAP_CENTER[1], // Default longitude
    },
    zoom: DEFAULT_ZOOM, // Default zoom level
  },

  /**
   * Store information from the last editor draft.
   */
  editor: {
    enabled: false,

    highlighted: -1,

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
  // const versionCode = decodedData.substring(0, PREFERENCES_PREFIX.length);
  const jsonData = JSON.parse(decodedData.substring(PREFERENCES_PREFIX.length));

  setMapPreferences((old) => ({ ...old, ...jsonData }));
};

export const exportDataJSON = (mapPreferences = localStorage.get(LOCAL_STORAGE_KEY)) => {
  // Create a JSON string of the current preferences.
  const jsonData = JSON.stringify(mapPreferences);
  // Prepend a version for backwards compatibility between releases.
  const base64Data = toBase64(`${PREFERENCES_PREFIX}${jsonData}`);

  return base64Data;
};

const loadPreferences = (key = LOCAL_STORAGE_KEY, defaultValue = DEFAULT_MAP_PREFERENCES) => {
  const value = localStorage.get(key) ?? defaultValue;

  if (typeof value === 'string' || value instanceof String) {
    return JSON.parse(value);
  }
  return value;
};

/**
 * Store a value in local storage. Behaves similar to useState.
 * @param {*} localStorageKey The key to store the value in.
 * @param {*} defaultValue The default value. Defaults to an empty JSON object.
 */
export const useStateStored = (
  localStorageKey = LOCAL_STORAGE_KEY,
  defaultValue = DEFAULT_MAP_PREFERENCES
) => {
  const [value, setValue] = React.useState(defaultValue);

  // Load once.
  React.useEffect(() => {
    // Get local storage.
    setValue(loadPreferences(localStorageKey, defaultValue));
  }, []);

  // Save on change.
  React.useEffect(() => {
    // Set local storage.
    localStorage.set(localStorageKey, value);
  }, [value]);

  return [value, setValue];
};

/**
 * Resets the local storage.
 * Only touches one key; legacy values are not interfered with.
 * @param {*} localStorageKey The key to alter, defaults to the local storage key.
 */
export const resetLocalStorage = (localStorageKey = LOCAL_STORAGE_KEY) => {
  localStorage.set(localStorageKey, DEFAULT_MAP_PREFERENCES);
};

export const fetchLegacyData = (excludedKeys = [LOCAL_STORAGE_KEY]) => {
  const localStorageData = localStorage.all();
  const includedKeys = Object.keys(localStorageData).filter((key) => !excludedKeys.includes(key));
  return _.pick(localStorageData, includedKeys);
};

const EXCLUDED_KEYS = [LOCAL_STORAGE_KEY, 'preferences', 'prefs', 'ally-supports-cache'];
export const exportLegacyDataJSON = (excludedKeys = EXCLUDED_KEYS) => {
  return JSON.stringify(fetchLegacyData(excludedKeys));
};
