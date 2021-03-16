/**
 * Handles the exporting of current site data as base64-encoded JSON, for later importing.
 */

import localStorage from 'packages/local-storage';

import {
  GenshinMapPreferencesLatest,
  PREFERENCES_VERSION,
} from '~/components/preferences/PreferencesSchema';
import { PREFERENCES_STORAGE_KEY } from '~/components/preferences/ReduxStore';
import { generateJSON, toBase64 } from '~/components/util';

export const PREFERENCES_PREFIX = `${PREFERENCES_VERSION}~`;

export const exportDataJSON = (
  mapPreferences: GenshinMapPreferencesLatest = localStorage.get(PREFERENCES_STORAGE_KEY)
): string => {
  // Create a JSON string of the current preferences.
  const jsonData = generateJSON(mapPreferences);
  // Prepend a version for backwards compatibility between releases.
  const base64Data = toBase64(`${PREFERENCES_PREFIX}${jsonData}`);

  return base64Data;
};
