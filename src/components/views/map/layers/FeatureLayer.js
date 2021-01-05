/**
 * Provides the map layer used to display a Feature on the leaflet map.
 */

import L from 'leaflet';
// Its very presence changes the behavior of L.
import 'leaflet.markercluster';
import _ from 'lodash';
import React from 'react';
import { GeoJSON } from 'react-leaflet';
import { connect } from 'react-redux';

import { createMapIcon } from '~/components/data/MapFeaturesData';
import { useImageExtension } from '~/components/interface/Image';
import { hashObject } from '~/components/Util';
import FeatureMarker from '~/components/views/map/layers/FeatureMarker';
import MapCluster, {
  offClusterFunction,
  onClusterFunction,
  variableClusterFunction,
} from '~/components/views/map/MapCluster';
import { buildPopup, POPUP_WIDTH } from '~/components/views/map/MapPopupLegacy';
import store from '~/redux';
import { clearFeatureMarkerCompleted, setFeatureMarkerCompleted } from '~/redux/ducks/completed';

const _FeatureLayer = ({
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
          ...mapFeature?.icons?.done,
          ext: mapFeature?.icons?.done?.svg ?? false ? 'svg' : ext,
          key: mapFeature.icons.done.key ?? mapFeature.icons.filter,
          completed: true,
        })
      : createMapIcon({
          ...mapFeature?.icons?.base,
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
    // If the editor is not enabled, don't mark as completed.
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

  // If any of these values change, update the map.
  // Only used for legacy GeoJSON features.
  const hashValue = {
    clusterMarkers,
    mapFeature,
    completedIds,
  };

  // Choose the proper clustering function.
  let clusterFunction = null;
  switch (mapFeature.cluster) {
    case 'on':
      clusterFunction = onClusterFunction;
      break;
    case 'variable':
      clusterFunction = variableClusterFunction;
      break;
    case 'off':
    default:
      clusterFunction = offClusterFunction;
      break;
  }

  const dataView =
    mapFeature.format === 2 ? (
      mapFeature.data.map((marker) => {
        return (
          <FeatureMarker
            marker={marker}
            feature={mapFeature}
            completed={completedIds[marker.id]}
            markFeature={() => markFeature(marker.id)}
            unmarkFeature={() => unmarkFeature(marker.id)}
          />
        );
      })
    ) : (
      <GeoJSON
        key={hashObject(hashValue)}
        data={mapFeature.data}
        pointToLayer={pointToLayer}
        onEachFeature={onEachFeature}
      />
    );

  // Cluster if enabled by the user and the feature type supports it.
  return <MapCluster clusterFunction={clusterFunction}>{dataView}</MapCluster>;
};

const mapStateToProps = (state, { mapFeature, featureKey }) => ({
  clusterMarkers: state.options.clusterMarkers && (mapFeature?.cluster ?? false),
  completedIds: state.completed.features[featureKey] ?? [],

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
