/**
 * Provides the core view which displays the Leaflet map,
 * along with region labels, world border, editor data, and feature and map data.
 */

import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import { MapFeatures, MapRoutes } from '~/components/data/MapFeatures';
import EditorLayer from '~/components/views/map/EditorLayer';
import FeatureLayer from '~/components/views/map/FeatureLayer';
import MapEditor from '~/components/views/map/MapEditor';
import RegionLabelLayer from '~/components/views/map/RegionLabelLayer';
import RouteLayer from '~/components/views/map/RouteLayer';
import WorldBorderLayer from '~/components/views/map/WorldBorderLayer';

import './LeafletMap.css';

const _LeafletMap = () => {
  // Reference to the map.
  const editRef = React.useRef(null);

  return (
    <MapEditor ref={editRef}>
      <RegionLabelLayer />
      <WorldBorderLayer />
      <EditorLayer />

      {_.keys(MapFeatures).map((key) => {
        const feature = MapFeatures[key];
        if (!feature) {
          console.error(`ERROR: Feature '${key}' is not defined.`);
          return null;
        }

        return <FeatureLayer key={`Feature:${key}`} mapFeature={feature} featureKey={key} />;
      })}

      {_.keys(MapRoutes).map((key) => {
        const route = MapRoutes[key];
        if (!route) {
          console.error(`ERROR: Route '${key}' is not defined.`);
          return null;
        }

        return <RouteLayer key={`Route:${key}`} routeKey={key} mapRoute={route} />;
      })}
    </MapEditor>
  );
};

const mapStateToProps = (state, { mapFeature, featureKey }) => ({
  clusterMarkers: state.options.clusterMarkers && (mapFeature?.cluster ?? false),
  completedIds: state.completed.features[featureKey],
  completedAlpha: state.options.completedAlpha,
});
const mapDispatchToProps = (_dispatch) => ({});
const LeafletMap = connect(mapStateToProps, mapDispatchToProps)(_LeafletMap);

export default LeafletMap;
