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
import { MSFFeatureExtended, MSFFeatureKey } from '~/components/data/ElementSchema';
import { MapFeatures } from '~/components/data/MapFeatures';
import { selectIsFeatureDisplayed } from '~/components/redux/slices/displayed';
import { selectHideFeaturesInEditor } from '~/components/redux/slices/options';
import { selectEditorEnabled } from '~/components/redux/slices/ui';
import { AppState } from '~/components/redux/types';

import FeatureMarker from '~/components/views/map/layers/FeatureMarker';
import MapClusterMarker, {
  offClusterFunction,
  onClusterFunction,
  variableClusterFunction,
} from '~/components/views/map/layers/MapClusterMarker';

interface FeatureLayerBaseProps {
  featureKey: MSFFeatureKey;
  mapFeature?: MSFFeatureExtended;
}

const mapStateToProps = (
  state: AppState,
  { featureKey, mapFeature = null }: FeatureLayerBaseProps
) => {
  const hideFeaturesInEditor = selectHideFeaturesInEditor(state);
  const editorEnabled = selectEditorEnabled(state);
  const featureDisplayed = selectIsFeatureDisplayed(state, featureKey);
  return {
    displayed: hideFeaturesInEditor && editorEnabled && featureDisplayed,
    mapFeature: mapFeature !== null ? mapFeature : (MapFeatures[featureKey] as MSFFeatureExtended),
  };
};
const mapDispatchToProps = () => ({});
const connector = connect(mapStateToProps, mapDispatchToProps, (a, b, c) => ({ ...c, ...b, ...a }));

type FeatureLayerProps = ConnectedProps<typeof connector>;

const _FeatureLayer: FunctionComponent<FeatureLayerProps> = ({ displayed, mapFeature }) => {
  const map = useMap();
  const layerRef = useRef<LeafletMarkerClusterGroup>(undefined);

  useEffect(() => {
    if (typeof layerRef.current !== 'undefined') {
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
