import { Avatar, Box, IconButton, Typography, makeStyles, Tooltip } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { attemptGoogleSignOut } from 'src/components/api/google';
import { f, t } from 'src/components/i18n/Localization';
import { AppDispatch } from 'src/components/redux';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import { selectAuthGoogleProfile } from 'src/components/redux/slices/ui';
import { AppState } from 'src/components/redux/types';
import { Empty } from 'src/components/Types';

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

// { }: ControlsSyncProfileGoogleBaseProps
const mapStateToProps = (state: AppState) => ({
  googleAuthProfile: selectAuthGoogleProfile(state),
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({});
type ControlsSyncProfileGoogleStateProps = ReturnType<typeof mapStateToProps>;
type ControlsSyncProfileGoogleDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsSyncProfileGoogleStateProps,
  ControlsSyncProfileGoogleDispatchProps,
  Empty,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsSyncProfileGoogleProps = ConnectedProps<typeof connector>;

const _ControlsSyncProfileGoogle: FunctionComponent<ControlsSyncProfileGoogleProps> = ({
  googleAuthProfile,
}) => {
  const classes = useStyles();

  const onClickSignout = () => {
    console.log('[GOOGLE] Signing out...');
    attemptGoogleSignOut();
  };

  // Don't display if not logged in.
  if (googleAuthProfile == null) return null;

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" flexDirection="row">
        <Avatar alt={googleAuthProfile.name} src={googleAuthProfile.imageUrl} />
        <Box display="flex" className={classes.profileWelcome} flexDirection="column">
          <Typography variant="h5">
            {f('welcome-format', { user: googleAuthProfile.givenName })}
          </Typography>
          <Typography variant="subtitle2">{googleAuthProfile.email}</Typography>
        </Box>
      </Box>

      <Box display="flex" flexDirection="row">
        <Typography className={classes.centerVertical} variant="body2">
          {t('google-login-success')}
        </Typography>
        <Tooltip title={t('sign-out')}>
          <IconButton className={classes.logoutButton} onClick={onClickSignout}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

const ControlsSyncProfileGoogle = connector(_ControlsSyncProfileGoogle);

export default ControlsSyncProfileGoogle;
