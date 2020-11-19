/**
 * Handles the storage of current data in local browser Storage.
 */
import _ from 'lodash';
import localStorage from './local-storage';

import { LOCAL_STORAGE_KEY, DEFAULT_MAP_PREFERENCES } from './DefaultPreferences';

/**
 * Resets the local storage.
 * Only touches one key; legacy values are not interfered with.
 * @param {*} localStorageKey The key to alter, defaults to the local storage key.
 */
export const resetLocalStorage = (localStorageKey = LOCAL_STORAGE_KEY) => {
  localStorage.set(localStorageKey, DEFAULT_MAP_PREFERENCES);
};
