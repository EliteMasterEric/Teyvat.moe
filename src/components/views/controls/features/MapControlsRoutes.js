/**
 * Provides the interface for the Routes tab of the Map controls.
 */

import React from 'react';
import { connect } from 'react-redux';

import { getRouteKeysByFilter, sortByName } from '~/components/data/MapFeatures';
import BorderBox from '~/components/interface/BorderBox';
import MapControlsRouteButton from '~/components/views/controls/features/MapControlsRouteButton';

const _MapControlsRoutes = ({ currentRegion, currentCategory, displayed }) => {
  return (
    <BorderBox displayed={displayed} overflow="hidden auto">
      {sortByName(getRouteKeysByFilter(currentRegion, currentCategory)).map((key) => (
        <MapControlsRouteButton key={key} routeKey={key} />
      ))}
    </BorderBox>
  );
};

const mapStateToProps = (state) => ({
  displayed: state.controlsTab === 'routes',
  currentCategory: state.controlsCategory,
  currentRegion: state.controlsRegion,
});
const mapDispatchToProps = (_dispatch) => ({});
const MapControlsRoutes = connect(mapStateToProps, mapDispatchToProps)(_MapControlsRoutes);

export default MapControlsRoutes;
