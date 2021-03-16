/**
 * Provides the map layer used to display the Editor data on the leaflet map.
 *
 * For the logic managing the placement of markers and routes, see MapEditorHandler.
 */

// Importing these libraries changes the behavior of leaflet to include new functions.
import 'leaflet-editable';
import 'leaflet-textpath';
import { LayerGroup as LeafletLayerGroup } from 'leaflet';
import React, { useEffect, useRef } from 'react';
import { LayerGroup, useMap } from 'react-leaflet';
import { connect } from 'react-redux';

import { selectEditorFeatureData } from '~/components/redux/slices/editor';
import { selectEditorEnabled } from '~/components/redux/slices/ui';
import FeatureMarker from '~/components/views/map/layers/FeatureMarker';
import RouteLine from '~/components/views/map/layers/RouteLine';
import { MSFRouteKey } from '~/components/data/ElementSchema';

const _EditorLayer = ({ displayed, editorData }) => {
  const map = useMap();
  const layerRef = useRef<LeafletLayerGroup>(undefined);

  useEffect(() => {
    if (typeof layerRef.current !== 'undefined') {
      if (displayed) {
        layerRef.current.addTo(map);
      } else {
        layerRef.current.removeFrom(map);
      }
    }
  }, [map, displayed]);

  const editorFeature = {
    icons: {
      base: {
        marker: true,
      },
      done: {
        marker: true,
      },
    },
  };

  return (
    <LayerGroup ref={layerRef}>
      {editorData.map((element) => {
        const isRoute = element?.coordinates && Array.isArray(element?.coordinates[0]);
        return isRoute ? (
          <RouteLine
            key={element.id}
            routeKey={`editor/${element.id}` as MSFRouteKey}
            route={element}
            editable
          />
        ) : (
          <FeatureMarker
            key={element.id}
            marker={element}
            featureKey="editor"
            editable
            allowExternalMedia
          />
        );
      })}
    </LayerGroup>
  );
};

const mapStateToProps = (state) => ({
  displayed: selectEditorEnabled(state),
  editorData: selectEditorFeatureData(state),
});
const mapDispatchToProps = () => ({});
const EditorLayer = connect(mapStateToProps, mapDispatchToProps)(_EditorLayer);

export default EditorLayer;
