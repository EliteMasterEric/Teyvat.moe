/**
 * Provides the map layer used to display the Editor data on the leaflet map.
 *
 * For the logic managing the placement of markers and routes, see MapEditorHandler.
 */

// Importing these libraries changes the behavior of leaflet to include new functions.
import 'leaflet-editable';
import 'leaflet-textpath';
import { LayerGroup as LeafletLayerGroup } from 'leaflet';
import React, { FunctionComponent, useEffect, useRef } from 'react';
import { LayerGroup, useMap } from 'react-leaflet';
import { connect, ConnectedProps } from 'react-redux';

import { MSFFeatureKey } from 'src/components/data/ElementSchema';
import { EditorRoute } from 'src/components/preferences/EditorDataSchema';
import { selectEditorFeatureData } from 'src/components/redux/slices/editor';
import { selectEditorEnabled } from 'src/components/redux/slices/ui';
import { AppState } from 'src/components/redux/types';
import { Empty } from 'src/components/Types';
import FeatureMarker from 'src/components/views/map/layers/FeatureMarker';
import RouteLine from 'src/components/views/map/layers/RouteLine';

// Type guards.
const distinguishRoute = (value: any): value is EditorRoute => {
  return Array.isArray((value as EditorRoute).coordinates[0]);
};

const mapStateToProps = (state: AppState) => ({
  displayed: selectEditorEnabled(state),
  editorData: selectEditorFeatureData(state),
});
const mapDispatchToProps = () => ({});
type EditorLayerStateProps = ReturnType<typeof mapStateToProps>;
type EditorLayerDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<EditorLayerStateProps, EditorLayerDispatchProps, Empty, AppState>(
  mapStateToProps,
  mapDispatchToProps
);

type EditorLayerProps = ConnectedProps<typeof connector>;

const _EditorLayer: FunctionComponent<EditorLayerProps> = ({ displayed, editorData }) => {
  const map = useMap();
  const layerRef = useRef<LeafletLayerGroup | null>(null);

  useEffect(() => {
    if (layerRef.current !== null) {
      if (displayed) {
        layerRef.current.addTo(map);
      } else {
        layerRef.current.removeFrom(map);
      }
    }
  }, [map, displayed]);

  return (
    <LayerGroup ref={layerRef}>
      {editorData.map((element) => {
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
