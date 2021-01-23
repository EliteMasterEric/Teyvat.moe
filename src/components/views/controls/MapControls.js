/**
 * Provides the interface for the Map controls on the right side.
 */

import { Box, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';

import { t } from '~/components/i18n/Localization';
import BorderBox from '~/components/interface/BorderBox';
import { Image, useImageExtension } from '~/components/interface/Image';
import { isSmallScreen } from '~/components/interface/MediaQuery';
import { SafeHTML } from '~/components/Util';
import MapControlsHelp from '~/components/views/controls/help/MapControlsHelp';
import MapControlsHelpEditor from '~/components/views/controls/help/MapControlsHelpEditor';
import MapControlsSummary from '~/components/views/controls/summary/MapControlsSummary';
import MapControlsCategories from '~/components/views/controls/features/MapControlsCategories';
import MapControlsEditor from '~/components/views/controls/editor/MapControlsEditor';
import MapControlsFeatures from '~/components/views/controls/features/MapControlsFeatures';
import MapControlsRoutes from '~/components/views/controls/features/MapControlsRoutes';
import MapControlsTabs from '~/components/views/controls/MapControlsTabs';
import MapControlsNavigationSmall from '~/components/views/controls/options/MapControlsNavigationSmall';
import MapControlsOptions from '~/components/views/controls/options/MapControlsOptions';
import MapControlsFoldButton from '~/components/views/controls/sidebar/MapControlsFoldButton';
import MapControlsRegions from '~/components/views/controls/sidebar/MapControlsRegions';
import logoPNG from '~/images/controls/logo.png';
import logoWebP from '~/images/controls/logo.webp';

const CONTROL_BOX_IMAGE_PNG = require('../../../images/controls/control_border.png').default;
const CONTROL_BOX_IMAGE_WEBP = require('../../../images/controls/control_border.webp').default;

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
    width: 40,
    height: 40,
    margin: '0 8px 0 0',
  },
}));

const _MapControls = ({ open }) => {
  const ext = useImageExtension();

  const borderBox = ext === 'webp' ? CONTROL_BOX_IMAGE_WEBP : CONTROL_BOX_IMAGE_PNG;

  const classes = useStyles({});

  const small = isSmallScreen();

  return (
    <Box className={classes.wrapper}>
      <BorderBox
        image={borderBox}
        className={clsx(
          classes.main,
          small ? classes.mainSmall : null,
          open ? classes.mainOpen : classes.mainClosed
        )}
      >
        <MapControlsFoldButton />
        <MapControlsRegions shouldDisplay={!small} />

        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
          <Image srcPNG={logoPNG} srcWebP={logoWebP} className={classes.logo} />
          <SafeHTML className={classes.headerText}>{t('meta-page-title-short')}</SafeHTML>
        </Box>

        {small ? <MapControlsNavigationSmall /> : null}

        <MapControlsTabs />

        <MapControlsHelp />

        <MapControlsHelpEditor />

        <MapControlsSummary />

        <MapControlsCategories />

        <MapControlsFeatures />

        <MapControlsRoutes />

        <MapControlsEditor />

        <MapControlsOptions />
      </BorderBox>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  open: state.controlsOpen,
});
const mapDispatchToProps = (_dispatch) => ({});
const MapControls = connect(mapStateToProps, mapDispatchToProps)(_MapControls);

export default MapControls;
