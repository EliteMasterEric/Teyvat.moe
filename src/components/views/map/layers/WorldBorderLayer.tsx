/**
 * Provides the map layer which displays the world border
 * on the Leaflet map.
 */

// Importing these libraries changes the behavior of leaflet to include new functions.
// import 'leaflet.pattern';
import React from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import { connect } from 'react-redux';
import type { GeoJsonObject } from 'geojson';

const WorldBorderData: GeoJsonObject = require('~/data/core/world-border.json');

/**
 * Adds a striped pattern outside the world border.
 * Looks great but TANKS performance.
 */
/*
const worldBorderPattern = new L.StripePattern({
  patternContentUnits: 'objectBoundingBox',
  patternUnits: 'objectBoundingBox',

  color: 'red',
  opacity: 0.4,
  spaceColor: 'red',
  spaceOpacity: 0.2,

  // Angle in degrees.
  angle: 45,
  // weight + spaceWeight = height
  weight: 0.025,
  spaceWeight: 0.025,
  height: 0.05,
});
*/

const _WorldBorderLayer = ({ displayed }) => {
  // Any child elements of the react-leaflet MapContainer can access the Map instance
  // through the use of a custom hook.
  const mapCurrent = useMap();

  // TODO: We destroy the layer if it's hidden. Is there a more performant way?
  if (!displayed) return null;

  return (
    <GeoJSON
      // If the zoom level changes, the world border should reload.
      key={mapCurrent.getZoom()}
      style={{
        // fillPattern: worldBorderPattern,
        stroke: false,
        fillOpacity: 0.3,
        color: 'red',
      }}
      data={WorldBorderData}
    />
  );
};

const mapStateToProps = (state) => ({
  displayed: state.options.worldBorderEnabled,
});
const mapDispatchToProps = (_dispatch) => ({});
const WorldBorderLayer = connect(mapStateToProps, mapDispatchToProps)(_WorldBorderLayer);

export default WorldBorderLayer;
