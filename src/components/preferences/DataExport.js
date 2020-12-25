/**
 * Handles the exporting of current site data as base64-encoded JSON, for later importing.
 */

import { LOCAL_STORAGE_KEY, PREFERENCES_PREFIX } from '~/components/preferences/DefaultPreferences';
import localStorage from '~/components/preferences/local-storage';
import { generateJSON, toBase64 } from '~/components/Util';

export const exportDataJSON = (mapPreferences = localStorage.get(LOCAL_STORAGE_KEY)) => {
  // Create a JSON string of the current preferences.
  const jsonData = generateJSON(mapPreferences);
  // Prepend a version for backwards compatibility between releases.
  const base64Data = toBase64(`${PREFERENCES_PREFIX}${jsonData}`);

  return base64Data;
};
