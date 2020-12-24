/**
 * Provides the interface for the Map controls on the right side.
 */

import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';

import { t } from '~/components/i18n/Localization';
import { Image, useImageExtension } from '~/components/interface/Image';
import { isSmallScreen } from '~/components/interface/MediaQuery';
import { SafeHTML } from '~/components/Util';
import MapControlsAbout from '~/components/views/controls/about/MapControlsAbout';
import MapControlsCategories from '~/components/views/controls/features/MapControlsCategories';
import MapControlsEditor from '~/components/views/controls/editor/MapControlsEditor';
import MapControlsFeatures from '~/components/views/controls/features/MapControlsFeatures';
import MapControlsRoutes from '~/components/views/controls/features/MapControlsRoutes';
import MapControlsTabs from '~/components/views/controls/MapControlsTabs';
import MapControlsFoldButton from '~/components/views/controls/options/MapControlsFoldButton';
import MapControlsNavigationSmall from '~/components/views/controls/options/MapControlsNavigationSmall';
import MapControlsOptions from '~/components/views/controls/options/MapControlsOptions';
import MapControlsRegions from '~/components/views/controls/options/MapControlsRegions';
import logoPNG from '~/images/controls/logo.png';
import logoWebP from '~/images/controls/logo.webp';

import './MapControls.css';

const useStyles = makeStyles((_theme) => ({
  wrapper: {
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 100,

    // This prevents a bug where you couldn't click behind the drawer
    // when it was closed.
    pointerEvents: 'none',
  },
}));

const _MapControls = ({ open }) => {
  const classes = useStyles();

  const ext = useImageExtension();
  const small = isSmallScreen();

  return (
    <div className={classes.wrapper}>
      <div
        className={clsx(
          'map-controls-main',
          `map-controls-main-${ext}`,
          open ? 'map-controls-main-open' : 'map-controls-main-closed'
        )}
      >
        <MapControlsFoldButton />
        <MapControlsRegions />

        <div className={clsx('map-control-header')}>
          <Image srcPNG={logoPNG} srcWebP={logoWebP} className={clsx('map-controls-fold-small')} />
          <SafeHTML className={clsx('map-control-header-text')}>
            {t('meta-page-title-short')}
          </SafeHTML>
        </div>

        {small ? <MapControlsNavigationSmall /> : null}

        <MapControlsTabs />

        <MapControlsAbout />

        <MapControlsCategories />

        <MapControlsFeatures />

        <MapControlsRoutes />

        <MapControlsEditor />

        <MapControlsOptions />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  open: state.controlsOpen,
});
const mapDispatchToProps = (_dispatch) => ({});
const MapControls = connect(mapStateToProps, mapDispatchToProps)(_MapControls);

export default MapControls;
