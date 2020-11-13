import _ from 'lodash';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import clsx from 'clsx';

import L from 'leaflet';
// Its very presence changes the behavior of L.
import 'leaflet-editable';
import 'leaflet-textpath';
import 'leaflet.pattern';

import { GeoJSON } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { hashObject } from '../Util';

import './MapLayer.css';
import { createMapIcon } from '../MapFeaturesData';
import { displayUnixTimestamp, f, localizeField } from '../Localization';

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

const buildPopup = (feature, completionTime = -1) => {
  let text = '';
  if (!feature) return text;

  if (feature.properties.popupTitle)
    text = `${text}<b class="map-marker-popup-title">${feature.properties.popupTitle}</b>`;

  if (feature.properties.popupImage)
    text = `${text}<img class="map-marker-popup-image" src="/comments/${feature.properties.popupImage}"/>`;

  if (feature.properties.popupContent)
    text = `${text}<span class="map-marker-popup-content">${feature.properties.popupContent}</span>`;

  if (completionTime !== -1)
    text = `${text}<span class="map-marker-popup-completion-time">${f('popup-completed', {
      time: displayUnixTimestamp(completionTime),
    })}</span>`;

  return text;
};

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

export const WorldBorderLayer = ({ mapRef }) => {
  const zoomLevel = mapRef.current.leafletElement.getZoom();

  const polygonToLayer = (geoJsonData, latLngs) => {
    return new L.Polygon(latLngs, {
      // fillPattern: worldBorderPattern,
      stroke: false,
      fillOpacity: 0.3,
      color: 'red',
    });
  };

  // Do once.
  React.useEffect(() => {
    worldBorderPattern.addTo(mapRef.current.leafletElement);
  }, []);

  return (
    <GeoJSON
      key={hashObject({ worldBorderData, zoomLevel })}
      polygonToLayer={polygonToLayer}
      data={worldBorderData.data}
    />
  );
};

const regionLabelData = require('../../data/core/map-labels.json');

const RegionLabel = ({ featureData, zoomLevel }) => {
  const name = localizeField(featureData?.properties?.label);
  /**
   * Dynamically style based on zoom level.
   * Currently used to scale text, but if needed,
   * a switch/case structure could be used for
   * finer tuning.
   */
  const style = {
    fontSize: `${zoomLevel * 0.25}em`,
    '-webkit-text-stroke': `${zoomLevel * 0.125}px black`,
    textStroke: `${zoomLevel * 0.125}px black`,
    top: `-${zoomLevel * 2}px`,
  };
  return (
    <h1 className={clsx('map-region-label-text')} style={style}>
      {name}
    </h1>
  );
};

export const RegionLabelLayer = ({ mapRef }) => {
  const [zoomLevel, storeZoomLevel] = React.useState(
    mapRef?.current?.leafletElement?.getZoom() ?? 4
  );

  const pointToLayer = (featureData, latLng) => {
    const html = ReactDOMServer.renderToString(
      <RegionLabel featureData={featureData} zoomLevel={zoomLevel} />
    );

    return L.marker([latLng.lng, latLng.lat], {
      icon: L.divIcon({
        html,
        className: 'map-region-label-marker',
      }),
    });
  };

  /**
   * Update whenever the zoom level changes.
   */
  React.useEffect(() => {
    mapRef.current.leafletElement.on('zoomend', () => {
      storeZoomLevel(mapRef.current.leafletElement.getZoom());
    });
  }, [mapRef.current.leafletElement]);

  return (
    <GeoJSON
      key={hashObject({ regionLabelData, zoomLevel })}
      pointToLayer={pointToLayer}
      data={regionLabelData.data}
    />
  );
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
    const translatedFeature = {
      ...feature,
      properties: {
        ...feature.properties,
        popupTitle: localizeField(feature?.properties?.popupTitle) ?? '',
        popupContent: localizeField(feature?.properties?.popupContent) ?? '',
      },
    };
    const text = buildPopup(translatedFeature);
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
  completedIds,
}) => {
  const pointToLayer = (feature, latLng) => {
    // Generate the feature here.
    const completed = _.has(completedIds, feature?.id);
    // Note that GeoJSON reverses these.
    const icon = completed
      ? createMapIcon({
          ...mapFeature.icons.done,
          key: mapFeature.icons.done.key ?? mapFeature.icons.filter,
          done: true,
        })
      : createMapIcon({
          ...mapFeature.icons.base,
          key: mapFeature.icons.base.key ?? mapFeature.icons.filter,
          done: false,
        });

    const iconUrl = icon?.options?.iconUrl;

    return L.marker([latLng.lng, latLng.lat], {
      icon,
      alt: `${latLng.lng},${latLng.lat}`,
      properties: {
        done: completed,
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
    const completed = _.has(completedIds, feature?.id);
    // Set opacity if completed.
    layer.setOpacity(completed ? mapPreferences?.options?.completedAlpha : 1);

    const completionTime = _.get(completedIds, feature?.id, -1);
    const text = buildPopup(feature, completionTime);
    if (text) layer.bindPopup(`<div class="map-marker-popup">${text}</div>`);
  };

  const createClusterIcon = (cluster) => {
    const childMarkers = cluster.getAllChildMarkers();
    const childCount = childMarkers.length;
    // For each element, check if done = true; if so, add to the count.
    const childDoneCount = childMarkers.reduce(
      (prev, marker) => prev + (marker?.options?.properties?.done ? 1 : 0),
      0
    );
    const iconUrl = childMarkers[0]?.options?.properties?.iconUrl;

    // const svgTipFill = childDoneCount / childCount === 1 ? '00EBF4' : 'E6E6E6';
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
    completedIds: completedIds ?? [],
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
  const lineToLayer = (_feature, latLngs) => {
    const latlngsFormatted = latLngs.map((latlng) => [latlng?.lng, latlng?.lat]);

    const line = L.polyline(latlngsFormatted, lineProperties);
    line.setText('  ►  ', lineTextProperties);

    return line;
  };

  const onEachFeature = (route, layer) => {
    const text = buildPopup(route);
    if (text) layer.bindPopup(`<div class="map-marker-popup">${text}</div>`);
  };

  // If any of these values change, update the map.
  const hashValue = {
    mapRoute,
    options: mapPreferences?.options,
  };

  return (
    <GeoJSON
      key={hashObject(hashValue)}
      data={mapRoute.data}
      lineToLayer={lineToLayer}
      onEachFeature={onEachFeature}
    />
  );
};
