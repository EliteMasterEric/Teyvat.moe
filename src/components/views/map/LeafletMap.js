/**
 * Provides the core view which displays the Leaflet map,
 * along with region labels, world border, editor data, and feature and map data.
 */

import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { AttributionControl, MapContainer, TileLayer } from 'react-leaflet';

import { MapFeatures, MapRoutes } from '~/components/data/MapFeatures';
import { useImageExtension } from '~/components/interface/Image';
import {
  DEFAULT_ZOOM,
  MAP_BOUNDS,
  MAP_CENTER,
  MAXIMUM_ZOOM,
  MAXIMUM_NATIVE_ZOOM,
  MINIMUM_ZOOM,
  TILE_URL,
} from '~/components/preferences/DefaultPreferences';
import EditorLayer from '~/components/views/map/EditorLayer';
import FeatureLayer from '~/components/views/map/FeatureLayer';
import MapEditorHandler from '~/components/views/map/MapEditorHandler';
import MapPositionHandler from '~/components/views/map/MapPositionHandler';
import RegionLabelLayer from '~/components/views/map/RegionLabelLayer';
import RouteLayer from '~/components/views/map/RouteLayer';
import WorldBorderLayer from '~/components/views/map/WorldBorderLayer';

import './LeafletMap.css';

// A link back to the main repository.
const ATTRIBUTION =
  "<a href='https://github.com/GenshinMap/genshinmap.github.io' rel='noreferrer' target='_blank'><span class='nf nf-fa-github' style='margin-right: 0.5em;'></span>Directions and Feedback</a>";

const _LeafletMap = () => {
  // Check for WebP support.
  const ext = useImageExtension(true);

  // Wait until we get confirmation of WebP support.
  if (ext == null) return null;

  const tileUrl = TILE_URL.replace('{ext}', ext);

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
      <TileLayer
        url={tileUrl}
        noWrap
        bounds={MAP_BOUNDS}
        errorTileUrl={`tiles/blank.${ext}`}
        maxZoom={MAXIMUM_ZOOM}
        minZoom={MINIMUM_ZOOM}
        maxNativeZoom={MAXIMUM_NATIVE_ZOOM}
        minNativeZoom={MINIMUM_ZOOM}
      />
      {/* Controls the attribution link in the bottom left corner. */}
      <AttributionControl prefix={ATTRIBUTION} position="bottomleft" />

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
