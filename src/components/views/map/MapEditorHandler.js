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

const MARKER_OPTIONS = {
  icon: editorMarkerHighlight,
};

const CONTROL_KEYS = ['ControlLeft', 'ControlRight', 'MetaLeft', 'MetaRight'];

const _MapEditorHandler = ({ appendMarker, appendRoute, moveMarker, moveRoute }) => {
  // A separate state must be used because the type of currentEditable can't be determined
  // just by looking at it.
  const [editorState, setEditorState] = React.useState('none');
  const [currentEditable, setCurrentEditable] = React.useState(null);

  // Maintain the state of the CTRL key through event listeners.
  const [ctrlHeld, setCtrlHeld] = React.useState(false);
  const onKeyDown = (e) => {
    if (CONTROL_KEYS.includes(e.code)) {
      setCtrlHeld(true);
    }
  };
  const onKeyUp = (e) => {
    if (CONTROL_KEYS.includes(e.code)) {
      setCtrlHeld(false);
    }
  };
  React.useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    return () => {
      // Cleanup when this element is unloaded.
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  });

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
    // Done later.
    // setEditorState('none');
    // setCurrentEditable(null);
  };

  const placeRoute = (editable) => {
    const { _latlngs: latlngs } = editable;
    // Note this is not reversed because it corresponds to direct map coordinates.
    const latlngsFormatted = latlngs.map((latlng) => [
      truncateFloat(latlng?.lat, 5),
      truncateFloat(latlng?.lng, 5),
    ]);
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
    // setEditorState('none');
    // setCurrentEditable(null);
  };

  const updateRoute = (event) => {
    const { id: routeId } = event.layer.options;
    const newRouteLatLngs = event.vertex.latlngs.map((vertex) => [
      truncateFloat(vertex.lat, 5),
      truncateFloat(vertex.lng, 5),
    ]);

    moveRoute(routeId.split('/')[1], newRouteLatLngs);
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
      setEditorState('editMarker');
    },

    'editable:dragend': (event) => {
      // If the current mode is 'editMarker', call our override function,
      // and cancel the event that would occur.

      if (editorState === 'editMarker') {
        const { id: markerId } = event.layer.options;

        // eslint-disable-next-line no-underscore-dangle
        const { _latlng: latlng } = event.layer;

        const newCoords = [truncateFloat(latlng.lat, 5), truncateFloat(latlng.lng, 5)];

        moveMarker(markerId.split('/')[1], newCoords);
        setEditorState('none');
        setCurrentEditable(null);
      }
    },

    'editable:vertex:dragstart': (event) => {
      setCurrentEditable(event.layer);
      setEditorState('editRoute');
    },

    'editable:vertex:dragend': (event) => {
      // If the current mode is 'editMarker', call our override function,
      // and cancel the event that would occur.

      if (editorState === 'editRoute') {
        updateRoute(event);
      }
    },

    'editable:vertex:click': (event) => {
      // CTRL-Click to continue a line.
      if (ctrlHeld) {
        setEditorState('editRoute');
        event.vertex.continue();
      }
    },

    'editable:vertex:deleted': (event) => {
      // Delete a vertex when it is clicked.

      const { id: routeId } = event.layer.options;
      const newRouteLatLngs = event.vertex.latlngs.map((vertex) => [
        truncateFloat(vertex.lat, 5),
        truncateFloat(vertex.lng, 5),
      ]);

      moveRoute(routeId.split('/')[1], newRouteLatLngs);
      setEditorState('none');
      setCurrentEditable(null);
    },

    'editable:drawing:commit': (event) => {
      if (editorState === 'editRoute') {
        updateRoute(event);
        return;
      }

      if (editorState === 'createRoute') {
        placeRoute(currentEditable);
        return;
      }

      if (editorState === 'createMarker') {
        placeMarker(currentEditable);
      }
    },

    'editable:drawing:end': (event) => {
      // Drawing has been ended. Remove the layer.
      // If the layer was drawn successfully, it will have been added
      // to the editor data in editable:drawing:commit.
      event.layer.remove();

      if (editorState === 'createMarker') {
        if (ctrlHeld) {
          // Place an additional marker.
          const editable = map.editTools.startMarker(null, MARKER_OPTIONS);
          setCurrentEditable(editable);
          // return;
        }
      } else {
        // Else, fall through and finish off the current marker.
        setEditorState('none');
        setCurrentEditable(null);
      }
    },
  });

  // Releasing Control will end the current drawing.
  React.useEffect(() => {
    if (!ctrlHeld && editorState === 'createMarker') {
      map.editTools.stopDrawing();
    }
  }, [ctrlHeld, map.editTools]);

  const startEditorMarker = () => {
    setEditorState('createMarker');
    const editable = map.editTools.startMarker(null, MARKER_OPTIONS);
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
    // setElementProperty(<id of element to change>, <property to change>, <new value>)
    dispatch(setElementProperty(id, 'coordinates', newCoordsList));
    dispatch(setElementProperty(id, 'id', hashObject(newCoordsList)));
  },
});
const MapEditorHandler = connect(mapStateToProps, mapDispatchToProps)(_MapEditorHandler);

export default MapEditorHandler;
