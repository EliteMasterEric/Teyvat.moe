import { Box, Fab, Link, makeStyles, Typography } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { NextImage } from './Image';
import { t } from 'src/components/i18n/Localization';

const useStyles = makeStyles((theme) => ({
  homeHeader: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    cursor: 'pointer',
    margin: '0 8px 0 0',
  },

  homeButton: {
    margin: theme.spacing(1),
  },
  homeButtonIcon: {
    marginRight: theme.spacing(1),
  },

  headerLeftContent: {
    marginRight: 'auto',
  },

  headerRightContent: {
    marginLeft: 'auto',
  },

  teyvatFont: {
    fontFamily: 'Teyvat',
  },

  pageTitleText: {
    whiteSpace: 'nowrap',
  },
}));

type HeaderProps = {
  pageTitle: string;
  showHomeButton?: boolean;
};

const Header: FunctionComponent<HeaderProps> = ({ pageTitle, showHomeButton = true }) => {
  const classes = useStyles();

  return (
    <div className={classes.homeHeader}>
      <Box display="flex" justifyContent="left" alignItems="center" width="100%">
        {/* Use a bare PNG image. No weird WEBP handling should prevent rendering this. */}
        <Box display="flex" flex={1}>
          <div className={classes.headerLeftContent}>
            {showHomeButton ? (
              <Link href="/">
                <Fab variant="extended" aria-label="home" className={classes.homeButton}>
                  <HomeIcon className={classes.homeButtonIcon} />
                  <Typography className={classes.teyvatFont}>{t('pages:page-home')}</Typography>
                </Fab>
              </Link>
            ) : null}
          </div>
        </Box>
        <Box
          display="flex"
          flex={1}
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          <NextImage
            src="/images/logo.png"
            className={classes.logo}
            width={80}
            height={80}
            priority
          />
          <Typography variant="h3" className={clsx(classes.teyvatFont, classes.pageTitleText)}>
            {pageTitle}
          </Typography>
        </Box>
        <Box display="flex" flex={1}>
          <div className={classes.headerRightContent} />
        </Box>
      </Box>
    </div>
  );
};

export default Header;
