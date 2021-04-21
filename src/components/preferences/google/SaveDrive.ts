import { createOrUpdateFile, handleDriveError } from 'src/components/api/google';
import { t } from 'src/components/i18n/Localization';
import { sendNotification } from 'src/components/redux/dispatch';
import { setGoogleInProgress } from 'src/components/redux/dispatch/auth';
import { AppState } from 'src/components/redux/types';
import { serializeAppState } from '../Serialize';
import { GOOGLE_DRIVE_PREFERENCES_FILENAME } from './Constants';

export const savePreferencesToDrive = (state: AppState): void => {
  setGoogleInProgress(true);

  const serializedState = serializeAppState(state);

  createOrUpdateFile(GOOGLE_DRIVE_PREFERENCES_FILENAME, serializedState)
    .then((res) => {
      sendNotification(t('google-drive-save-success'));
    })
    .catch((err) => {
      sendNotification(t('google-drive-save-failure-generic'));
      handleDriveError(err);
    })
    .finally((res) => {
      setGoogleInProgress(false);
    });
};
