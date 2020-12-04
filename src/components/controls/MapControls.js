import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';

import MapControlsAbout from './about/MapControlsAbout';
import MapControlsCategories from './features/MapControlsCategories';
import MapControlsEditor from './elements/MapControlsEditor';
import MapControlsFeatures from './features/MapControlsFeatures';
import MapControlsFoldButton from './options/MapControlsFoldButton';
import MapControlsOptions from './options/MapControlsOptions';
import MapControlsRegions from './options/MapControlsRegions';
import MapControlsRoutes from './features/MapControlsRoutes';

import { Image, useImageExtension } from '../Image';

import logoPNG from '../../images/controls/logo.png';
import logoWebP from '../../images/controls/logo.webp';

// CSS
import './MapControls.css';
import MapControlsTabs from './MapControlsTabs';
import { SafeHTML } from '../Util';
import { t } from '../Localization';
import { isSmallScreen } from '../MediaQuery';
import MapControlsNavigationSmall from './options/MapControlsNavigationSmall';

const MapControlsChildren = () => {
  const small = isSmallScreen();

  return (
    <>
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
    </>
  );
};

const _MapControls = ({ open }) => {
  const ext = useImageExtension();

  return (
    <div className={clsx('map-controls-wrapper')}>
      <div
        className={clsx(
          'map-controls-main',
          `map-controls-main-${ext}`,
          open ? 'map-controls-main-open' : 'map-controls-main-closed'
        )}
      >
        <MapControlsChildren />
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
