import React from 'react';

import L from 'leaflet';
import 'leaflet-editable'; // Its very presence changes the behavior of L.
import { AttributionControl, Map, TileLayer, ZoomControl } from 'react-leaflet';
import Control from 'react-leaflet-control';
import ReactLeafletEditable from 'react-leaflet-editable';

import clsx from 'clsx';
import { editorMarkerHighlight, lineProperties, lineTextProperties } from './MapLayer';

import './EditorMap.css';

// Center of the map.
export const MAP_CENTER = [-35, 45];

// Default zoom level.
export const DEFAULT_ZOOM = 4;

// Format used to fetch the URL of a tile. z is the zoom level, x and y are the coordinates.
const TILE_URL = 'tiles/Map_{z}_{x}_{y}.png';

// Observable bounds of the map.
const MAP_BOUNDS = L.latLngBounds([0, 0], [-66.5, 90]);

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

      // Note this is reversed because GeoJSON stores them that way.
      const latlngFormatted = [latlng?.lng, latlng?.lat];

      // Append a new marker to the data.
      setEditorData((oldData) => {
        // Construct a new marker.
        const id = (oldData.length ?? 0) + 1;
        const marker = {
          id,
          geometry: { type: 'Point', coordinates: latlngFormatted },
          type: 'Feature',
          properties: { popupTitle: '', popupContent: '', popupImage: '' },
        };

        // Append the marker.
        const newData = oldData;
        newData.push(marker);
        return newData;
      });

      setCurrentEditable(null);
    };

    const placeRoute = (editable) => {
      const { _latlngs: latlngs } = editable;
      // GeoJSON is dumb, why is this reversed?
      const latlngsFormatted = latlngs.map((latlng) => [latlng?.lng, latlng?.lat]);

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

      setCurrentEditable(null);
    };

    const onDragStart = (event) => {
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
              // Reversed because GeoJSON.
              coordinates: [latlng.lng, latlng.lat],
            },
          };
          return newData;
        });
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
          maxZoom={8}
          minZoom={3}
          attributionControl={false} // Override the Leaflet attribution with our own AttributionControl.
          zoomControl={false}
        >
          {/* Controls the actual map image. */}
          <TileLayer url={TILE_URL} reuseTiles />
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
