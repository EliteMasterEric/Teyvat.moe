/**
 * Provides a set of constant values and icons used by Leaflet.
 */

import { latLngBounds } from 'leaflet';
// Importing these libraries changes the behavior of leaflet to include new functions.
import 'leaflet-editable';
import 'leaflet-textpath';
import _ from 'lodash';
import { getNextImageUrl } from 'src/components/interface/Image';

// Offset the TileLayer visually by a given LatLng value. Adheres to zoom level.
const TILE_WIDTH = 32 / 3;
export const MAP_LATLNG_OFFSET: [number, number] = [0, 0];
// Offset the TileLayer visually by a given pixel value. May behave differently by zoom level.
export const MAP_CSS_OFFSET: [number, number] = [0, 0];

export const OFFSET_TILE_LAYER = [1, 1];

// Zoom levels.
export const MINIMUM_ZOOM = 4;
export const MAXIMUM_NATIVE_ZOOM = 7;
export const MAXIMUM_ZOOM = 10;

// Format used to fetch the URL of a tile. z is the zoom level, x and y are the coordinates.
// export const TILE_URL = 'tiles/Map_{z}_{x}_{y}.{ext}';
export const TILE_URL = getNextImageUrl('/images/tiles/Map_{z}_{x}_{y}.png', 256, 256);
export const TILE_BLANK = getNextImageUrl('/images/tiles/blank.png', 256, 256);

// Observable bounds of the map.
// export const MAP_BOUNDS = L.latLngBounds([0, 0], [-66.5, 90]);
//export const MAP_BOUNDS = latLngBounds([0, 0], [-64, 64]);
export const MAP_BOUNDS = latLngBounds([0, 0], [-64, 128]);

export const lineProperties = {
  color: '#d32f2f', // Red
};
export const lineTextProperties = {
  repeat: true,
  attributes: { dy: '6', fill: '#d32f2f', class: 'leaflet-map-route-text' },
};

export const linePropertiesHighlight = {
  color: '#f57c00', // Orange
};
export const lineTextPropertiesHighlight = {
  repeat: true,
  attributes: { dy: '6', fill: '#f57c00', class: 'leaflet-map-route-text' },
};

export const linePropertiesSmart = {
  color: '#0047AB', // Cobalt Blue
};
