import {
  Avatar,
  Box,
  IconButton,
  Typography,
  makeStyles,
  Tooltip,
  Button,
  LinearProgress,
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  useGoogleLogout,
} from 'react-google-login';
import { connect, ConnectedProps } from 'react-redux';
import { loadGoogleAPI } from 'src/components/api/google';
import { f, t } from 'src/components/i18n/Localization';
import { AppDispatch, store } from 'src/components/redux';
import { sendNotification } from 'src/components/redux/dispatch';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import {
  disableGoogleAuth,
  selectAuthGoogleEnabled,
  selectAuthGoogleProfile,
  selectGoogleClientInProgress,
  setGoogleAuthProfile,
} from 'src/components/redux/slices/ui';
import { AppState, AuthGoogleProfile } from 'src/components/redux/types';
import { getFileContents, listFiles } from 'src/components/api/google/drive';
import { savePreferencesToDrive } from 'src/components/preferences/google/SaveDrive';
import { setPreferences } from 'src/components/redux/actions';
import { GenshinMapPreferencesLatest, GM_007 } from 'src/components/preferences/PreferencesSchema';
import { loadPreferencesFromDrive } from 'src/components/preferences/google/LoadDrive';

const useStyles = makeStyles((theme) => ({
  profileWelcome: {
    marginLeft: theme.spacing(2),
  },
  logoutButton: {
    marginLeft: 'auto',
  },
  centerVertical: {
    margin: 'auto 0',
  },
}));

type GoogleLoginResponseError = {
  error: string;
  details?: string;
};

type ControlsSyncUploadGoogleBaseProps = {
  label?: string;
  labelDisabled?: string;
};

// { }: ControlsSyncUploadGoogleBaseProps
const mapStateToProps = (state: AppState) => ({
  googleAuthProfile: selectAuthGoogleProfile(state),
  googleClientInProgress: selectGoogleClientInProgress(state),
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  loadPreferences: (importedData: GenshinMapPreferencesLatest) =>
    dispatch(setPreferences(importedData)),
});
type ControlsSyncUploadGoogleStateProps = ReturnType<typeof mapStateToProps>;
type ControlsSyncUploadGoogleDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsSyncUploadGoogleStateProps,
  ControlsSyncUploadGoogleDispatchProps,
  ControlsSyncUploadGoogleBaseProps,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsSyncUploadGoogleProps = ConnectedProps<typeof connector> &
  ControlsSyncUploadGoogleBaseProps;

/**
 * If responseType is 'code', callback will return the authorization code
 * that can be used to retrieve a refresh token from the server.
 */
const distinguishCode = (response: any): response is GoogleLoginResponseOffline => {
  return 'code' in response;
};

const _ControlsSyncUploadGoogle: FunctionComponent<ControlsSyncUploadGoogleProps> = ({
  googleAuthProfile,
  googleClientInProgress,
  loadPreferences,
}) => {
  const onGoogleSave = () => {
    console.log('[GOOGLE] Save clicked.');
    savePreferencesToDrive(store.getState());
  };
  const onGoogleLoad = () => {
    console.log('[GOOGLE] Load clicked.');
    loadPreferencesFromDrive()
      .then((data) => {
        if (data != null) {
          sendNotification(t('google-drive-load-success'));
          loadPreferences(data);
        } else {
          sendNotification(t('google-drive-load-failure-generic'));
        }
      })
      .catch((err) => {
        sendNotification(t('google-drive-load-failure-generic'));
      });
  };

  if (googleAuthProfile != null) {
    if (googleClientInProgress) {
      return <LinearProgress />;
    } else {
      return (
        <Box display="flex" justifyContent="space-between">
          <Button variant="contained" size="small" onClick={onGoogleSave}>
            {t('save-to-cloud')}
          </Button>
          <Button variant="contained" size="small" onClick={onGoogleLoad}>
            {t('load-from-cloud')}
          </Button>
        </Box>
      );
    }
  } else {
    return null;
  }
};

const ControlsSyncUploadGoogle = connector(_ControlsSyncUploadGoogle);

export default ControlsSyncUploadGoogle;
