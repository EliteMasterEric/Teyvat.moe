/**
 * Contains functions to save and load the Redux store in local storage.
 */

import _ from 'lodash';

import { migrateData } from 'src/components/preferences/DataImport';
import localStorage from 'src/components/preferences/local-storage';
import { storeRecoveryData } from 'src/components/preferences/Recovery';
import { AppState, initialState } from 'src/components/redux/types';
import { buildPreferencesForStorage } from './Serialize';

export const PREFERENCES_STORAGE_KEY = 'genshinmap-preferences';
export const CREDENTIALS_STORAGE_KEY = 'genshinmap-credentials';

export const savePreferencesToLocalStorage = (state: AppState): void => {
  localStorage.set(PREFERENCES_STORAGE_KEY, buildPreferencesForStorage(state));
};

export const loadStateFromLocalStorage = (defaultValue = initialState): AppState => {
  // Fetch the stored data. If it's empty, return the default data.
  let storedData = {
    ...(localStorage.get(PREFERENCES_STORAGE_KEY) ?? {}),
  };

  try {
    if (storedData == {}) {
      console.warn('Local storage data was empty. Using defaults.');
      return defaultValue;
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
    console.error('[ERROR] An error occurred while parsing local storage.');
    console.error(`[ERROR] ${e.message}`);
    storeRecoveryData(storedData, `[ERROR] ${e.message}`);
    return defaultValue;
  }
};

export const resetPreferencesInLocalStorage = (): void => {
  localStorage.set(PREFERENCES_STORAGE_KEY, buildPreferencesForStorage(initialState));
};
