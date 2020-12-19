/**
 * Provides the region buttons which swap the current region
 * of the Features and Routes tabs, on the side of the Map controls.
 */

import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';

import { MapRegions } from '~/components/data/MapFeatures';
import { t } from '~/components/i18n/Localization';
import { setControlsRegion } from '~/redux/ducks/ui';

import './MapControlsRegionButton.css';

const controlsContext = require.context('../../../../images/controls', true);

const _MapControlsRegionButton = ({ regionKey, active, enableRegion, small = false }) => {
  const region = MapRegions[regionKey];

  return (
    <div
      onClick={enableRegion}
      onKeyDown={() => {}}
      role="button"
      aria-label={t(region?.nameKey)}
      tabIndex={0}
      className={clsx(
        'map-control-region',
        active ? 'map-control-region-active' : '',
        small ? 'map-controls-region-small' : ''
      )}
    >
      <img
        alt={t(region?.nameKey)}
        className={clsx(small ? 'map-control-region-img-small' : 'map-control-region-img')}
        src={
          controlsContext(`./${regionKey}-${active ? 'on' : 'off'}${small ? '-small' : ''}.png`)
            .default
        }
      />
    </div>
  );
};

const mapStateToProps = (state, { regionKey }) => ({
  active: state.controlsRegion === regionKey,
});
const mapDispatchToProps = (dispatch, { regionKey }) => ({
  enableRegion: () => dispatch(setControlsRegion(regionKey)),
});
const MapControlsRegionButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(_MapControlsRegionButton);

export default MapControlsRegionButton;
