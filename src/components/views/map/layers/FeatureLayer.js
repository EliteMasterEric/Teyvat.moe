/**
 * Provides the map layer used to display a Feature on the leaflet map.
 */

// Its very presence changes the behavior of L.
import 'leaflet.markercluster';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import FeatureMarker from '~/components/views/map/layers/FeatureMarker';
import MapCluster, {
  offClusterFunction,
  onClusterFunction,
  variableClusterFunction,
} from '~/components/views/map/layers/MapCluster';

const _FeatureLayer = ({
  mapFeature,
  featureKey,
  completed,

  displayed,
}) => {
  // TODO: We hide by destroying. Is there a better way?
  if (!displayed) return null;

  // Choose the proper clustering function.
  let clusterFunction = null;
  switch (mapFeature.cluster) {
    case 'variable':
      clusterFunction = variableClusterFunction;
      break;
    case 'off':
      clusterFunction = offClusterFunction;
      break;
    case 'on':
    default:
      clusterFunction = onClusterFunction;
      break;
  }

  switch (mapFeature.format) {
    case 2:
      return (
        <MapCluster
          legacy={mapFeature.format === 1}
          clusterFunction={clusterFunction}
          completed={completed}
        >
          {mapFeature.data.map((marker) => {
            return (
              <FeatureMarker
                key={`${featureKey}/${marker.id}`}
                markerKey={`${featureKey}/${marker.id}`}
                feature={mapFeature}
                marker={marker}
              />
            );
          })}
        </MapCluster>
      );
    default:
      return null;
  }
};

const mapStateToProps = (state, { featureKey }) => ({
  // Display the feature if the feature is enabled in the controls,
  // and we aren't in the state of (editor on + hide features when editor is on)
  displayed:
    !((state.options.hideFeaturesInEditor ?? false) && (state.editorEnabled ?? false)) &&
    (state.displayed.features[featureKey] ?? false),
  completed: _.filter(_.keys(state.completed.features), (key) => key.startsWith(featureKey)),
});
const mapDispatchToProps = (_dispatch) => ({});
const FeatureLayer = connect(mapStateToProps, mapDispatchToProps)(_FeatureLayer);

export default FeatureLayer;
