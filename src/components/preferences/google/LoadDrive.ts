import { GOOGLE_DRIVE_PREFERENCES_FILENAME } from './Constants';
import { getFileContents, handleDriveError } from 'src/components/api/google/Drive';
import { migrateMapData } from 'src/components/preferences/map/DataImport';
import { GenshinMapPreferencesLatest } from 'src/components/preferences/map/PreferencesSchema';
import { dispatchSetGoogleClientInProgress } from 'src/components/redux/slices/map/auth/Dispatch';

export const loadMapPreferencesFromDrive = async (): Promise<GenshinMapPreferencesLatest | null> => {
  dispatchSetGoogleClientInProgress(true);

  return getFileContents(GOOGLE_DRIVE_PREFERENCES_FILENAME)
    .then((response) => {
      if (response == null || response.body == null) {
        return null;
      }

      let storedData = null;
      try {
        storedData = JSON.parse(response.body);
      } catch (error) {
        if (error instanceof SyntaxError) {
          console.error('[GOOGLE] Failed to parse JSON response.');
        }
      }

      if (storedData == null) {
        return null;
      }

      return migrateMapData(storedData, storedData.version);
    })
    .catch((error) => {
      handleDriveError(error);
      return null;
    })
    .finally(() => {
      dispatchSetGoogleClientInProgress(false);
    });
};
