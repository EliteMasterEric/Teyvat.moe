import { LinearProgress, Typography, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { f, t } from 'src/components/i18n/Localization';
import { NextImage } from 'src/components/interface/Image';
import { getApplicationVersion } from 'src/components/util';

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: theme.palette.primary.dark,
    width: '100%',
    height: '100%',
    color: '#FFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  alwaysOnTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10000,
  },

  loadingHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingFooter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    margin: '0 8px 0 0',
  },

  progress: {
    marginTop: theme.spacing(2),
    width: '100%',
  },

  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },
}));

interface FullScreenLoadingProps {
  displayed?: boolean;
}

const FullScreenLoading: FunctionComponent<FullScreenLoadingProps> = ({ displayed = true }) => {
  const classes = useStyles();

  if (!displayed) return null;

  return (
    <div className={clsx(classes.background, classes.alwaysOnTop)}>
      <div className={classes.loadingHeader} />
      <div className={classes.loadingBody}>
        {/* Use a bare PNG image. No weird WEBP handling should prevent rendering this. */}
        <NextImage
          priority
          src={'/images/logo.png'}
          width={80}
          height={80}
          className={classes.logo}
          alt="GenshinMap"
        />
        <Typography variant="h3">{t('loading')}</Typography>
        <LinearProgress className={classes.progress} />
      </div>
      <div className={classes.loadingFooter}>
        <Typography className={classes.subtitle}>
          {f('version-format', { version: getApplicationVersion() })}
        </Typography>
      </div>
    </div>
  );
};

export default FullScreenLoading;
