/**
 * Provides the core view which displays the Leaflet map,
 * along with region labels, world border, editor data, and feature and map data.
 */

import { CRS } from 'leaflet';
import 'leaflet-editable';
import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { MapContainer, ZoomControl } from 'react-leaflet';

import { MapFeatureKeys, MapFeatures } from '~/components/data/MapFeatures';
import { MapRouteGroups, MapRouteKeys as MapRouteGroupKeys } from '~/components/data/MapRoutes';
import ErrorHandler from '~/components/views/error/ErrorHandler';
import DebugControls from '~/components/views/map/DebugControls';
import {
  DEFAULT_ZOOM,
  MAP_BOUNDS,
  MAP_CENTER,
  MAXIMUM_ZOOM,
  MINIMUM_ZOOM,
} from '~/components/views/map/LayerConstants';
import EditorLayer from '~/components/views/map/layers/EditorLayer';
import FeatureLayer from '~/components/views/map/layers/FeatureLayer';
import RegionLabelLayer from '~/components/views/map/layers/RegionLabelLayer';
import RouteLayer from '~/components/views/map/layers/RouteLayer';
import TileLayer from '~/components/views/map/layers/TileLayer';
import WorldBorderLayer from '~/components/views/map/layers/WorldBorderLayer';
import MapEditorHandler from '~/components/views/map/MapEditorHandler';
import MapPositionHandler from '~/components/views/map/MapPositionHandler';

import '~/components/views/map/LeafletMap.css';

const ErrorLayer = ({ error, errorInfo: _errorInfo }) => {
  return <div key={error} />;
};

const LeafletMap: FunctionComponent = () => {
  return (
    <MapContainer
      maxBounds={MAP_BOUNDS}
      center={MAP_CENTER}
      zoom={DEFAULT_ZOOM}
      zoomDelta={0.5}
      editable
      crs={CRS.Simple}
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

      <RegionLabelLayer />
      <WorldBorderLayer />
      <EditorLayer />

      {/* Controls the zoom buttons in the top left corner. */}
      <ZoomControl zoomInTitle="+" zoomOutTitle="-" />
      <DebugControls />

      {/* Display each available feature. */}
      {MapFeatureKeys.map((key) => {
        const feature = MapFeatures[key];
        if (!feature) {
          console.error(`ERROR: Feature '${key}' is not defined.`);
          return null;
        }

        return (
          <ErrorHandler key={`Feature:${key}`} errorHandler={ErrorLayer}>
            <FeatureLayer mapFeature={feature} featureKey={key} />
          </ErrorHandler>
        );
      })}

      {/* Display each available route. */}
      {MapRouteGroupKeys.map((key) => {
        const route = MapRouteGroups[key];
        if (!route) {
          console.error(`ERROR: Route '${key}' is not defined.`);
          return null;
        }

        return (
          <ErrorHandler key={`Route:${key}`} errorHandler={ErrorLayer}>
            <RouteLayer routeKey={key} routeGroup={route} />
          </ErrorHandler>
        );
      })}
    </MapContainer>
  );
};

export default LeafletMap;
