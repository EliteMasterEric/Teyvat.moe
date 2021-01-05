/**
 * Provides the map layer used to display the Editor data on the leaflet map.
 *
 * For the logic managing the placement of markers and routes, see MapEditorHandler.
 */

import L from 'leaflet';
// Importing these libraries changes the behavior of leaflet to include new functions.
import 'leaflet-editable';
import 'leaflet-textpath';
import React from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import { connect } from 'react-redux';

import { localizeField } from '~/components/i18n/FeatureLocalization';
import {
  editorMarker,
  editorMarkerHighlight,
  lineProperties,
  linePropertiesHighlight,
  lineTextProperties,
  lineTextPropertiesHighlight,
} from '~/components/views/map/LayerConstants';
import { buildPopup, POPUP_WIDTH } from '~/components/views/map/MapPopupLegacy';
import { hashObject } from '~/components/Util';

const _EditorLayer = ({ displayed, editorData, editorHighlight }) => {
  // Any child elements of the react-leaflet MapContainer can access the Map instance
  // through the use of a custom hook.
  const mapCurrent = useMap();

  // Use PNG for the editor since we can assume WebP hasn't been built yet.
  const ext = 'png';

  const mapFeature = {
    data: editorData,
    highlighted: editorHighlight,
    icons: {
      // The icon used on the map.
      base: editorMarker,
      done: editorMarkerHighlight,
    },
  };

  const pointToLayer = (feature, latLng) => {
    const highlighted = feature?.id === editorHighlight;

    // Generate the feature here.
    // Note that GeoJSON reverses these.
    return L.marker([latLng.lng, latLng.lat], {
      icon: highlighted ? mapFeature.icons.done : mapFeature.icons.base,
      alt: `${latLng.lng},${latLng.lat}`,
    });
  };

  const lineToLayer = (feature, latLngs) => {
    const highlighted = feature?.id === editorHighlight;

    const latlngsFormatted = latLngs.map((latlng) => [latlng?.lng, latlng?.lat]);

    const line = L.polyline(
      latlngsFormatted,
      highlighted ? linePropertiesHighlight : lineProperties
    );
    line.setText('  ►  ', highlighted ? lineTextPropertiesHighlight : lineTextProperties);
    return line;
  };

  const style = () => {
    // (feature)
    // Tack on additional styles here.
    return {};
  };

  const onEachFeature = (feature, layer) => {
    // eslint-disable-next-line no-param-reassign
    layer.enableEdit(mapCurrent);

    // Define popups and drag events here.
    // layer.on('click', onClickFeature);
    // layer.on('dblclick', onDoubleClickFeature);

    // Build a popup.
    const translatedFeature = {
      ...feature,
      properties: {
        ...feature.properties,
        popupTitle: localizeField(feature?.properties?.popupTitle) ?? '',
        popupContent: localizeField(feature?.properties?.popupContent) ?? '',
      },
    };

    try {
      const text = buildPopup(translatedFeature, ext, -1, true);
      if (text) {
        layer.bindPopup(`<div class="map-marker-popup">${text}</div>`, {
          maxWidth: POPUP_WIDTH,
        });
      }
    } catch (e) {
      // Print the error and don't add the popup to the marker.
      console.error(e);
    }
  };

  // TODO: We hide by destroying. Is there a better way?
  if (!displayed) return null;

  return (
    <GeoJSON
      editable
      key={hashObject(mapFeature)}
      data={mapFeature.data}
      style={style}
      pointToLayer={pointToLayer}
      lineToLayer={lineToLayer}
      onEachFeature={onEachFeature}
    />
  );
};

const mapStateToProps = (state) => ({
  displayed: state.editorEnabled,
  editorData: state.editor.feature.data,
  editorHighlight: state.editorHighlight,
});
const mapDispatchToProps = (_dispatch) => ({});
const EditorLayer = connect(mapStateToProps, mapDispatchToProps)(_EditorLayer);

export default EditorLayer;
