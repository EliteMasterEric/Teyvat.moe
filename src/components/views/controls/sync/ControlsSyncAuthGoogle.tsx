import { Box, Typography } from '@material-ui/core';
import React, { FunctionComponent, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { attemptGoogleSignIn, loadGoogleAPI } from 'src/components/api/google';
import { t } from 'src/components/i18n/Localization';
import { AppDispatch } from 'src/components/redux';
import {
  disableGoogleAuth,
  selectAuthGoogleEnabled,
  selectAuthGoogleInitialized,
  selectAuthGoogleProfile,
  setGoogleAuthProfile,
} from 'src/components/redux/slices/ui';
import { AppState, AuthGoogleProfile } from 'src/components/redux/types';
import { NextImage } from 'src/components/interface/Image';
import ControlsSyncProfileGoogle from './ControlsSyncProfileGoogle';

import { makeStyles } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  googleSignIn: {
    cursor: 'pointer',
  },
}));

type ControlsSyncAuthGoogleBaseProps = {
  label?: string;
  labelDisabled?: string;
};

// { }: ControlsSyncAuthGoogleBaseProps
const mapStateToProps = (state: AppState) => ({
  authGoogleEnabled: selectAuthGoogleEnabled(state),
  authGoogleInitialized: selectAuthGoogleInitialized(state),
  googleLoggedIn: selectAuthGoogleProfile(state) != null,
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  disableGoogleAuth: () => dispatch(disableGoogleAuth()),
  setGoogleAuthProfile: (profile: AuthGoogleProfile) => dispatch(setGoogleAuthProfile(profile)),
  clearGoogleAuthProfile: () => dispatch(setGoogleAuthProfile(null)),
});
type ControlsSyncAuthGoogleStateProps = ReturnType<typeof mapStateToProps>;
type ControlsSyncAuthGoogleDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsSyncAuthGoogleStateProps,
  ControlsSyncAuthGoogleDispatchProps,
  ControlsSyncAuthGoogleBaseProps,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsSyncAuthGoogleProps = ConnectedProps<typeof connector> &
  ControlsSyncAuthGoogleBaseProps;

const _ControlsSyncAuthGoogle: FunctionComponent<ControlsSyncAuthGoogleProps> = ({
  authGoogleInitialized,
  googleLoggedIn,
}) => {
  const classes = useStyles();

  useEffect(() => {
    // Ensure the Google API client is enabled and initialized.
    loadGoogleAPI();
  }, []);

  const onGoogleLoginClick = () => {
    console.log('[GOOGLE] Login button clicked.');
    attemptGoogleSignIn();
  };

  if (googleLoggedIn) {
    return <ControlsSyncProfileGoogle />;
  } else {
    if (authGoogleInitialized) {
      return (
        <Box>
          <Typography variant="subtitle2">{t('google-drive-prompt')}</Typography>
          <NextImage
            onClick={onGoogleLoginClick}
            className={classes.googleSignIn}
            src="/images/social/google-signin.png"
            width={200}
            height={48}
          />
        </Box>
      );
    } else {
      return (
        <Box>
          <Typography>{t('loading')}</Typography>
        </Box>
      );
    }
  }
};

const ControlsSyncAuthGoogle = connector(_ControlsSyncAuthGoogle);

export default ControlsSyncAuthGoogle;
