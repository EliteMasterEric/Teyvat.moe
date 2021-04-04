/**
 * Provides the interface for the Map controls on the right side.
 */

import { Box, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { t } from 'src/components/i18n/Localization';
import BorderBox from 'src/components/interface/BorderBox';
import { getNextImageUrl, NextImage } from 'src/components/interface/Image';
import { useSmallScreen } from 'src/components/interface/MediaHooks';
import { selectOpen } from 'src/components/redux/slices/ui';
import { AppState } from 'src/components/redux/types';
import { Empty } from 'src/components/Types';
import { isDev, SafeHTML } from 'src/components/util';
import ControlsNavigationSmall from 'src/components/views/controls/ControlsNavigationMobile';
import ControlsTabs from 'src/components/views/controls/ControlsTabs';
import ControlsTabEditor from 'src/components/views/controls/editor/ControlsTabEditor';
import ControlsTabCategories from 'src/components/views/controls/features/ControlsCategories';
import ControlsTabFeatures from 'src/components/views/controls/features/ControlsTabFeatures';
import ControlsTabRoutes from 'src/components/views/controls/features/ControlsTabRoutes';
import ControlsTabHelp from 'src/components/views/controls/help/ControlsTabHelp';
import ControlsTabHelpEditor from 'src/components/views/controls/help/ControlsTabHelpEditor';
import ControlsTabOptions from 'src/components/views/controls/options/ControlsTabOptions';
import ControlsFoldButton from 'src/components/views/controls/sidebar/ControlsFoldButton';
import ControlsRegions from 'src/components/views/controls/sidebar/ControlsRegions';
import ControlsTabSummary from 'src/components/views/controls/summary/ControlsTabSummary';
import ControlsTabSync from 'src/components/views/controls/sync/ControlsTabSync';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 100,

    // This prevents a bug where you couldn't click behind the drawer
    // when it was closed.
    pointerEvents: 'none',
  },

  main: {
    /* Position and size the element */
    position: 'relative',
    top: 0,

    minHeight: '680px' /* Needed to fit region tabs. */,
    height: '90vh',
    maxHeight: '1000px',

    margin: '12px 12px 12px 12px',
    padding: '12px 0 0 12px',

    backgroundClip: 'padding-box',
    pointerEvents: 'auto',
    overflow: 'hidden auto',
    backgroundColor: '#f0e9e2',

    [theme.breakpoints.down('sm')]: {
      // Full width, plus a bit off the edge.
      width: '105vw',
    },
    [theme.breakpoints.up('sm')]: {
      width: '60vw',
    },
    [theme.breakpoints.up('md')]: {
      width: '40vw',
    },
    [theme.breakpoints.up('lg')]: {
      width: '30vw',
    },
    [theme.breakpoints.up('xl')]: {
      width: '20vw',
    },
  },

  mainClosed: {
    right: 'calc(-1 * 92.5%)',

    /* Set the speed of this animation. */
    '-webkit-transition': 'all 0.4s',
    '-moz-transition': 'all 0.4s',
    '-o-transition': 'all 0.4s',
    transition: 'all 0.4s',
  },

  mainOpen: {
    right: 'calc(-1 * 5%)',

    /* Set the speed of this animation. */
    '-webkit-transition': 'all 0.4s',
    '-moz-transition': 'all 0.4s',
    '-o-transition': 'all 0.4s',
    transition: 'all 0.4s',
  },

  mainSmall: {
    width: '105vw',
  },

  headerText: {
    fontSize: '24px',
    margin: '0 0 0 12px',
  },

  logo: {
    margin: '0 8px 0 0',
  },
}));

const mapStateToProps = (state: AppState) => ({
  open: selectOpen(state),
});
const mapDispatchToProps = () => ({});
type ControlsStateProps = ReturnType<typeof mapStateToProps>;
type ControlsDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<ControlsStateProps, ControlsDispatchProps, Empty, AppState>(
  mapStateToProps,
  mapDispatchToProps
);

type ControlsProps = ConnectedProps<typeof connector>;

const _Controls: FunctionComponent<ControlsProps> = ({ open }) => {
  const classes = useStyles();

  const small = useSmallScreen();

  return (
    <Box className={classes.wrapper}>
      <BorderBox
        src={getNextImageUrl('/images/controls/control_border.png', 96, 96)}
        className={clsx(
          classes.main,
          small ? classes.mainSmall : null,
          open ? classes.mainOpen : classes.mainClosed
        )}
      >
        <ControlsFoldButton />
        <ControlsRegions shouldDisplay={!small} />

        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
          <NextImage
            src="/images/logo.png"
            className={classes.logo}
            width={40}
            height={40}
            priority
          />
          <SafeHTML className={classes.headerText}>
            {isDev() ? t('page-title-beta') : t('page-title')}
          </SafeHTML>
        </Box>

        {small ? <ControlsNavigationSmall /> : null}

        <ControlsTabs />

        <ControlsTabHelp />

        <ControlsTabHelpEditor />

        <ControlsTabSummary />

        <ControlsTabCategories />

        <ControlsTabFeatures />

        <ControlsTabRoutes />

        <ControlsTabEditor />

        <ControlsTabSync />

        <ControlsTabOptions />
      </BorderBox>
    </Box>
  );
};

const Controls = connector(_Controls);

export default Controls;
