import React from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import { connect } from 'react-redux';

import { MapRegions } from '../../MapFeatures';
import MapControlsRegionButton from './MapControlsRegionButton';

import './MapControlsRegions.css';

const _MapControlsRegions = ({ displayed }) => {
  return (
    <div
      className={clsx(
        'map-control-regions',
        displayed ? 'map-control-regions-on' : 'map-control-regions-off'
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
});
const mapDispatchToProps = (_dispatch) => ({});
const MapControlsRegions = connect(mapStateToProps, mapDispatchToProps)(_MapControlsRegions);

export default MapControlsRegions;
