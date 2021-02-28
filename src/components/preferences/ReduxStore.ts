/**
 * Contains functions to save and load the Redux store in local storage.
 */

import _ from 'lodash';

import localStorage from 'packages/local-storage';

import { migrateData } from '~/components/preferences/DataImport';
import { PREFERENCES_VERSION } from '~/components/preferences/PreferencesSchema';
import { storeRecoveryData } from '~/components/preferences/Recovery';
import { PERSISTENT_KEYS } from '~/components/redux';
import { AppState, initialState } from '~/components/redux/types';

export const LOCAL_STORAGE_KEY = 'genshinmap-preferences';

const buildStateForLocalStorage = (state: AppState) => {
  return {
    ..._.pick(state, PERSISTENT_KEYS),
    version: PREFERENCES_VERSION,
  };
};

export const saveStateToLocalStorage = (state: AppState, key = LOCAL_STORAGE_KEY): void => {
  localStorage.set(key, buildStateForLocalStorage(state));
};

export const loadStateFromLocalStorage = (
  key = LOCAL_STORAGE_KEY,
  defaultValue = initialState
): AppState => {
  // Fetch the stored data. If it's empty, return the default data.
  let storedData = localStorage.get(key);

  try {
    // If the stored data is a string instead of a JSON blob...
    if (typeof storedData === 'string') {
      // Parse the JSON. This fixes a bug.
      storedData = JSON.parse(storedData);
    }

    if (!('version' in storedData)) {
      throw Error('Stored data has no version.');
    }

    // Migrate the data. If it can't be parsed, it'll go into a recovery local-storage key,
    // and null will be returned.
    const migratedData = migrateData(storedData, storedData.version);

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

export const resetLocalStorage = (localStorageKey = LOCAL_STORAGE_KEY): void => {
  localStorage.set(localStorageKey, initialState);
};
