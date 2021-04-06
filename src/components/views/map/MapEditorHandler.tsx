import leaflet from 'leaflet';
// Its presence modifies the behavior of Leaflet.
import 'leaflet-editable';
import 'leaflet-textpath';
import _ from 'lodash';
import { FunctionComponent, MouseEventHandler, useEffect, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
import { connect, ConnectedProps } from 'react-redux';

import {
  MSFCoordinate,
  MSFLocalizedString,
  MSFMarkerID,
  MSFPopupContent,
  MSFPopupTitle,
  MSFRouteID,
} from 'src/components/data/Element';
import { DEFAULT_ROUTE_COLOR, DEFAULT_ROUTE_TEXT } from 'src/components/data/MapRoutes';
import { EditorMarker, EditorRoute } from 'src/components/preferences/EditorDataSchema';
import { AppDispatch } from 'src/components/redux';
import {
  appendMarker,
  appendRoute,
  editMarker,
  editRoute,
} from 'src/components/redux/slices/editor';
import { AppState } from 'src/components/redux/types';
import { Empty } from 'src/components/Types';
import { filterNotEmpty, hashObject, truncateFloat } from 'src/components/util';
import EditorControls from 'src/components/views/map/EditorControls';
import { lineProperties, lineTextProperties } from 'src/components/views/map/LayerConstants';
import { editorMarkerHighlight } from 'src/components/views/map/layers/FeatureIcon';

const MARKER_OPTIONS = {
  icon: editorMarkerHighlight,
};

const CONTROL_KEYS = ['ControlLeft', 'ControlRight', 'MetaLeft', 'MetaRight'];

// Type guards.
const distinguishMarker = (value: any): value is leaflet.Marker => {
  return !!(value as leaflet.Marker).getLatLng;
};
const distinguishPolyline = (value: any): value is leaflet.Polyline => {
  return !!(value as leaflet.Polyline).getLatLngs;
};
const distinguishVertexEvent = (value: any): value is leaflet.VertexEvent => {
  return !!(value as leaflet.VertexEvent).vertex;
};

type EditorState = 'none' | 'createMarker' | 'createRoute' | 'editMarker' | 'editRoute';

const mapStateToProps = (_state: AppState) => ({});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  appendMarker: (data: EditorMarker) => dispatch(appendMarker(data)),
  appendRoute: (data: EditorRoute) => dispatch(appendRoute(data)),
  moveMarker: (id: MSFMarkerID, newCoords: EditorMarker['coordinates']) => {
    dispatch(editMarker(id, 'coordinates', newCoords));
    dispatch(editMarker(id, 'id', hashObject(newCoords)));
  },
  moveRoute: (id: MSFRouteID, newCoordsList: EditorRoute['coordinates']) => {
    // setElementProperty(<id of element to change>, <property to change>, <new value>)
    dispatch(editRoute(id, 'coordinates', newCoordsList));
    dispatch(editRoute(id, 'id', hashObject(newCoordsList)));
  },
});
type MapEditorHandlerStateProps = ReturnType<typeof mapStateToProps>;
type MapEditorHandlerDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  MapEditorHandlerStateProps,
  MapEditorHandlerDispatchProps,
  Empty,
  AppState
>(mapStateToProps, mapDispatchToProps);

type MapEditorHandlerProps = ConnectedProps<typeof connector>;

const _MapEditorHandler: FunctionComponent<MapEditorHandlerProps> = ({
  appendMarker,
  appendRoute,
  moveMarker,
  moveRoute,
}) => {
  // A separate state must be used because the type of currentEditable can't be determined
  // just by looking at it.
  const [editorState, setEditorState] = useState<EditorState>('none');
  const [currentEditable, setCurrentEditable] = useState<leaflet.Marker | leaflet.Polyline | null>(
    null
  );

  // Maintain the state of the CTRL key through event listeners.
  const [ctrlHeld, setCtrlHeld] = useState<boolean>(false);
  const onKeyDown = (e: KeyboardEvent) => {
    if (CONTROL_KEYS.includes(e.code)) {
      setCtrlHeld(true);
    }
  };
  const onKeyUp = (e: KeyboardEvent) => {
    if (CONTROL_KEYS.includes(e.code)) {
      setCtrlHeld(false);
    }
  };
  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    return () => {
      // Cleanup when this element is unloaded.
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  });

  const placeMarker = (editable: leaflet.Marker) => {
    const latlng = editable.getLatLng();

    // Note this is not reversed because it corresponds to direct map coordinates.
    const latlngFormatted: MSFCoordinate = [
      truncateFloat(latlng.lat, 5),
      truncateFloat(latlng.lng, 5),
    ];
    const id = hashObject(latlngFormatted) as MSFMarkerID;
    const popupTitle = { en: '' as MSFLocalizedString } as MSFPopupTitle;
    const popupContent = { en: '' as MSFLocalizedString } as MSFPopupContent;

    // Switched to MSFv2.
    const newMarker = {
      coordinates: latlngFormatted,
      id,
      popupTitle,
      popupContent,
      popupAttribution: 'Unknown',
      popupMedia: '',
    };

    appendMarker(newMarker);
    // Done later.
    // setEditorState('none');
    // setCurrentEditable(null);
  };

  const placeRoute = (editable: leaflet.Polyline) => {
    const latlngs = editable.getLatLngs();
    if (latlngs[0] == null) return;

    const filterLatLng = (latlng: any): latlng is leaflet.LatLng => {
      return !Array.isArray(latlng);
    };
    const latlngsFiltered = _.filter(latlngs, filterLatLng);

    // Note this is not reversed because it corresponds to direct map coordinates.
    const latlngsFormatted = latlngsFiltered
      .map(
        (latlng: leaflet.LatLng): MSFCoordinate => {
          const result: MSFCoordinate = [
            truncateFloat(latlng.lat, 5),
            truncateFloat(latlng.lng, 5),
          ];
          return result;
        }
      )
      .filter(filterNotEmpty);
    if (latlngsFormatted.length == 0) return;

    const id = hashObject(latlngsFormatted);
    const popupTitle = { en: '' as MSFLocalizedString } as MSFPopupTitle;
    const popupContent = { en: '' as MSFLocalizedString } as MSFPopupContent;

    // Switched to MSFv2.
    const newRoute = {
      coordinates: latlngsFormatted,
      id: id as MSFRouteID,
      routeColor: DEFAULT_ROUTE_COLOR,
      routeText: DEFAULT_ROUTE_TEXT,
      popupTitle,
      popupContent,
      popupAttribution: 'Unknown',
      popupMedia: '',
    };
    appendRoute(newRoute);
  };

  const updateRoute = (event: leaflet.VertexEvent) => {
    const { id: routeID } = event.layer.options;

    const newRouteLatLngs = event.vertex.latlngs.map(
      (vertex): MSFCoordinate => [truncateFloat(vertex.lat, 5), truncateFloat(vertex.lng, 5)]
    );

    moveRoute(routeID.split('/')[1], newRouteLatLngs);
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

      setCurrentEditable(event.propagatedFrom);
      setEditorState('editMarker');
    },

    'editable:dragend': (event) => {
      // If the current mode is 'editMarker', call our override function,
      // and cancel the event that would occur.

      if (editorState === 'editMarker') {
        const { id: markerID } = event.propagatedFrom.options;

        // eslint-disable-next-line no-underscore-dangle
        const { _latlng: latlng } = event.propagatedFrom;

        const newCoords: MSFCoordinate = [
          truncateFloat(latlng.lat, 5),
          truncateFloat(latlng.lng, 5),
        ];

        moveMarker(markerID.split('/')[1], newCoords);
        setEditorState('none');
        setCurrentEditable(null);
      }
    },

    'editable:vertex:dragstart': (event) => {
      setCurrentEditable(event.propagatedFrom);
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
      const { id: routeID } = event.layer.options;

      const newRouteLatLngs = event.vertex.latlngs.map(
        (vertex): MSFCoordinate => [truncateFloat(vertex.lat, 5), truncateFloat(vertex.lng, 5)]
      );

      moveRoute(routeID.split('/')[1], newRouteLatLngs);
      setEditorState('none');
      setCurrentEditable(null);
    },

    'editable:drawing:commit': (event) => {
      if (editorState === 'none' || currentEditable == null) {
        return;
      }

      if (editorState === 'editRoute' && distinguishVertexEvent(event)) {
        updateRoute(event);
        return;
      }

      if (editorState === 'createRoute' && distinguishPolyline(currentEditable)) {
        placeRoute(currentEditable);
        return;
      }

      if (editorState === 'createMarker' && distinguishMarker(currentEditable)) {
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
          const editable = map.editTools.startMarker(undefined, MARKER_OPTIONS);
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
  useEffect(() => {
    if (!ctrlHeld && editorState === 'createMarker') {
      map.editTools.stopDrawing();
    }
  }, [ctrlHeld, map.editTools, editorState]);

  const startEditorMarker = () => {
    setEditorState('createMarker');
    const editable = map.editTools.startMarker(undefined, MARKER_OPTIONS);
    setCurrentEditable(editable);
  };

  const startEditorRoute = () => {
    setEditorState('createRoute');
    const editable = map.editTools.startPolyline(undefined, lineProperties);
    editable.setText('  ►  ', lineTextProperties);
    setCurrentEditable(editable);
  };

  const commitDrawing: MouseEventHandler<HTMLDivElement> = (event) => {
    // Let's hope this doesn't break things.
    const leafletEvent = (event as unknown) as leaflet.LeafletMouseEvent;
    // Finish the current drawing, saving any data it had.
    map.editTools.commitDrawing(leafletEvent);
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

const MapEditorHandler = connector(_MapEditorHandler);

export default MapEditorHandler;
