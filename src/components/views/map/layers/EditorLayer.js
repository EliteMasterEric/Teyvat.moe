/**
 * Provides the map layer used to display the Editor data on the leaflet map.
 *
 * For the logic managing the placement of markers and routes, see MapEditorHandler.
 */

// Importing these libraries changes the behavior of leaflet to include new functions.
import 'leaflet-editable';
import 'leaflet-textpath';
import React from 'react';
import { connect } from 'react-redux';

import RouteLine from './RouteLine';
import FeatureMarker from './FeatureMarker';

const _EditorLayer = ({ displayed, editorData }) => {
  // TODO: We hide by destroying. Is there a better way?
  if (!displayed) return null;

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

  return editorData.map((element) => {
    const isRoute = element?.coordinates && Array.isArray(element?.coordinates[0]);
    return isRoute ? (
      <RouteLine key={element.id} routeKey={`editor/${element.id}`} route={element} editable />
    ) : (
      <FeatureMarker
        key={`editor/${element.id}`}
        markerKey={`editor/${element.id}`}
        feature={editorFeature}
        marker={element}
        editable
      />
    );
  });
};

const mapStateToProps = (state) => ({
  displayed: state.editorEnabled,
  editorData: state.editor.feature.data,
});
const mapDispatchToProps = (_dispatch) => ({});
const EditorLayer = connect(mapStateToProps, mapDispatchToProps)(_EditorLayer);

export default EditorLayer;
