/**
 * Handles the storage of current data in local browser Storage.
 */

import _ from 'lodash';
import React from 'react';
import localStorage from './local-storage';

import { reloadWindow } from '../Util';

import { LOCAL_STORAGE_KEY, DEFAULT_MAP_PREFERENCES } from './DefaultPreferences';
import { migrateData } from './DataImport';

/**
 * Load stored preferences.
 * If they are old, migrate the data. If they are invalid, restore defaults.
 * @param {*} key
 * @param {*} defaultValue
 */
const loadPreferences = (key = LOCAL_STORAGE_KEY, defaultValue = DEFAULT_MAP_PREFERENCES) => {
  // Fetch the stored data. If it's empty, return the default data.
  let storedData = localStorage.get(key) ?? defaultValue;

  // If the stored data is a string instead of a JSON blob...
  if (typeof storedData === 'string' || storedData instanceof String) {
    // Parse the JSON. This fixes a bug.
    storedData = JSON.parse(storedData);
  }

  // Get the version prefix.
  const versionPrefix = storedData.version;

  // Migrate the data. If it can't be parsed, it'll go into a recovery local-storage key,
  // and null will be returned.
  const migratedData = migrateData(storedData, versionPrefix);

  // If null was returned, return the default value.
  return migratedData ?? defaultValue;
};

/**
 * Store a value in local storage. Behaves similar to useState.
 * @param {*} localStorageKey The key to store the value in.
 * @param {*} defaultValue The default value. Defaults to the default map preferences.
 */
export const useStateStored = (
  localStorageKey = LOCAL_STORAGE_KEY,
  defaultValue = DEFAULT_MAP_PREFERENCES
) => {
  const [value, setValue] = React.useState(defaultValue);

  // Load once.
  React.useEffect(() => {
    // Fetch the preferences from local storage, by key.
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
  // Data change requires a page reload.
  reloadWindow();
};
