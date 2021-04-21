import { getFileContents, handleDriveError } from 'src/components/api/google/drive';
import { setGoogleInProgress } from 'src/components/redux/dispatch/auth';
import { migrateData } from '../DataImport';
import { GenshinMapPreferencesLatest } from '../PreferencesSchema';
import { GOOGLE_DRIVE_PREFERENCES_FILENAME } from './Constants';

export const loadPreferencesFromDrive = async (): Promise<GenshinMapPreferencesLatest | null> => {
  setGoogleInProgress(true);

  return getFileContents(GOOGLE_DRIVE_PREFERENCES_FILENAME)
    .then((res) => {
      if (res == null || res.body == null) {
        return null;
      }

      let storedData = null;
      try {
        storedData = JSON.parse(res.body);
      } catch (e) {
        if (e instanceof SyntaxError) {
          console.error('[GOOGLE] Failed to parse JSON response.');
        }
      }

      if (storedData == null) {
        return null;
      }

      return migrateData(storedData, storedData.version);
    })
    .catch((err) => {
      handleDriveError(err);
      return null;
    })
    .finally(() => {
      setGoogleInProgress(false);
    });
};
