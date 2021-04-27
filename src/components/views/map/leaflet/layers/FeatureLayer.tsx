/**
 * Provides the map layer used to display a Feature on the leaflet map.
 */

// Its very presence changes the behavior of L.
import 'leaflet.markercluster';
import { MarkerClusterGroup as LeafletMarkerClusterGroup } from 'leaflet';
import _ from 'lodash';
import React, { FunctionComponent, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MSFFeatureExtended, MSFFeatureKey } from 'src/components/data/map/Element';
import { getMapFeature } from 'src/components/data/map/MapFeatures';
import { selectIsFeatureDisplayed } from 'src/components/redux/slices/map/displayed/Selector';
import { selectEditorEnabled } from 'src/components/redux/slices/map/interface/Selector';
import { selectHideFeaturesInEditor } from 'src/components/redux/slices/map/options/Selector';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';
import FeatureMarker from 'src/components/views/map/leaflet/layers/FeatureMarker';
import MapClusterMarker, {
  offClusterFunction,
  onClusterFunction,
  variableClusterFunction,
} from 'src/components/views/map/leaflet/layers/MapClusterMarker';

interface FeatureLayerBaseProps {
  featureKey: MSFFeatureKey;
  mapFeature?: MSFFeatureExtended;
}

const mapStateToProps = (state: AppState, { featureKey, mapFeature }: FeatureLayerBaseProps) => {
  const hideFeaturesInEditor = selectHideFeaturesInEditor(state);
  const editorEnabled = selectEditorEnabled(state);
  const shouldDisplayAnyFeatures = !(hideFeaturesInEditor && editorEnabled);

  const featureDisplayed = selectIsFeatureDisplayed(state, featureKey);
  return {
    displayed: featureDisplayed && shouldDisplayAnyFeatures,
    mapFeature: mapFeature != null ? mapFeature : (getMapFeature(featureKey) as MSFFeatureExtended),
  };
};
type FeatureLayerStateProps = ReturnType<typeof mapStateToProps>;
const connector = connect<FeatureLayerStateProps, Empty, FeatureLayerBaseProps, AppState>(
  mapStateToProps
);

type FeatureLayerProps = ConnectedProps<typeof connector> & FeatureLayerBaseProps;

const _FeatureLayer: FunctionComponent<FeatureLayerProps> = ({ displayed, mapFeature }) => {
  const layerReference = useRef<LeafletMarkerClusterGroup | null>(null);

  // TODO: Is there an ideal way to do this?
  // Simply using display=none means that all markers get loaded
  // before the page can load, but returning null
  // means the markers get reloaded when the layer is re-enabled.
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
        <MapClusterMarker ref={layerReference} clusterFunction={clusterFunction}>
          {_.map(mapFeature.data, (marker) => {
            return (
              <FeatureMarker
                key={marker.id}
                marker={marker}
                featureKey={mapFeature.key}
                icons={mapFeature.icons}
              />
            );
          })}
        </MapClusterMarker>
      );
    default:
      return null;
  }
};

const FeatureLayer = connector(_FeatureLayer);

export default FeatureLayer;
