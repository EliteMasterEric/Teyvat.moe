/**
 * Contains functions to save and load the Redux store in local storage.
 */

import _ from 'lodash';

import { migrateData } from '~/components/preferences/import/InternalImport';
import {
  LOCAL_STORAGE_KEY,
  DEFAULT_MAP_PREFERENCES,
  PERSISTENT_KEYS,
} from '~/components/preferences/DefaultPreferences';
import localStorage from '~/components/preferences/local-storage';
import { storeRecoveryData } from './import/Recovery';

export const saveStateToLocalStorage = (currentStore, key = LOCAL_STORAGE_KEY) => {
  const persistentStore = _.pick(currentStore, PERSISTENT_KEYS);

  localStorage.set(key, persistentStore);
};

export const loadStateFromLocalStorage = (
  key = LOCAL_STORAGE_KEY,
  defaultValue = DEFAULT_MAP_PREFERENCES
) => {
  // Fetch the stored data. If it's empty, return the default data.
  let storedData = localStorage.get(key) ?? defaultValue;

  try {
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

    // If not null was returned, merge with the default to set the non-persistent keys.
    if (migratedData != null) {
      return {
        ...defaultValue,
        ...migratedData,
      };
    }
    // If null was returned, return the default value.
    return defaultValue;
  } catch (e) {
    console.error('An error occurred while parsing local storage.');
    storeRecoveryData(storedData, `[ERROR] ${e.message}`);
    return defaultValue;
  }
};
