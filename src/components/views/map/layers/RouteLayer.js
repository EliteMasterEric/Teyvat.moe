/**
 * Provides the map layer used to display a Route on the leaflet map.
 */

import L from 'leaflet';
// Importing these libraries changes the behavior of leaflet to include new functions.
import 'leaflet-textpath';
import React from 'react';
import { GeoJSON } from 'react-leaflet';
import { connect } from 'react-redux';

import { useImageExtension } from '~/components/interface/Image';
import { hashObject } from '~/components/Util';
import { lineProperties, lineTextProperties } from '~/components/views/map/LayerConstants';
import { buildPopup, POPUP_WIDTH } from '~/components/views/map/MapPopupLegacy';

const _RouteLayer = ({ mapRoute, displayed }) => {
  const ext = useImageExtension();

  // TODO: We hide by destroying it. Is there a better way?
  if (!displayed) return null;

  const lineToLayer = (_feature, latLngs) => {
    const latlngsFormatted = latLngs.map((latlng) => [latlng?.lng, latlng?.lat]);

    const line = L.polyline(latlngsFormatted, lineProperties);
    line.setText('  ►  ', lineTextProperties);

    return line;
  };

  const onEachFeature = (route, layer) => {
    const text = buildPopup(route, ext);
    if (text)
      layer.bindPopup(`<div class="map-marker-popup">${text}</div>`, {
        maxWidth: POPUP_WIDTH,
      });
  };

  return (
    <GeoJSON
      key={hashObject(mapRoute)}
      data={mapRoute.data}
      lineToLayer={lineToLayer}
      onEachFeature={onEachFeature}
    />
  );
};

const mapStateToProps = (state, { routeKey }) => ({
  // Display the route if the route is enabled in the controls,
  // and we aren't in the state of (editor on + hide routes when editor is on)
  displayed:
    !((state.options.hideRoutesInEditor ?? false) && (state.editorEnabled ?? false)) &&
    state.displayed.routes[routeKey],
});
const mapDispatchToProps = (_dispatch) => ({});
const RouteLayer = connect(mapStateToProps, mapDispatchToProps)(_RouteLayer);

export default RouteLayer;
