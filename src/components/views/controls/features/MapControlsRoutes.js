/**
 * Provides the interface for the Routes tab of the Map controls.
 */

import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';

import { getRouteKeysByFilter, MapRoutes } from '~/components/data/MapFeatures';
import { useImageExtension } from '~/components/interface/Image';
import MapControlsRouteButton from '~/components/views/controls/features/MapControlsRouteButton';

import './MapControlsRoutes.css';

const _MapControlsRoutes = ({ currentRegion, currentCategory, displayed }) => {
  const ext = useImageExtension();

  return (
    <div
      className={clsx(
        'map-controls-routes-box',
        `map-controls-routes-box-${ext}`,
        displayed ? '' : 'display-none'
      )}
    >
      {getRouteKeysByFilter(currentRegion, currentCategory)
        .sort((a, b) => {
          const textA = MapRoutes[a].name;
          const textB = MapRoutes[b].name;

          if (textA < textB) return -1;
          return textA > textB ? 1 : 0;
        })
        .map((key) => (
          <MapControlsRouteButton key={key} routeKey={key} />
        ))}
    </div>
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
