/**
 * Provides the map layer used to display a Feature on the leaflet map.
 */

// Its very presence changes the behavior of L.
import 'leaflet.markercluster';
import { MarkerClusterGroup as LeafletMarkerClusterGroup } from 'leaflet';
import _ from 'lodash';
import React, { FunctionComponent, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { connect, ConnectedProps } from 'react-redux';
import { MSFFeatureExtended, MSFFeatureKey } from 'src/components/data/Element';
import { getMapFeature } from 'src/components/data/MapFeatures';
import { selectIsFeatureDisplayed } from 'src/components/redux/slices/displayed';
import { selectHideFeaturesInEditor } from 'src/components/redux/slices/options';
import { selectEditorEnabled } from 'src/components/redux/slices/ui';
import { AppState } from 'src/components/redux/types';

import FeatureMarker from 'src/components/views/map/layers/FeatureMarker';
import MapClusterMarker, {
  offClusterFunction,
  onClusterFunction,
  variableClusterFunction,
} from 'src/components/views/map/layers/MapClusterMarker';

interface FeatureLayerBaseProps {
  featureKey: MSFFeatureKey;
  mapFeature?: MSFFeatureExtended;
}

const mapStateToProps = (state: AppState, { featureKey, mapFeature }: FeatureLayerBaseProps) => {
  const hideFeaturesInEditor = selectHideFeaturesInEditor(state);
  const editorEnabled = selectEditorEnabled(state);
  const shouldDisplayAnyFeatures = !editorEnabled || (hideFeaturesInEditor && editorEnabled);

  const featureDisplayed = selectIsFeatureDisplayed(state, featureKey);
  return {
    displayed: featureDisplayed && shouldDisplayAnyFeatures,
    mapFeature: mapFeature != null ? mapFeature : (getMapFeature(featureKey) as MSFFeatureExtended),
  };
};
const mapDispatchToProps = () => ({});
type FeatureLayerStateProps = ReturnType<typeof mapStateToProps>;
type FeatureLayerDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  FeatureLayerStateProps,
  FeatureLayerDispatchProps,
  FeatureLayerBaseProps,
  AppState
>(mapStateToProps, mapDispatchToProps);

type FeatureLayerProps = ConnectedProps<typeof connector> & FeatureLayerBaseProps;

const _FeatureLayer: FunctionComponent<FeatureLayerProps> = ({ displayed, mapFeature }) => {
  const map = useMap();
  const layerRef = useRef<LeafletMarkerClusterGroup | null>(null);

  useEffect(() => {
    if (layerRef.current != null) {
      if (displayed) {
        layerRef.current.addTo(map);
      } else {
        layerRef.current.removeFrom(map);
      }
    }
  }, [map, displayed]);

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
        <MapClusterMarker ref={layerRef} clusterFunction={clusterFunction}>
          {mapFeature.data.map((marker) => {
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
