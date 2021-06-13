/**
 * Provides the core view which displays the Leaflet map,
 * along with region labels, world border, editor data, and feature and map data.
 */

import { makeStyles } from '@material-ui/styles';
import { CRS } from 'leaflet';
import 'leaflet-editable';
import _ from 'lodash';
import React, { FunctionComponent, useCallback } from 'react';
import { MapContainer, ZoomControl } from 'react-leaflet';

import { DEFAULT_ZOOM, MAP_CENTER } from 'src/components/data/map/MapConstants';
import { getMapFeature, getMapFeatureKeys } from 'src/components/data/map/MapFeatures';
import { getMapRouteGroup, getMapRouteGroupKeys } from 'src/components/data/map/MapRoutes';
import { dispatchSetLoading } from 'src/components/redux/slices/map/loading/Dispatch';
import ErrorHandler, { ErrorHandlerComponent } from 'src/components/views/error/ErrorHandler';
import DebugControls from 'src/components/views/map/leaflet/DebugControls';
import {
  MAP_BOUNDS,
  MAXIMUM_ZOOM,
  MINIMUM_ZOOM,
} from 'src/components/views/map/leaflet/LayerConstants';
import EditorLayer from 'src/components/views/map/leaflet/layers/EditorLayer';
import FeatureLayer from 'src/components/views/map/leaflet/layers/FeatureLayer';
import RegionLabelLayer from 'src/components/views/map/leaflet/layers/RegionLabelLayer';
import RouteLayer from 'src/components/views/map/leaflet/layers/RouteLayer';
import TileLayer from 'src/components/views/map/leaflet/layers/TileLayer';
import WorldBorderLayer from 'src/components/views/map/leaflet/layers/WorldBorderLayer';
import MapEditorHandler from 'src/components/views/map/leaflet/MapEditorHandler';
import MapPositionHandler from 'src/components/views/map/leaflet/MapPositionHandler';

const useStyles = makeStyles((_theme) => ({
  main: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 0,
    // backgroundColor: '#2c6973',
    backgroundColor: '#121621',
  },
}));

const ErrorLayer: ErrorHandlerComponent = ({ error, errorInfo: _errorInfo }) => {
  return <div>{error?.name ?? 'NO ERROR DATA'}</div>;
};

const LeafletMap: FunctionComponent = () => {
  const classes = useStyles();

  const onTileLayerLoadStart = useCallback(() => {
    dispatchSetLoading('loadLeafletTiles', 'progress');
  }, []);

  const onTileLayerLoadError = useCallback(() => {
    dispatchSetLoading('loadLeafletTiles', 'error');
  }, []);

  const onTileLayerLoadSuccess = useCallback(() => {
    dispatchSetLoading('loadLeafletTiles', true);
  }, []);

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
      <TileLayer
        onLoadSuccess={onTileLayerLoadSuccess}
        onLoadStart={onTileLayerLoadStart}
        onLoadError={onTileLayerLoadError}
      />

      <RegionLabelLayer />
      {/* <WorldBorderLayer /> */}
      <EditorLayer />

      {/* Controls the zoom buttons in the top left corner. */}
      <ZoomControl zoomInTitle="+" zoomOutTitle="-" />
      <DebugControls />

      {/* Display each visible feature. */}
      {_.map(getMapFeatureKeys(), (key) => {
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
      {_.map(getMapRouteGroupKeys(), (key) => {
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
