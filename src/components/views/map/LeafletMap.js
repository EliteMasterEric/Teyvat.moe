/**
 * Provides the core view which displays the Leaflet map,
 * along with region labels, world border, editor data, and feature and map data.
 */

import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { AttributionControl, MapContainer, ZoomControl } from 'react-leaflet';

import { MapFeatures, MapRoutes } from '~/components/data/MapFeatures';

import {
  DEFAULT_ZOOM,
  MAP_BOUNDS,
  MAP_CENTER,
  MAXIMUM_ZOOM,
  MINIMUM_ZOOM,
} from '~/components/preferences/DefaultPreferences';
import EditorLayer from '~/components/views/map/layers/EditorLayer';
import FeatureLayer from '~/components/views/map/layers/FeatureLayer';
import RegionLabelLayer from '~/components/views/map/layers/RegionLabelLayer';
import RouteLayer from '~/components/views/map/layers/RouteLayer';
import TileLayer from '~/components/views/map/layers/TileLayer';
import WorldBorderLayer from '~/components/views/map/layers/WorldBorderLayer';
import MapEditorHandler from '~/components/views/map/MapEditorHandler';
import MapPositionHandler from '~/components/views/map/MapPositionHandler';

import './LeafletMap.css';

// A link back to the main repository.
const ATTRIBUTION =
  "<a href='https://github.com/GenshinMap/genshinmap.github.io' rel='noreferrer' target='_blank'><span class='nf nf-fa-github' style='margin-right: 0.5em;'></span>Directions and Feedback</a>";

const _LeafletMap = () => {
  return (
    <MapContainer
      maxBounds={MAP_BOUNDS}
      center={MAP_CENTER}
      zoom={DEFAULT_ZOOM}
      zoomDelta={0.5}
      editable
      zoomSnap={0.5}
      maxZoom={MAXIMUM_ZOOM}
      minZoom={MINIMUM_ZOOM}
      attributionControl={false} // Override the Leaflet attribution with our own AttributionControl.
      zoomControl={false}
    >
      {/* Handles events related to the map position. */}
      <MapPositionHandler />
      {/* Handles events related to the map editing, and renders the editor controls.. */}
      <MapEditorHandler />
      {/* Controls the actual map image. */}
      <TileLayer />
      {/* Controls the attribution link in the bottom left corner. */}
      <AttributionControl prefix={ATTRIBUTION} position="bottomleft" />

      <RegionLabelLayer />
      <WorldBorderLayer />
      <EditorLayer />

      {/* Controls the zoom buttons in the top left corner. */}
      <ZoomControl zoomInTitle="+" zoomOutTitle="-" />

      {/* Display each available feature. */}
      {_.keys(MapFeatures).map((key) => {
        const feature = MapFeatures[key];
        if (!feature) {
          console.error(`ERROR: Feature '${key}' is not defined.`);
          return null;
        }

        return <FeatureLayer key={`Feature:${key}`} mapFeature={feature} featureKey={key} />;
      })}

      {/* Display each available route. */}
      {_.keys(MapRoutes).map((key) => {
        const route = MapRoutes[key];
        if (!route) {
          console.error(`ERROR: Route '${key}' is not defined.`);
          return null;
        }

        return <RouteLayer key={`Route:${key}`} routeKey={key} mapRoute={route} />;
      })}
    </MapContainer>
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
