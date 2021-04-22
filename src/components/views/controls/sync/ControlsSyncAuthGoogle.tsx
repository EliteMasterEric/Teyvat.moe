import { Box, Typography, makeStyles } from '@material-ui/core';
import React, { FunctionComponent, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import ControlsSyncProfileGoogle from './ControlsSyncProfileGoogle';
import { attemptGoogleSignIn, loadGoogleAPI } from 'src/components/api/google';
import { t } from 'src/components/i18n/Localization';
import { NextImage } from 'src/components/interface/Image';
import {
  selectAuthGoogleEnabled,
  selectAuthGoogleInitialized,
  selectAuthGoogleProfile,
} from 'src/components/redux/slices/Interface';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';

const useStyles = makeStyles((_theme) => ({
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
type ControlsSyncAuthGoogleStateProps = ReturnType<typeof mapStateToProps>;
const connector = connect<
  ControlsSyncAuthGoogleStateProps,
  Empty,
  ControlsSyncAuthGoogleBaseProps,
  AppState
>(mapStateToProps);

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

  if (googleLoggedIn) {
    return <ControlsSyncProfileGoogle />;
  } else {
    return authGoogleInitialized ? (
      <Box>
        <Typography variant="subtitle2">{t('google-drive-prompt')}</Typography>
        <NextImage
          onClick={() => {
            attemptGoogleSignIn();
          }}
          className={classes.googleSignIn}
          src="/images/social/google-signin.png"
          width={200}
          height={48}
        />
      </Box>
    ) : (
      <Box>
        <Typography>{t('loading')}</Typography>
      </Box>
    );
  }
};

const ControlsSyncAuthGoogle = connector(_ControlsSyncAuthGoogle);

export default ControlsSyncAuthGoogle;
