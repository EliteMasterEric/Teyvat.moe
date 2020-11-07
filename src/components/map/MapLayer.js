import React from 'react';

import L from 'leaflet';
// Its very presence changes the behavior of L.
import 'leaflet-editable';
import 'leaflet-textpath';

import { GeoJSON } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { hashObject } from '../Util';

import './MapLayer.css';
import { createMapIcon } from '../MapFeatures';

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
    // Note that GeoJSON reverses these.
    return L.marker([latLng.lng, latLng.lat], {
      icon: highlighted ? mapFeature.icons.done : mapFeature.icons.base,
      alt: `${latLng.lng},${latLng.lat}`,
    });
  };

  const lineToLayer = (feature, latLngs) => {
    const highlighted = feature?.id === mapPreferences?.editor?.highlighted;

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

export const FeatureLayer = ({
  mapPreferences,
  featureKey,
  mapFeature,
  markFeature,
  markedIds,
}) => {
  const pointToLayer = (feature, latLng) => {
    // Generate the feature here.
    const marked = (markedIds ?? []).includes(feature?.id);
    // Note that GeoJSON reverses these.
    const icon = marked
      ? createMapIcon({
          ...mapFeature.icons.done,
          done: true,
        })
      : createMapIcon({
          ...mapFeature.icons.base,
          done: false,
        });

    const iconUrl = icon?.options?.iconUrl;

    return L.marker([latLng.lng, latLng.lat], {
      icon,
      alt: `${latLng.lng},${latLng.lat}`,
      properties: {
        done: marked,
        iconUrl,
      },
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
    const marked = (markedIds ?? []).includes(feature?.id);
    const text = buildPopup(feature);
    // Set opacity if marked.
    layer.setOpacity(marked ? mapPreferences?.options?.markedAlpha : 1);
    if (text) layer.bindPopup(`<div class="map-marker-popup">${text}</div>`);
  };

  const createClusterIcon = (cluster) => {
    const childMarkers = cluster.getAllChildMarkers();
    console.log(childMarkers);
    const childCount = childMarkers.length;
    // For each element, check if done = true; if so, add to the count.
    const childDoneCount = childMarkers.reduce(
      (prev, marker) => prev + (marker?.options?.properties?.done ? 1 : 0),
      0
    );
    const iconUrl = childMarkers[0]?.options?.properties?.iconUrl;

    const svgTipFill = childDoneCount / childCount === 1 ? '00EBF4' : 'E6E6E6';
    const iconHTML = `<img class='map-marker-cluster-marker' src="${
      require('../../images/icons/map_base/marker_cluster.png').default
    }"/><b class="map-marker-cluster-label">${childDoneCount}/${childCount}</b><img class='map-marker-cluster-img' src='${iconUrl}'/>`;

    return L.divIcon({
      html: iconHTML,
      className: 'map-marker-cluster',
      iconSize: new L.Point(40, 40),
    });
  };

  // If any of these values change, update the map.
  const hashValue = {
    mapFeature,
    markedIds: markedIds ?? [],
    options: mapPreferences?.options,
  };

  const inner = (
    <GeoJSON
      key={hashObject(hashValue)}
      data={mapFeature.data}
      pointToLayer={pointToLayer}
      onEachFeature={onEachFeature}
    />
  );

  // Cluster if enabled by the user and the feature type supports it.
  return (mapFeature?.cluster ?? false) && mapPreferences?.options?.clusterMarkers ? (
    <MarkerClusterGroup
      iconCreateFunction={createClusterIcon}
      maxClusterRadius={(_zoom) => 80}
      zoomToBoundsOnClick={false}
      showCoverageOnHover={false}
    >
      {inner}
    </MarkerClusterGroup>
  ) : (
    inner
  );
};

export const RouteLayer = ({ mapPreferences, mapRoute }) => {
  const lineToLayer = (feature, latLngs) => {
    const latlngsFormatted = latLngs.map((latlng) => [latlng?.lng, latlng?.lat]);

    const renderer = L.canvas({});

    const line = L.polyline(latlngsFormatted, lineProperties);
    line.setText('  ►  ', lineTextProperties);

    return line;
  };

  // If any of these values change, update the map.
  const hashValue = {
    mapRoute,
    options: mapPreferences?.options,
  };

  return <GeoJSON key={hashObject(hashValue)} data={mapRoute.data} lineToLayer={lineToLayer} />;
};
