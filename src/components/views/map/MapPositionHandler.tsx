/**
 * A wrapper which handles changes to the map position.
 *
 * When the user drags the map, the position stored in Redux state should match.
 *
 * Additionally, when the user clicks the Highlight or Locate buttons, the Redux state will change.
 * This should trigger the map to pan accordingly.
 */
import { FunctionComponent, useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import { connect, ConnectedProps } from 'react-redux';
import { AppDispatch } from '~/components/redux';

import { selectMapPosition, setMapPosition } from '~/components/redux/slices/ui';
import { AppState } from '~/components/redux/types';
import { MapPosition } from '~/components/Types';

const mapStateToProps = (state: AppState) => ({
  mapPosition: selectMapPosition(state),
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setPositionAndZoom: (position: MapPosition['latlng'], zoom: MapPosition['zoom']) =>
    dispatch(setMapPosition(position, zoom)),
});
const connector = connect(mapStateToProps, mapDispatchToProps);

type MapPositionHandlerProps = ConnectedProps<typeof connector>;

const _MapPositionHandler: FunctionComponent<MapPositionHandlerProps> = ({
  mapPosition,
  setPositionAndZoom,
}) => {
  /**
   * Every time the user drags or zooms to a position on the map,
   * update the state.
   */
  const map = useMapEvents({
    dragend: () => {
      if (!map) return;
      setPositionAndZoom(map.getCenter(), map.getZoom());
    },
    zoomend: () => {
      if (!map) return;
      setPositionAndZoom(map.getCenter(), map.getZoom());
    },
  });

  /**
   * Move the map whenever the relevant state changes..
   *
   */
  useEffect(() => {
    if (!map) return;

    if (mapPosition.latlng !== map.getCenter() || mapPosition.zoom !== map.getZoom()) {
      map.setView([mapPosition.latlng.lat, mapPosition.latlng.lng], mapPosition.zoom, {
        animate: true,
        duration: 0.25,
        easeLinearity: 0.25,
        noMoveStart: false,
      });
    }
  }, [mapPosition, map]);

  // Has no render effects.
  return null;
};

const MapPositionHandler = connector(_MapPositionHandler);
export default MapPositionHandler;
