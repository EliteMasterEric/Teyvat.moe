import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import { MapFeatures, MapRoutes } from '../MapFeatures';
import FeatureLayer from './FeatureLayer';
import RouteLayer from './RouteLayer';
import EditorLayer from './EditorLayer';
import WorldBorderLayer from './WorldBorderLayer';
import RegionLabelLayer from './RegionLabelLayer';
import MapEditor from './MapEditor';

import './LeafletMap.css';

const _LeafletMap = () => {
  // Reference to the map.
  const mapRef = React.useRef(null);
  const editRef = React.useRef(null);

  return (
    <MapEditor ref={editRef} mapRef={mapRef}>
      <RegionLabelLayer mapRef={mapRef} />
      <WorldBorderLayer mapRef={mapRef} />
      <EditorLayer mapRef={mapRef} />

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
