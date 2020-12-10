import React from 'react';
import _ from 'lodash';

import { GeoJSON } from 'react-leaflet';
import { connect } from 'react-redux';

import L from 'leaflet';
// Its very presence changes the behavior of L.
import 'leaflet.markercluster';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import store from '../../redux';
import { createMapIcon } from '../MapFeaturesData';
import { useImageExtension } from '../Image';
import { hashObject } from '../Util';
import { buildPopup, POPUP_WIDTH } from './MapPopup';
import {
  clearFeatureMarkerCompleted,
  setFeatureMarkerCompleted,
} from '../../redux/ducks/completed';

import './FeatureLayer.css';

const _SmartRouteLayer = ({
  mapFeature,

  clusterMarkers,
  displayed,
  completedIds,
  completedAlpha,

  markFeature,
  unmarkFeature,
}) => {
  // Prevent attempting to display the map until we know if the browser supports WebP.
  const ext = useImageExtension();

  // TODO: We hide by destroying. Is there a better way?
  if (!displayed) return null;

  const pointToLayer = (feature, latLng) => {
    // Generate the feature here.
    const completed = _.has(completedIds, feature?.id);
    // Note that GeoJSON reverses these.
    const icon = completed
      ? createMapIcon({
          ...mapFeature.icons.done,
          ext: mapFeature?.icons?.done?.svg ?? false ? 'svg' : ext,
          key: mapFeature.icons.done.key ?? mapFeature.icons.filter,
          completed: true,
        })
      : createMapIcon({
          ...mapFeature.icons.base,
          ext: mapFeature?.icons?.base?.svg ?? false ? 'svg' : ext,
          key: mapFeature.icons.base.key ?? mapFeature.icons.filter,
          completed: false,
        });

    const iconUrl = icon?.options?.clusterIconUrl;

    return L.marker([latLng.lng, latLng.lat], {
      icon,
      alt: `${latLng.lng},${latLng.lat}`,
      properties: {
        completed,
        iconUrl,
      },
    });
  };

  const onDoubleClickMarker = (feature, _event) => {
    // Get the state in real time.
    if (store.getState().editorEnabled) return;

    const completed = _.has(completedIds, feature?.id);
    // Mark as completed.
    if (completed) {
      unmarkFeature(feature.id);
    } else {
      markFeature(feature.id);
    }
  };

  const onEachFeature = (feature, layer) => {
    // Define popups and drag events here.
    // List of compatible events: https://developer.mozilla.org/en-US/docs/Web/Events
    layer.on('dblclick', (event) => onDoubleClickMarker(feature, event));

    // Build a popup.
    const completed = _.has(completedIds, feature?.id);
    // Set opacity if completed.
    layer.setOpacity(completed ? completedAlpha : 1);

    const completionTime = _.get(completedIds, feature?.id, -1);
    const text = buildPopup(feature, ext, completionTime);
    if (text)
      layer.bindPopup(`<div class="map-marker-popup">${text}</div>`, {
        maxWidth: POPUP_WIDTH,
      });
  };

  const createClusterIcon = (cluster) => {
    const childMarkers = cluster.getAllChildMarkers();
    const childCount = childMarkers.length;
    // For each cluster child element, check if completed = true; if so, add to the count.
    const childCompletedCount = childMarkers.reduce(
      (prev, marker) => prev + (marker?.options?.properties?.completed ? 1 : 0),
      0
    );
    const iconUrl = childMarkers[0]?.options?.properties?.iconUrl;

    // const svgTipFill = childCompletedCount / childCount === 1 ? '00EBF4' : 'E6E6E6';
    const iconHTML = `<img class='map-marker-cluster-marker' alt="" src="${
      require('../../images/icons/map_base/marker_cluster.png').default
    }"/><b class="map-marker-cluster-label">${childCompletedCount}/${childCount}</b><img class='map-marker-cluster-img' src='${iconUrl}'/>`;

    return L.divIcon({
      html: iconHTML,
      className: 'map-marker-cluster',
      iconSize: new L.Point(40, 40),
    });
  };

  // If any of these values change, update the map.
  const hashValue = {
    clusterMarkers,
    mapFeature,
    completedIds,
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
  return clusterMarkers ? (
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

const mapStateToProps = (state, { mapFeature, featureKey }) => ({
  clusterMarkers: state.options.clusterMarkers && (mapFeature?.cluster ?? false),
  completedIds: state.completed.features[featureKey],
  completedAlpha: state.options.completedAlpha,

  // Display the feature if the feature is enabled in the controls,
  // and we aren't in the state of (editor on + hide features when editor is on)
  displayed:
    !((state.options.hideFeaturesInEditor ?? false) && (state.editorEnabled ?? false)) &&
    (state.displayed.features[featureKey] ?? false),
});
const mapDispatchToProps = (dispatch, { featureKey }) => ({
  markFeature: (markerId) => dispatch(setFeatureMarkerCompleted(featureKey, markerId)),
  unmarkFeature: (markerId) => dispatch(clearFeatureMarkerCompleted(featureKey, markerId)),
});
const FeatureLayer = connect(mapStateToProps, mapDispatchToProps)(_FeatureLayer);

export default FeatureLayer;
