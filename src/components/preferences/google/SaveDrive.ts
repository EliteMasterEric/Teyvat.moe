import { GOOGLE_DRIVE_PREFERENCES_FILENAME } from './Constants';
import { createOrUpdateFile, handleDriveError } from 'src/components/api/google';
import { t } from 'src/components/i18n/Localization';
import { serializeMapState } from 'src/components/preferences/map/Serialize';
import { sendNotification } from 'src/components/redux/slices/common/notify/Dispatch';
import { dispatchSetGoogleClientInProgress } from 'src/components/redux/slices/map/auth/Dispatch';
import { MapState } from 'src/components/redux/slices/map/Types';

export const saveMapPreferencesToDrive = (state: MapState): void => {
  dispatchSetGoogleClientInProgress(true);

  const serializedState = serializeMapState(state);

  createOrUpdateFile(GOOGLE_DRIVE_PREFERENCES_FILENAME, serializedState)
    .then((_response) => {
      sendNotification(t('map-ui:google-drive-save-success'));
    })
    .catch((error) => {
      sendNotification(t('map-ui:google-drive-save-failure-generic'));
      handleDriveError(error);
    })
    .finally(() => {
      dispatchSetGoogleClientInProgress(false);
    });
};
