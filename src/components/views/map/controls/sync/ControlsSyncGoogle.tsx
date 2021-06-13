import { Box, Button, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React, { FunctionComponent, useCallback } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { LocalizedTypography, t } from 'src/components/i18n/Localization';
import { loadMapPreferencesFromDrive } from 'src/components/preferences/google/LoadDrive';
import { saveMapPreferencesToDrive } from 'src/components/preferences/google/SaveDrive';
import { store } from 'src/components/redux';
import { setPreferences } from 'src/components/redux/slices/common/core/Actions';
import { sendNotification } from 'src/components/redux/slices/common/notify/Dispatch';
import {
  selectGoogleProfile,
  selectGoogleClientInProgress,
} from 'src/components/redux/slices/map/auth/Selector';
import selectNamespaceMap from 'src/components/redux/slices/map/Selector';
import { AppState } from 'src/components/redux/Types';
import ControlsSyncAuthGoogle from 'src/components/views/map/controls/sync/ControlsSyncAuthGoogle';

const useStyles = makeStyles((_theme) => ({
  label: {
    flexGrow: 1,
  },
  padBottom: {
    marginBottom: 8,
  },
}));

type ControlsSyncUploadGoogleBaseProps = {
  label?: string;
  labelDisabled?: string;
};

// { }: ControlsSyncUploadGoogleBaseProps
const mapStateToProps = (state: AppState) => ({
  googleAuthProfile: selectGoogleProfile(state),
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
  const classes = useStyles();

  const onGoogleLoad = () => {
    loadMapPreferencesFromDrive()
      .then((data) => {
        if (data != null) {
          sendNotification(t('google-drive-load-success'));
          setPreferences({
            map: {
              ...selectNamespaceMap(store.getState()),
              ...data,
            },
          });
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

  const triggerSaveMapPreferences = useCallback(() => {
    saveMapPreferencesToDrive(selectNamespaceMap(store.getState()));
  }, []);

  const auth = <ControlsSyncAuthGoogle />;
  let upload = null;

  if (googleAuthProfile != null) {
    upload = googleClientInProgress ? (
      <LinearProgress />
    ) : (
      <Box display="flex" justifyContent="space-between">
        <Button variant="contained" size="small" onClick={triggerSaveMapPreferences}>
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
      <LocalizedTypography
        className={clsx(classes.label, classes.padBottom)}
        i18nKey="map-ui:sync-google-drive"
      />
      {auth}
      {upload}
    </>
  );
};

const ControlsSyncUploadGoogle = connector(_ControlsSyncUploadGoogle);

export default ControlsSyncUploadGoogle;
