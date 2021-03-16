/**
 * Provides the map layer used to display a Route on the leaflet map.
 */

// Importing these libraries changes the behavior of leaflet to include new functions.
import 'leaflet-textpath';
import { LayerGroup as LeafletLayerGroup } from 'leaflet';
import React, { FunctionComponent, useEffect, useRef } from 'react';
import { LayerGroup, useMap } from 'react-leaflet';
import { connect, ConnectedProps } from 'react-redux';
import { MSFRouteGroupExtended, MSFRouteGroupKey } from '~/components/data/ElementSchema';
import { selectIsRouteGroupDisplayed } from '~/components/redux/slices/displayed';
import { selectHideRoutesInEditor } from '~/components/redux/slices/options';
import { selectEditorEnabled } from '~/components/redux/slices/ui';
import { AppState } from '~/components/redux/types';
import RouteLine from '~/components/views/map/layers/RouteLine';

interface RouteLayerBaseProps {
  routeKey: MSFRouteGroupKey;
  routeGroup: MSFRouteGroupExtended;
}

const mapStateToProps = (state: AppState, { routeKey }: RouteLayerBaseProps) => {
  const hideRoutesInEditor = selectHideRoutesInEditor(state);
  const editorEnabled = selectEditorEnabled(state);
  const routeDisplayed = selectIsRouteGroupDisplayed(state, routeKey);
  return { displayed: hideRoutesInEditor && editorEnabled && routeDisplayed };
};
const mapDispatchToProps = () => ({});
const connector = connect(mapStateToProps, mapDispatchToProps, (a, b, c) => ({ ...a, ...b, ...c }));

type RouteLayerProps = ConnectedProps<typeof connector>;

const _RouteLayer: FunctionComponent<RouteLayerProps> = ({ routeGroup, displayed }) => {
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

  switch (routeGroup.format) {
    case 2:
      return (
        <LayerGroup ref={layerRef}>
          {routeGroup.data.map((route) => {
            return <RouteLine key={route.id} route={route} />;
          })}
        </LayerGroup>
      );
    default:
      return null;
  }
};

const RouteLayer = connector(_RouteLayer);

export default RouteLayer;
