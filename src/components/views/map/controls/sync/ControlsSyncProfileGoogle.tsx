import { Avatar, Box, IconButton, Typography, Tooltip, makeStyles } from '@material-ui/core';
import LogoutIcon from '@material-ui/icons/ExitToApp';

import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { attemptGoogleSignOut } from 'src/components/api/google';
import { f, t } from 'src/components/i18n/Localization';
import { selectGoogleProfile } from 'src/components/redux/slices/map/auth/Selector';
import { AppState } from 'src/components/redux/Types';
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
  googleAuthProfile: selectGoogleProfile(state),
});
type ControlsSyncProfileGoogleStateProps = ReturnType<typeof mapStateToProps>;
const connector = connect<ControlsSyncProfileGoogleStateProps, Empty, Empty, AppState>(
  mapStateToProps
);

type ControlsSyncProfileGoogleProps = ConnectedProps<typeof connector>;

const _ControlsSyncProfileGoogle: FunctionComponent<ControlsSyncProfileGoogleProps> = ({
  googleAuthProfile,
}) => {
  const classes = useStyles();

  // Don't display if not logged in.
  if (googleAuthProfile == null) return null;

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" flexDirection="row">
        <Avatar alt={googleAuthProfile.name} src={googleAuthProfile.imageUrl} />
        <Box display="flex" className={classes.profileWelcome} flexDirection="column">
          <Typography variant="h5">
            {f('map-ui:welcome-format', { user: googleAuthProfile.givenName })}
          </Typography>
          <Typography variant="subtitle2">{googleAuthProfile.email}</Typography>
        </Box>
      </Box>

      <Box display="flex" flexDirection="row">
        <Typography className={classes.centerVertical} variant="body2">
          {t('map-ui:google-login-success')}
        </Typography>
        <Tooltip title={t('core:sign-out')}>
          <IconButton className={classes.logoutButton} onClick={attemptGoogleSignOut}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

const ControlsSyncProfileGoogle = connector(_ControlsSyncProfileGoogle);

export default ControlsSyncProfileGoogle;
