import React from 'react';

import L, { Control } from 'leaflet';
import { AttributionControl, Map, TileLayer, ZoomControl } from 'react-leaflet';
// import { canUseDOM } from './Util';

const MAP_BOUNDS = L.latLngBounds([0, 0], [-66.5, 90]);
const MAP_CENTER = [-35, 45];

// Format used to fetch the URL of a tile. z is the zoom level, x and y are the coordinates.
const TILE_URL = 'images/tiles/{z}/ppp{x}_{y}.jpg';

const ATTRIBUTION =
  "<a href='https://github.com/GenshinMap/genshinmap.github.io' target='_blank'>Directions and Feedback</a>";

const LeafletMap = () => {
  return (
    <Map
      maxBounds={MAP_BOUNDS}
      center={MAP_CENTER}
      zoom={4}
      zoomDelta={0.5}
      zoomSnap={0.5}
      maxZoom={8}
      minZoom={4}
      attributionControl={false} // Override the Leaflet attribution with our own AttributionControl.
      zoomControl={false}
    >
      <TileLayer url={TILE_URL} reuseTiles />
      <AttributionControl prefix={ATTRIBUTION} />
      <ZoomControl zoomInTitle="+" zoomOutTitle="-" />
    </Map>
  );
};

export default LeafletMap;
