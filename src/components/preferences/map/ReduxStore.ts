/**
 * Contains functions to save and load the Redux store in local storage.
 */

import _ from 'lodash';

import { migrateMapData } from './DataImport';
import { storeMapRecoveryData } from './Recovery';
import { buildMapPreferencesForStorage } from './Serialize';
import localStorage from 'src/components/preferences/local-storage';
import initialMapState from 'src/components/redux/slices/map/InitialState';
import { MapState } from 'src/components/redux/slices/map/Types';

export const PREFERENCES_STORAGE_KEY = 'genshinmap-preferences';
export const CREDENTIALS_STORAGE_KEY = 'genshinmap-credentials';

export const saveMapPreferencesToLocalStorage = (state: MapState): void => {
  localStorage.set(PREFERENCES_STORAGE_KEY, buildMapPreferencesForStorage(state));
};

export const loadMapStateFromLocalStorage = (defaultValue = initialMapState): MapState => {
  // Fetch the stored data. If it's empty, return the default data.
  const storedData = {
    ...(localStorage.get(PREFERENCES_STORAGE_KEY) ?? {}),
  };

  try {
    if (_.isEmpty(storedData)) {
      // Local storage data was empty. Using defaults.
      return defaultValue;
    }
    if (!('version' in storedData)) {
      throw new Error('Stored data has no version.');
    }

    // Migrate the data. If it can't be parsed, it'll go into a recovery local-storage key,
    // and null will be returned.
    const migratedData = migrateMapData(storedData, storedData.version);

    // If not null was returned, merge with the default to set the non-persistent keys.
    if (migratedData != null) {
      return {
        ...defaultValue,
        ...migratedData,
      };
    }
    // If null was returned, return the default value.
    return defaultValue;
  } catch (error) {
    console.error('[ERROR] An error occurred while parsing local storage.');
    console.error(`[ERROR] ${error.message}`);
    storeMapRecoveryData(storedData, `[ERROR] ${error.message}`);
    return defaultValue;
  }
};

export const resetMapPreferencesInLocalStorage = (): void => {
  localStorage.set(PREFERENCES_STORAGE_KEY, buildMapPreferencesForStorage(initialMapState));
};
