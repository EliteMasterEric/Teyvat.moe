import { t } from '../../components/Localization';
import { migrateData, parseDataFromString } from '../../components/preferences/DataImport';
import { parseLegacyDataFromString } from '../../components/preferences/LegacyImport';
import { isValidJSON } from '../../components/Util';

/**
 * This action sets one or more attributes of the state directly.
 */
export const SET_STATE = 'genshinmap/prefs/SET_STATE';
/**
 * This action sets error text to display on the Import popup.
 */
export const SET_IMPORT_ERROR = 'genshinmap/editor/SET_IMPORT_ERROR';

/**
 * The reducer.
 * @param {*} state The current state.
 * @param {*} action An action to perform.
 * @returns {*} The modified state.
 */
const importReducer = (state, action) => {
  switch (action.type) {
    case SET_IMPORT_ERROR:
      return {
        ...state,
        importError: action.payload.value,
      };
    default:
      console.error(`IMPORT REDUCER ERROR: Unknown action '${action.type}'`);
  }
  // Default to returning the initial state.
  return state;
};

// Export the reducer as default.
export default importReducer;

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
export const displayImportError = (errorString) => {
  return {
    type: SET_IMPORT_ERROR,
    payload: {
      value: errorString,
    },
  };
};
export const clearImportError = () => {
  return {
    type: SET_IMPORT_ERROR,
    payload: {
      value: '',
    },
  };
};
export const importNewDataFromString = (dataString) => {
  try {
    const importedData = parseDataFromString(dataString);
    return {
      type: SET_STATE,
      payload: importedData,
    };
  } catch (err) {
    switch (err.name) {
      case 'InvalidCharacterError':
        if (isValidJSON(dataString)) {
          return displayImportError(t('popup-import-error-malformed-json'));
        }
        return displayImportError(t('popup-import-error-malformed-not-json'));
      default:
        console.error(err);
        console.error(err.name);
        return displayImportError(t('popup-import-error-generic'));
    }
  }
};

export const importLegacyDataFromString = (dataString) => {
  try {
    const importedData = parseLegacyDataFromString(dataString);
    return {
      type: SET_STATE,
      payload: importedData,
    };
  } catch (err) {
    switch (err.name) {
      case 'InvalidCharacterError':
        if (isValidJSON(dataString)) {
          return displayImportError(t('popup-import-error-malformed-json'));
        }
        return displayImportError(t('popup-import-error-malformed-not-json'));
      case 'SyntaxError':
        return displayImportError(t('popup-import-error-malformed-not-json'));
      default:
        console.error(err);
        console.error(err.name);
        return displayImportError(t('popup-import-error-generic'));
    }
  }
};
