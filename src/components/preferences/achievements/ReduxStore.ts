/**
 * Contains functions to save and load the Redux store in local storage.
 */

import _ from 'lodash';

import { migrateAchievementsData } from './DataImport';
import { storeAchievementsRecoveryData } from './Recovery';
import { buildAchievementsPreferencesForStorage } from './Serialize';
import localStorage from 'src/components/preferences/local-storage';
import initialAchievementsState from 'src/components/redux/slices/achievements/InitialState';
import { AchievementsState } from 'src/components/redux/slices/achievements/Types';

export const PREFERENCES_STORAGE_KEY = 'tevyatmoe-achievements-preferences';
export const CREDENTIALS_STORAGE_KEY = 'tevyatmoe-achievements-credentials';

export const saveAchievementsPreferencesToLocalStorage = (state: AchievementsState): void => {
  localStorage.set(PREFERENCES_STORAGE_KEY, buildAchievementsPreferencesForStorage(state));
};

export const loadAchievementsStateFromLocalStorage = (
  defaultValue = initialAchievementsState
): AchievementsState => {
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
    const migratedData = migrateAchievementsData(storedData, storedData.version);

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
    storeAchievementsRecoveryData(storedData, `[ERROR] ${error.message}`);
    return defaultValue;
  }
};

export const resetAchievementsPreferencesInLocalStorage = (): void => {
  localStorage.set(
    PREFERENCES_STORAGE_KEY,
    buildAchievementsPreferencesForStorage(initialAchievementsState)
  );
};
