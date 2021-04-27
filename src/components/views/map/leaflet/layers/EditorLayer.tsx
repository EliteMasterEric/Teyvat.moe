/**
 * Provides the map layer used to display the Editor data on the leaflet map.
 *
 * For the logic managing the placement of markers and routes, see MapEditorHandler.
 */

// Importing these libraries changes the behavior of leaflet to include new functions.
import 'leaflet-editable';
import 'leaflet-textpath';
import { LayerGroup as LeafletLayerGroup } from 'leaflet';
import _ from 'lodash';
import React, { FunctionComponent, useEffect, useRef } from 'react';
import { LayerGroup, useMap } from 'react-leaflet';
import { connect, ConnectedProps } from 'react-redux';

import { MSFFeatureKey } from 'src/components/data/map/Element';
import { EditorRoute } from 'src/components/preferences/map/EditorDataSchema';
import { selectEditorFeatureData } from 'src/components/redux/slices/map/editor/Selector';
import { selectEditorEnabled } from 'src/components/redux/slices/map/interface/Selector';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';
import FeatureMarker from 'src/components/views/map/leaflet/layers/FeatureMarker';
import RouteLine from 'src/components/views/map/leaflet/layers/RouteLine';

// Type guards.
const distinguishRoute = (value: any): value is EditorRoute => {
  return _.isArray((value as EditorRoute).coordinates[0]);
};

const mapStateToProps = (state: AppState) => ({
  displayed: selectEditorEnabled(state),
  editorData: selectEditorFeatureData(state),
});
type EditorLayerStateProps = ReturnType<typeof mapStateToProps>;
const connector = connect<EditorLayerStateProps, Empty, Empty, AppState>(mapStateToProps);

type EditorLayerProps = ConnectedProps<typeof connector>;

const _EditorLayer: FunctionComponent<EditorLayerProps> = ({ displayed, editorData }) => {
  const map = useMap();
  const layerReference = useRef<LeafletLayerGroup | null>(null);

  useEffect(() => {
    if (layerReference.current !== null) {
      if (displayed) {
        layerReference.current.addTo(map);
      } else {
        layerReference.current.removeFrom(map);
      }
    }
  }, [map, displayed]);

  return (
    <LayerGroup ref={layerReference}>
      {_.map(editorData, (element) => {
        return distinguishRoute(element) ? (
          <RouteLine key={element.id} route={element} editable />
        ) : (
          <FeatureMarker
            key={element.id}
            marker={element}
            featureKey={'editor' as MSFFeatureKey}
            editable
            icons={null}
            allowExternalMedia
          />
        );
      })}
    </LayerGroup>
  );
};

const EditorLayer = connector(_EditorLayer);

export default EditorLayer;
