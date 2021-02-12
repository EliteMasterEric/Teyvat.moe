import React from 'react';
import { useMapEvents } from 'react-leaflet';
import { connect } from 'react-redux';

// Its presence modifies the behavior of Leaflet.
import 'leaflet-editable';

import EditorControls from '~/components/views/map/EditorControls';
import {
  editorMarkerHighlight,
  lineProperties,
  lineTextProperties,
} from '~/components/views/map/LayerConstants';
import { appendElement, setElementProperty } from '~/redux/ducks/editor';
import { hashObject, truncateFloat } from '~/components/Util';

const _MapEditorHandler = ({ appendMarker, appendRoute, moveMarker, moveRoute }) => {
  // A separate state must be used because the type of currentEditable can't be determined
  // just by looking at it.
  const [editorState, setEditorState] = React.useState('none');
  const [currentEditable, setCurrentEditable] = React.useState(null);

  const placeMarker = (editable) => {
    const { _latlng: latlng } = editable;

    // Note this is not reversed because it corresponds to direct map coordinates.
    const latlngFormatted = [truncateFloat(latlng?.lat, 5), truncateFloat(latlng?.lng, 5)];
    const id = hashObject(latlngFormatted);

    // Switched to MSFv2.
    const newMarker = {
      coordinates: latlngFormatted,
      id,
      popupTitle: { en: '' },
      popupContent: { en: '' },
      popupAttribution: 'Unknown',
      popupMedia: '',
    };

    appendMarker(newMarker);
    setEditorState('none');
    setCurrentEditable(null);
  };

  const placeRoute = (editable) => {
    const { _latlngs: latlngs } = editable;
    // Note this is not reversed because it corresponds to direct map coordinates.
    const latlngsFormatted = latlngs.map((latlng) => [latlng?.lat, latlng?.lng]);
    const id = hashObject(latlngsFormatted);

    // Switched to MSFv2.
    const newRoute = {
      coordinates: latlngsFormatted,
      id,
      routeColor: '#d32f2f',
      routeText: '  ►  ',
      popupTitle: { en: '' },
      popupContent: { en: '' },
      popupAttribution: 'Unknown',
      popupMedia: '',
    };
    appendRoute(newRoute);
    setEditorState('none');
    setCurrentEditable(null);
  };

  /**
   * Every time the user edits a marker on the map, update the state.
   */
  const map = useMapEvents({
    // Events from Leaflet.Editable
    'editable:dragstart': (event) => {
      // Called when starting to drag a marker.

      setCurrentEditable(event.layer);
      setEditorState('dragMarker');
    },

    'editable:dragend': (event) => {
      // If the current mode is 'dragMarker', call our override function,
      // and cancel the event that would occur.

      if (editorState === 'dragMarker') {
        const { id: markerId } = event.layer.options;

        // eslint-disable-next-line no-underscore-dangle
        const { _latlng: latlng } = event.layer;

        const newCoords = [latlng.lat, latlng.lng];

        moveMarker(markerId.split('/')[1], newCoords);
        setEditorState('none');
        setCurrentEditable(null);
      }
    },

    'editable:vertex:dragstart': (event) => {
      setCurrentEditable(event.layer);
      setEditorState('dragRoute');
    },

    'editable:vertex:dragend': (event) => {
      // If the current mode is 'dragMarker', call our override function,
      // and cancel the event that would occur.

      if (editorState === 'dragRoute') {
        const { id: routeId } = event.layer.options;
        const newRouteLatLngs = event.vertex.latlngs.map((vertex) => [vertex.lat, vertex.lng]);

        moveRoute(routeId.split('/')[1], newRouteLatLngs);
        setEditorState('none');
        setCurrentEditable(null);
      }
    },

    'editable:drawing:commit': (_event) => {
      console.log('drawing commit');
      if (editorState === 'createRoute') {
        placeRoute(currentEditable);
        return;
      }

      if (editorState === 'createMarker') {
        placeMarker(currentEditable);

        // CTRL-click to place an additional marker.
        // if (event.originalEvent.ctrlKey) {
      }
    },

    'editable:drawing:end': (event) => {
      // Drawing has been ended. Remove the layer.
      // If the layer was drawn successfully, it will have been added
      // to the editor data in editable:drawing:commit.
      event.layer.remove();
    },
  });

  const startEditorMarker = () => {
    setEditorState('createMarker');
    const editable = map.editTools.startMarker(null, {
      icon: editorMarkerHighlight,
    });
    setCurrentEditable(editable);
  };

  const startEditorRoute = () => {
    setEditorState('createRoute');
    const editable = map.editTools.startPolyline(null, lineProperties);
    editable.setText('  ►  ', lineTextProperties);
    setCurrentEditable(editable);
  };

  const commitDrawing = (event) => {
    // Finish the current drawing, saving any data it had.
    map.editTools.commitDrawing(event);
    setEditorState('none');
    setCurrentEditable(null);
  };

  /**
   * Cancel drawing the current element.
   */
  const cancelDrawing = () => {
    // Cancel the current drawing, dumping any data it had.
    map.editTools.stopDrawing();
    setEditorState('none');
    setCurrentEditable(null);
  };

  // Render the controls which allow placing the markers and routes.
  return (
    <>
      <EditorControls
        startEditorMarker={startEditorMarker}
        startEditorRoute={startEditorRoute}
        cancelEditor={cancelDrawing}
        commitEditor={commitDrawing}
        showCancel={['createMarker', 'createRoute'].includes(editorState)}
        showDone={['createRoute'].includes(editorState)}
      />
    </>
  );
};

const mapStateToProps = (_state) => ({});
const mapDispatchToProps = (dispatch) => ({
  appendMarker: (data) => dispatch(appendElement(data)),
  appendRoute: (data) => dispatch(appendElement(data)),
  moveMarker: (id, newCoords) => {
    dispatch(setElementProperty(id, 'coordinates', newCoords));
    dispatch(setElementProperty(id, 'id', hashObject(newCoords)));
  },
  moveRoute: (id, newCoordsList) => {
    dispatch(setElementProperty(id, 'coordinates', newCoordsList));
    dispatch(setElementProperty(id, 'id', hashObject(newCoordsList)));
  },
});
const MapEditorHandler = connect(mapStateToProps, mapDispatchToProps)(_MapEditorHandler);

export default MapEditorHandler;
