import React from 'react';

import L from 'leaflet';
import { AttributionControl, Map, TileLayer, ZoomControl } from 'react-leaflet';

import { MapFeatures } from '../MapFeatures';
import { FeatureLayer, EditorLayer } from './MapLayer';

import './LeafletMap.css';

// Format used to fetch the URL of a tile. z is the zoom level, x and y are the coordinates.
const TILE_URL = 'tiles/Map_{z}_{x}_{y}.png';
const MAP_BOUNDS = L.latLngBounds([0, 0], [-66.5, 90]);
const MAP_CENTER = [-35, 45];
// A link back to the main repository.
const ATTRIBUTION =
  "<a href='https://github.com/GenshinMap/genshinmap.github.io' target='_blank'><span class='nf nf-fa-github' style='margin-right: 0.5em;'></span>Directions and Feedback</a>";

const LeafletMap = ({ mapPreferences, setMapPreferences }) => {
  const [lastClick, setLastClick] = React.useState(0);

  const updateData = (func) => {
    setMapPreferences((old) => ({
      ...old,
      editor: {
        ...old.editor,
        feature: {
          ...old.editor.feature,
          data: func(old.editor.feature.data),
        },
      },
    }));
  };

  const onClick = (e) => {
    // Debouncing.
    if (lastClick - Date.now() > 20) return;
    setLastClick(Date.now());

    // Ignore clicks if not in editor mode.
    if (!mapPreferences?.editor?.enabled) return;

    // Add a marker on click.
    updateData((oldData) => {
      const newData = oldData;

      // Create a marker.
      const id = mapPreferences?.editor?.feature?.data.length ?? 1;
      newData.push({
        id,
        geometry: { type: 'Point', coordinates: [e?.latlng?.lat, e?.latlng?.lng] },
        type: 'Feature',
        properties: { popupTitle: '', popupContent: '' },
      });

      return newData;
    });
  };

  return (
    <Map
      onClick={onClick}
      maxBounds={MAP_BOUNDS}
      center={MAP_CENTER}
      zoom={4}
      zoomDelta={0.5}
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

      {mapPreferences?.editor?.enabled ? (
        <EditorLayer mapPreferences={mapPreferences} updateData={updateData} />
      ) : (
        Object.keys(mapPreferences?.displayed).map((key) => {
          const shouldDisplay = mapPreferences?.displayed[key];

          if (!shouldDisplay) return null;

          const feature = MapFeatures[key];
          return <FeatureLayer key={key} mapFeature={feature} />;
        })
      )}
    </Map>
  );
};

export default LeafletMap;
