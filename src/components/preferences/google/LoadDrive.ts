import { GOOGLE_DRIVE_PREFERENCES_FILENAME } from './Constants';
import { getFileContents, handleDriveError } from 'src/components/api/google/Drive';
import { migrateData } from 'src/components/preferences/DataImport';
import { GenshinMapPreferencesLatest } from 'src/components/preferences/PreferencesSchema';
import { setGoogleInProgress } from 'src/components/redux/dispatch';

export const loadPreferencesFromDrive = async (): Promise<GenshinMapPreferencesLatest | null> => {
  setGoogleInProgress(true);

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

      return migrateData(storedData, storedData.version);
    })
    .catch((error) => {
      handleDriveError(error);
      return null;
    })
    .finally(() => {
      setGoogleInProgress(false);
    });
};
