import _ from 'lodash';
import React from 'react';

import L from 'leaflet';
import 'leaflet-editable'; // Its very presence changes the behavior of L.
import { AttributionControl, Map, TileLayer, ZoomControl } from 'react-leaflet';
import Control from 'react-leaflet-control';
import ReactLeafletEditable from 'react-leaflet-editable';

import clsx from 'clsx';
import { editorMarkerHighlight, lineProperties, lineTextProperties } from './MapLayer';
import { useImageExtension } from '../Image';

import './EditorMap.css';

// Center of the map.
export const MAP_CENTER = [-35, 45];

// Zoom levels.
export const MINIMUM_ZOOM = 3;
export const DEFAULT_ZOOM = 4;
export const MAXIMUM_ZOOM = 8;

// Format used to fetch the URL of a tile. z is the zoom level, x and y are the coordinates.
export const TILE_URL = 'tiles/Map_{z}_{x}_{y}.{ext}';

// Observable bounds of the map.
export const MAP_BOUNDS = L.latLngBounds([0, 0], [-66.5, 90]);

// A link back to the main repository.
const ATTRIBUTION =
  "<a href='https://github.com/GenshinMap/genshinmap.github.io' target='_blank'><span class='nf nf-fa-github' style='margin-right: 0.5em;'></span>Directions and Feedback</a>";

export const EditorControls = ({ startEditorMarker, startEditorRoute }) => {
  return (
    <Control position="topleft">
      <div className={clsx('map-editor-control-toolbar')}>
        <div
          onClick={startEditorMarker}
          onKeyDown={startEditorMarker}
          className={clsx(
            'map-editor-control-button-image',
            'map-editor-control-button-image-marker'
          )}
          role="button"
          aria-label="Create Marker"
          tabIndex={0}
        />
        <div
          role="button"
          tabIndex={0}
          onClick={startEditorRoute}
          onKeyDown={startEditorRoute}
          aria-label="Create Route"
          className={clsx(
            'map-editor-control-button-image',
            'map-editor-control-button-image-route'
          )}
        />
      </div>
    </Control>
  );
};

/**
 * A wrapper which handles editing events.
 * Much of the complexity here comes from the fact we aren't editing the map,
 * we are editing a GeoJSON representation of it.
 *
 * Thus, each element creation must be 'cancelled',
 * then replaced with addition to the GeoJSON data.
 */
const EditorMap = React.forwardRef(
  ({ mapRef, children, onClick, onChangeMapPos, setEditorData, editorEnabled }, editRef) => {
    // A separate state must be used because the type of currentEditable can't be determined
    // just by looking at it.
    const [editorState, setEditorState] = React.useState('none');
    const [currentEditable, setCurrentEditable] = React.useState(null);

    // Check for WebP support.
    const ext = useImageExtension(true);

    // Wait until we get confirmation of WebP support.
    if (ext == null) return null;

    const tileUrl = TILE_URL.replace('{ext}', ext);

    const startEditorMarker = () => {
      setEditorState('createMarker');
      const editable = editRef.current.startMarker(null, {
        icon: editorMarkerHighlight,
      });
      setCurrentEditable(editable);
    };

    const startEditorRoute = () => {
      setEditorState('createRoute');
      const editable = editRef.current.startPolyline(null, lineProperties);
      editable.setText('  ►  ', lineTextProperties);
      setCurrentEditable(editable);
    };

    const placeMarker = (editable) => {
      const { _latlng: latlng } = editable;

      // Note this is not reversed because it corresponds to direct map coordinates.
      const latlngFormatted = [latlng?.lat, latlng?.lng];

      // Append a new marker to the data.
      setEditorData((oldData) => {
        // Construct a new marker.
        const id = (oldData.length ?? 0) + 1;
        const marker = {
          id,
          geometry: { type: 'Point', coordinates: latlngFormatted },
          type: 'Feature',
          properties: { popupTitle: { en: '' }, popupContent: { en: '' }, popupImage: '' },
        };

        // Append the marker.
        const newData = oldData;
        newData.push(marker);
        return newData;
      });

      setEditorState('none');
      setCurrentEditable(null);
    };

    const placeRoute = (editable) => {
      const { _latlngs: latlngs } = editable;
      // Note this is not reversed because it corresponds to direct map coordinates.
      const latlngsFormatted = latlngs.map((latlng) => [latlng?.lat, latlng?.lng]);

      // Append a new marker to the data.
      setEditorData((oldData) => {
        // Construct a new marker.
        const id = (oldData.length ?? 0) + 1;
        const marker = {
          id,
          geometry: { type: 'LineString', coordinates: latlngsFormatted },
          type: 'Feature',
          properties: { popupTitle: '', popupContent: '', popupImage: '' },
        };

        // Append the marker.
        const newData = oldData;
        newData.push(marker);
        return newData;
      });

      setEditorState('none');
      setCurrentEditable(null);
    };

    const onDragStart = (event) => {
      // Called when starting to drag a marker.

      const isMarker = event.layer.feature.geometry.type === 'Point';
      // const isRouteVertex = event.layer.feature.geometry.type === "LineMarker";

      if (isMarker) {
        setCurrentEditable(event.layer);
        setEditorState('dragMarker');
        // return;
      }
    };

    const onDragEnd = (event) => {
      // If the current mode is 'dragMarker', call our override function,
      // and cancel the event that would occur.

      if (editorState === 'dragMarker') {
        const marker = event.layer.feature;

        // eslint-disable-next-line no-underscore-dangle
        const { _latlng: latlng } = event.layer;

        // Modify the marker in the data.
        setEditorData((oldData) => {
          // Construct a new marker.
          const id = oldData.indexOf(marker);

          // Append the marker.
          const newData = oldData;
          newData[id] = {
            ...marker,
            geometry: {
              ...marker.geometry,
              // Not reversed.
              coordinates: [latlng.lat, latlng.lng],
            },
          };
          return newData;
        });

        setEditorState('none');
        setCurrentEditable(null);
      }
    };

    const onVertexMarkerDragStart = (event) => {
      const isRoute = event.layer.feature.geometry.type === 'LineString';
      // const isRouteVertex = event.layer.feature.geometry.type === "LineMarker";
      if (isRoute) {
        setCurrentEditable(event.layer);
        setEditorState('dragRoute');
        // return;
      }
    };

    const onVertexMarkerDragEnd = (event) => {
      // If the current mode is 'dragMarker', call our override function,
      // and cancel the event that would occur.

      if (editorState === 'dragRoute') {
        const route = event.layer.feature;
        const newRouteLatLngs = event.vertex.latlngs.map((vertex) => [vertex.lat, vertex.lng]);

        // Modify the route in the data.
        setEditorData((oldData) => {
          // Construct a new marker.
          const id = oldData.indexOf(route);

          // Append the marker.
          const newData = _.cloneDeep(oldData);
          newData[id] = {
            ...route,
            geometry: {
              ...route.geometry,
              // Not reversed.
              coordinates: newRouteLatLngs,
            },
          };

          return newData;
        });

        setEditorState('none');
        setCurrentEditable(null);
      }
    };

    const onDrawingCommit = (event, map) => {
      if (editorState === 'createRoute') {
        map.removeLayer(currentEditable);
        placeRoute(currentEditable);
        return;
      }

      if (editorState === 'createMarker') {
        map.removeLayer(currentEditable);
        placeMarker(currentEditable);
        // return;
      }
    };

    return (
      <ReactLeafletEditable
        ref={editRef}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onVertexMarkerDragStart={onVertexMarkerDragStart}
        onVertexMarkerDragEnd={onVertexMarkerDragEnd}
        onDrawingCommit={onDrawingCommit}
      >
        <Map
          ref={mapRef}
          onClick={onClick}
          ondragend={onChangeMapPos}
          onzoomend={onChangeMapPos}
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
          {/* Controls the actual map image. */}
          <TileLayer url={tileUrl} noWrap bounds={MAP_BOUNDS} errorTileUrl={`tiles/blank.${ext}`} />
          {/* Controls the attribution link in the bottom right corner. */}
          <AttributionControl prefix={ATTRIBUTION} />
          {/* Controls the zoom buttons in the top left corner. */}
          <ZoomControl zoomInTitle="+" zoomOutTitle="-" />

          {editorEnabled ? (
            <EditorControls
              startEditorMarker={startEditorMarker}
              startEditorRoute={startEditorRoute}
            />
          ) : null}

          {children}
        </Map>
      </ReactLeafletEditable>
    );
  }
);

export default EditorMap;
