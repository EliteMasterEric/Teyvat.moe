/**
 * Handle the exporting of data from the legacy Yuanshen.site.
 */

import _ from 'lodash';
import localStorage from './local-storage';

import { LOCAL_STORAGE_KEY } from './DefaultPreferences';

/**
 * Fetch the keys of the markers which were selected.
 * @param {*} excludedKeys
 */
export const fetchLegacyData = (excludedKeys = [LOCAL_STORAGE_KEY]) => {
  const localStorageData = localStorage.all();
  const includedKeys = Object.keys(localStorageData).filter((key) => {
    return !excludedKeys.includes(key) && localStorageData[key] === '1';
  });
  // return _.pick(localStorageData, includedKeys);
  return includedKeys;
};

/**
 * Export the legacy data in a format that can be imported by Yuanshen or GenshinMap.
 */
const EXCLUDED_KEYS = [LOCAL_STORAGE_KEY, 'preferences', 'prefs', 'ally-supports-cache'];
export const exportLegacyDataJSON = (excludedKeys = EXCLUDED_KEYS) => {
  return JSON.stringify(fetchLegacyData(excludedKeys));
};
