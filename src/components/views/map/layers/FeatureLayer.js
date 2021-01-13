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
} from '~/components/views/map/MapCluster';

const _FeatureLayer = ({
  mapFeature,
  featureKey,

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
        <MapCluster legacy={mapFeature.format !== 2} clusterFunction={clusterFunction}>
          {mapFeature.data.map((marker) => {
            return (
              <FeatureMarker
                key={marker.id}
                marker={marker}
                feature={mapFeature}
                featureKey={featureKey}
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
});
const mapDispatchToProps = (_dispatch) => ({});
const FeatureLayer = connect(mapStateToProps, mapDispatchToProps)(_FeatureLayer);

export default FeatureLayer;
