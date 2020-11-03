import React from 'react';

import L from 'leaflet';
import 'leaflet-editable'; // Its very presence changes the behavior of L.
import 'leaflet-textpath';

import { GeoJSON } from 'react-leaflet';
import { hashObject } from '../Util';

import './MapLayer.css';

export const editorMarker = L.icon({
  className: `map-marker-editor`,
  iconUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', // Transparent pixel.
  shadowUrl: require('../../images/icons/map_base/marker.png').default, // Default value. Use options to override.
  iconSize: [24, 23], // size of the icon
  shadowSize: [40, 40], // size of the shadow
  iconAnchor: [12, 34.5], // point of the icon which will correspond to marker's location
  shadowAnchor: [20, 40], // the same for the shadow
  popupAnchor: [0, -34.5], // point from which the popup should open relative to the iconAnchor
});

export const editorMarkerHighlight = L.icon({
  className: `map-marker-editor`,
  iconUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', // Transparent pixel.
  shadowUrl: require('../../images/icons/map_done/marker.png').default, // Default value. Use options to override.
  iconSize: [24, 23], // size of the icon
  shadowSize: [40, 40], // size of the shadow
  iconAnchor: [12, 34.5], // point of the icon which will correspond to marker's location
  shadowAnchor: [20, 40], // the same for the shadow
  popupAnchor: [0, -34.5], // point from which the popup should open relative to the iconAnchor
});

export const lineProperties = {
  color: '#d32f2f',
};
export const lineTextProperties = {
  repeat: true,
  attributes: { y: 4, fill: '#d32f2f', class: 'leaflet-map-route-text' },
};

export const linePropertiesHighlight = {
  color: '#f57c00',
};
export const lineTextPropertiesHighlight = {
  repeat: true,
  attributes: { y: 4, fill: '#f57c00', class: 'leaflet-map-route-text' },
};

const buildPopup = (feature) => {
  let text = '';
  if (feature.properties.popupTitle)
    text = `${text}<b class="map-marker-popup-title">${feature.properties.popupTitle}</b>`;

  if (feature.properties.popupImage)
    text = `${text}<img class="map-marker-popup-image" src="/comments/${feature.properties.popupImage}"/>`;

  if (feature.properties.popupContent)
    text = `${text}<span class="map-marker-popup-content">${feature.properties.popupContent}</span>`;
  return text;
};

export const EditorLayer = ({ mapRef, mapPreferences }) => {
  const mapFeature = {
    ...mapPreferences?.editor?.feature,
    highlighted: mapPreferences?.editor?.highlighted,
    icons: {
      // The icon used on the map.
      base: editorMarker,
      done: editorMarkerHighlight,
    },
  };

  const pointToLayer = (feature, latLng) => {
    const highlighted = feature?.id === mapPreferences?.editor?.highlighted;

    // Generate the feature here.
    // Note that lng are NOT reversed here. GeoJSON reverses them but this doesn't.
    return L.marker([latLng.lat, latLng.lng], {
      icon: highlighted ? mapFeature.icons.done : mapFeature.icons.base,
      alt: `${latLng.lng},${latLng.lat}`,
    });
  };

  const lineToLayer = (feature, latLngs) => {
    const highlighted = feature?.id === mapPreferences?.editor?.highlighted;

    const line = L.polyline(latLngs, highlighted ? linePropertiesHighlight : lineProperties);
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
    layer.enableEdit(mapRef.current.leafletElement);

    // Define popups and drag events here.
    // layer.on('click', onClickFeature);
    // layer.on('dblclick', onDoubleClickFeature);

    // Build a popup.
    const text = buildPopup(feature);
    if (text) layer.bindPopup(`<div class="map-marker-popup">${text}</div>`);
  };

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

export const FeatureLayer = ({ featureKey, mapFeature, markFeature, markedIds }) => {
  const pointToLayer = (feature, latLng) => {
    // Generate the feature here.
    const marked = (markedIds ?? []).includes(feature?.id);
    return L.marker([latLng.lng, latLng.lat], {
      icon: marked ? mapFeature.icons.done : mapFeature.icons.base,
      alt: `${latLng.lng},${latLng.lat}`,
    });
  };

  const onDoubleClickFeature = (feature) => () => {
    // (event)
    markFeature(featureKey, feature.id);
  };

  const onEachFeature = (feature, layer) => {
    // Define popups and drag events here.
    // layer.on('click', onClickFeature(feature));
    layer.on('dblclick', onDoubleClickFeature(feature));

    // Build a popup.
    const text = buildPopup(feature);
    if (text) layer.bindPopup(`<div class="map-marker-popup">${text}</div>`);
  };

  // If any of these values change, update the map.
  const hashValue = {
    mapFeature,
    markedIds: markedIds ?? [],
  };

  return (
    <GeoJSON
      key={hashObject(hashValue)}
      data={mapFeature.data}
      pointToLayer={pointToLayer}
      onEachFeature={onEachFeature}
    />
  );
};

export const RouteLayer = ({ mapRoute }) => {
  const lineToLayer = (feature, latLngs) => {
    const line = L.polyline(latLngs, lineProperties);
    line.setText('  ►  ', lineTextProperties);

    return line;
  };

  return <GeoJSON key={hashObject(mapRoute)} data={mapRoute.data} lineToLayer={lineToLayer} />;
};
