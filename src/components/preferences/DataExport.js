/**
 * Handles the exporting of current site data as base64-encoded JSON, for later importing.
 */

import localStorage from './local-storage';

import { toBase64 } from '../Util';

import { LOCAL_STORAGE_KEY, PREFERENCES_PREFIX } from './DefaultPreferences';

export const exportDataJSON = (mapPreferences = localStorage.get(LOCAL_STORAGE_KEY)) => {
  // Create a JSON string of the current preferences.
  const jsonData = JSON.stringify(mapPreferences);
  // Prepend a version for backwards compatibility between releases.
  const base64Data = toBase64(`${PREFERENCES_PREFIX}${jsonData}`);

  return base64Data;
};
