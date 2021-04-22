import { GOOGLE_DRIVE_PREFERENCES_FILENAME } from './Constants';
import { createOrUpdateFile, handleDriveError } from 'src/components/api/google';
import { t } from 'src/components/i18n/Localization';
import { serializeAppState } from 'src/components/preferences/Serialize';
import { sendNotification } from 'src/components/redux/dispatch';
import { setGoogleInProgress } from 'src/components/redux/dispatch/Auth';
import { AppState } from 'src/components/redux/Types';

export const savePreferencesToDrive = (state: AppState): void => {
  setGoogleInProgress(true);

  const serializedState = serializeAppState(state);

  createOrUpdateFile(GOOGLE_DRIVE_PREFERENCES_FILENAME, serializedState)
    .then((_response) => {
      sendNotification(t('google-drive-save-success'));
    })
    .catch((error) => {
      sendNotification(t('google-drive-save-failure-generic'));
      handleDriveError(error);
    })
    .finally(() => {
      setGoogleInProgress(false);
    });
};
