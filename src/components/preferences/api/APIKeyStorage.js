/**
 * Stores and retrieves access tokens from local storage.
 *
 * Some say this is insecure, but if an attacker has XSS access,
 * they can bypass any other means of accessing API keys (such as Web Workers) easily.
 * It's better to use a method which is simpler to develop.
 */
import _ from 'lodash';

const LOCAL_STORAGE_KEY = 'genshinmap-apikeystorage';

const API_KEY_STORAGE_VERSION = 'AKS_001';

const DEFAULT_API_KEY_STORE = {
  version: API_KEY_STORAGE_VERSION,

  google: null,
  github: null,
};

const migrateData = (data, version) => {
  const newData = _.cloneDeep(data);
  /* eslint-disable no-fallthrough */
  switch (version) {
    case 'AKS_001':
    // Add migration logic here.
    default:
      return newData;
  }
  /* eslint-enable no-fallthrough */
};

const loadAPIKeyStorage = (key = LOCAL_STORAGE_KEY, defaultValue = DEFAULT_API_KEY_STORE) => {
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
    console.error('An error occurred while parsing local API key storage.');
    return defaultValue;
  }
};

const saveAPIKeyStorage = (currentStore, key = LOCAL_STORAGE_KEY) => {
  localStorage.set(key, currentStore);
};

const getAPIKey = (keyName) => {
  const apiData = loadAPIKeyStorage();
  return apiData[keyName] ?? null;
};

const setAPIKey = (keyName, keyValue) => {
  const apiData = loadAPIKeyStorage();

  apiData[keyName] = keyValue;

  saveAPIKeyStorage(apiData);
};

export const getGoogleAPIKey = () => getAPIKey('google');
export const getGitHubAPIKey = () => getAPIKey('github');
export const setGoogleAPIKey = (value) => setAPIKey('google', value);
export const setGitHubAPIKey = (value) => setAPIKey('github', value);
