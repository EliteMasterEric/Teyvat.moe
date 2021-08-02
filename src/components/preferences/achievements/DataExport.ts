/**
 * Handles the exporting of current site data as base64-encoded JSON, for later importing.
 */

import { TeyvatMoeAchievementPreferences, PREFERENCES_VERSION } from './PreferencesSchema';
import { PREFERENCES_STORAGE_KEY } from './ReduxStore';
import localStorage from 'src/components/preferences/local-storage';
import { generateJSON, toBase64 } from 'src/components/util';

export const PREFERENCES_PREFIX = `${PREFERENCES_VERSION}~`;

export const exportMapDataJSON = (
  achievementsPreferences: TeyvatMoeAchievementPreferences = localStorage.get(
    PREFERENCES_STORAGE_KEY
  )
): string => {
  // Create a JSON string of the current preferences.
  const jsonData = generateJSON(achievementsPreferences);
  // Prepend a version for backwards compatibility between releases.
  const base64Data = toBase64(`${PREFERENCES_PREFIX}${jsonData}`);

  return base64Data;
};
