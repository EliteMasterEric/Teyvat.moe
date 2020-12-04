import React from 'react';
import { connect } from 'react-redux';

import L from 'leaflet';
// Its very presence changes the behavior of L.
import 'leaflet.pattern';

import { GeoJSON } from 'react-leaflet';
import { hashObject } from '../Util';

const worldBorderData = require('../../data/core/world-border.json');

/**
 * Adds a striped pattern outside the world border.
 * Looks great but TANKS performance.
 */
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

const _WorldBorderLayer = ({ mapRef, displayed }) => {
  const zoomLevel = mapRef.current.leafletElement.getZoom();

  const polygonToLayer = (_geoJsonData, latLngs) => {
    return new L.Polygon(latLngs, {
      // fillPattern: worldBorderPattern,
      stroke: false,
      fillOpacity: 0.3,
      color: 'red',
      zIndexOffset: -1000,
    });
  };

  // Do once.
  React.useEffect(() => {
    worldBorderPattern.addTo(mapRef.current.leafletElement);
  }, []);

  // TODO: We destroy the layer if it's hidden. Is there a more performant way?
  if (!displayed) return null;

  return (
    <GeoJSON
      key={hashObject({ worldBorderData, zoomLevel })}
      polygonToLayer={polygonToLayer}
      data={worldBorderData.data}
    />
  );
};

const mapStateToProps = (state) => ({
  displayed: state.options.worldBorderEnabled,
});
const mapDispatchToProps = (_dispatch) => ({});
const WorldBorderLayer = connect(mapStateToProps, mapDispatchToProps)(_WorldBorderLayer);

export default WorldBorderLayer;
