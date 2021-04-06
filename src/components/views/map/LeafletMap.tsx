/**
 * Provides the core view which displays the Leaflet map,
 * along with region labels, world border, editor data, and feature and map data.
 */

import { makeStyles } from '@material-ui/core';
import { CRS } from 'leaflet';
import 'leaflet-editable';
import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { MapContainer, ZoomControl } from 'react-leaflet';

import { DEFAULT_ZOOM, MAP_CENTER } from 'src/components/data/MapConstants';
import { getMapFeature, getMapFeatureKeys } from 'src/components/data/MapFeatures';
import { getMapRouteGroup, getMapRouteGroupKeys } from 'src/components/data/MapRoutes';
import ErrorHandler, { ErrorHandlerComponent } from 'src/components/views/error/ErrorHandler';
import DebugControls from 'src/components/views/map/DebugControls';
import { MAP_BOUNDS, MAXIMUM_ZOOM, MINIMUM_ZOOM } from 'src/components/views/map/LayerConstants';
import EditorLayer from 'src/components/views/map/layers/EditorLayer';
import FeatureLayer from 'src/components/views/map/layers/FeatureLayer';
import RegionLabelLayer from 'src/components/views/map/layers/RegionLabelLayer';
import RouteLayer from 'src/components/views/map/layers/RouteLayer';
import TileLayer from 'src/components/views/map/layers/TileLayer';
import WorldBorderLayer from 'src/components/views/map/layers/WorldBorderLayer';
import MapEditorHandler from 'src/components/views/map/MapEditorHandler';
import MapPositionHandler from 'src/components/views/map/MapPositionHandler';
import { setLoadingTiles } from 'src/components/redux/dispatch';

const useStyles = makeStyles((_theme) => ({
  main: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 0,
  },
}));

const ErrorLayer: ErrorHandlerComponent = ({ error, errorInfo: _errorInfo }) => {
  return <div>{error?.name ?? 'NO ERROR DATA'}</div>;
};

const LeafletMap: FunctionComponent = ({}) => {
  const classes = useStyles();

  const onTileLayerLoaded = () => {
    setLoadingTiles(true);
  };

  return (
    <MapContainer
      className={classes.main}
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
      <TileLayer onLoaded={onTileLayerLoaded} />

      <RegionLabelLayer />
      <WorldBorderLayer />
      <EditorLayer />

      {/* Controls the zoom buttons in the top left corner. */}
      <ZoomControl zoomInTitle="+" zoomOutTitle="-" />
      <DebugControls />

      {/* Display each visible feature. */}
      {getMapFeatureKeys().map((key) => {
        const feature = getMapFeature(key);
        if (!feature) {
          console.error(`ERROR: Feature '${key}' is not defined.`);
          return null;
        }

        return (
          <ErrorHandler key={`feature:${key}`} errorHandler={ErrorLayer}>
            <FeatureLayer mapFeature={feature} featureKey={key} />
          </ErrorHandler>
        );
      })}

      {/* Display each visible route. */}
      {getMapRouteGroupKeys().map((key) => {
        const route = getMapRouteGroup(key);
        if (!route) {
          console.error(`ERROR: Route '${key}' is not defined.`);
          return null;
        }

        return (
          <ErrorHandler key={`route:${key}`} errorHandler={ErrorLayer}>
            <RouteLayer routeKey={key} routeGroup={route} />
          </ErrorHandler>
        );
      })}
    </MapContainer>
  );
};

export default LeafletMap;
