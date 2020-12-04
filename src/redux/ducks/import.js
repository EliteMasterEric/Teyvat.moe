import { migrateData, parseDataFromString } from '../../components/preferences/DataImport';
import { parseLegacyDataFromString } from '../../components/preferences/LegacyImport';

import { SET_STATE } from './index';

/**
 * The action creators.
 */

export const importFromLocalStorage = (localStorageData) => {
  let storedData = localStorageData;
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

  return {
    type: SET_STATE,
    payload: {
      options: migratedData?.options,
      displayed: migratedData?.displayed,
      completed: migratedData?.completed,
      editor: migratedData?.editor,
    },
  };
};
export const importNewDataFromString = (dataString) => {
  const importedData = parseDataFromString(dataString);
  return {
    type: SET_STATE,
    payload: importedData,
  };
};
export const importLegacyDataFromString = (dataString) => {
  const importedData = parseLegacyDataFromString(dataString);
  return {
    type: SET_STATE,
    payload: importedData,
  };
};
