import { Box, Button, LinearProgress } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import ControlsSyncAuthGoogle from './ControlsSyncAuthGoogle';
import { t } from 'src/components/i18n/Localization';
import { loadPreferencesFromDrive } from 'src/components/preferences/google/LoadDrive';
import { savePreferencesToDrive } from 'src/components/preferences/google/SaveDrive';
import { store } from 'src/components/redux';
import { setPreferences } from 'src/components/redux/Actions';
import { sendNotification } from 'src/components/redux/dispatch';
import {
  selectAuthGoogleProfile,
  selectGoogleClientInProgress,
} from 'src/components/redux/slices/Interface';
import { AppState } from 'src/components/redux/Types';

type ControlsSyncUploadGoogleBaseProps = {
  label?: string;
  labelDisabled?: string;
};

// { }: ControlsSyncUploadGoogleBaseProps
const mapStateToProps = (state: AppState) => ({
  googleAuthProfile: selectAuthGoogleProfile(state),
  googleClientInProgress: selectGoogleClientInProgress(state),
});
const mapDispatchToProps = {
  setPreferences,
};
type ControlsSyncUploadGoogleStateProps = ReturnType<typeof mapStateToProps>;
type ControlsSyncUploadGoogleDispatchProps = typeof mapDispatchToProps;
const connector = connect<
  ControlsSyncUploadGoogleStateProps,
  ControlsSyncUploadGoogleDispatchProps,
  ControlsSyncUploadGoogleBaseProps,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsSyncUploadGoogleProps = ConnectedProps<typeof connector> &
  ControlsSyncUploadGoogleBaseProps;

const _ControlsSyncUploadGoogle: FunctionComponent<ControlsSyncUploadGoogleProps> = ({
  googleAuthProfile,
  googleClientInProgress,
  setPreferences,
}) => {
  const onGoogleLoad = () => {
    loadPreferencesFromDrive()
      .then((data) => {
        if (data != null) {
          sendNotification(t('google-drive-load-success'));
          setPreferences(data);
        } else {
          sendNotification(t('google-drive-load-failure-generic'));
        }
      })
      .catch((error) => {
        switch (error.error) {
          default:
            sendNotification(t('google-drive-load-failure-generic'));
            break;
        }
      });
  };

  const auth = <ControlsSyncAuthGoogle />;
  let upload = null;

  if (googleAuthProfile != null) {
    upload = googleClientInProgress ? (
      <LinearProgress />
    ) : (
      <Box display="flex" justifyContent="space-between">
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            savePreferencesToDrive(store.getState());
          }}
        >
          {t('save-to-cloud')}
        </Button>
        <Button variant="contained" size="small" onClick={onGoogleLoad}>
          {t('load-from-cloud')}
        </Button>
      </Box>
    );
  }

  return (
    <>
      {auth}
      {upload}
    </>
  );
};

const ControlsSyncUploadGoogle = connector(_ControlsSyncUploadGoogle);

export default ControlsSyncUploadGoogle;
