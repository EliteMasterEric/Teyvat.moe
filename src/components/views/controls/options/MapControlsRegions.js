/**
 * Provides the container for the region buttons, on the side of the Map controls.
 */

import clsx from 'clsx';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import { MapRegions } from '~/components/data/MapFeatures';
import MapControlsRegionButton from '~/components/views/controls/options/MapControlsRegionButton';

import './MapControlsRegions.css';

const _MapControlsRegions = ({ displayed, open }) => {
  return (
    <div
      className={clsx(
        'map-control-regions',
        displayed ? 'map-control-regions-on' : 'map-control-regions-off',
        open ? null : 'map-controls-regions-closed'
      )}
    >
      {_.keys(MapRegions).map((key) =>
        MapRegions[key]?.enabled ? <MapControlsRegionButton key={key} regionKey={key} /> : null
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  displayed: state.controlsOpen && ['features', 'routes'].includes(state.controlsTab),
  open: state.controlsOpen,
});
const mapDispatchToProps = (_dispatch) => ({});
const MapControlsRegions = connect(mapStateToProps, mapDispatchToProps)(_MapControlsRegions);

export default MapControlsRegions;
