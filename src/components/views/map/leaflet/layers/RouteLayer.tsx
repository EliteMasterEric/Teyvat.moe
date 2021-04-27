/**
 * Provides the map layer used to display a Route on the leaflet map.
 */

// Importing these libraries changes the behavior of leaflet to include new functions.
import 'leaflet-textpath';
import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { LayerGroup } from 'react-leaflet';
import { connect, ConnectedProps } from 'react-redux';
import { MSFRouteGroupExtended, MSFRouteGroupKey } from 'src/components/data/map/Element';
import { selectIsRouteGroupDisplayed } from 'src/components/redux/slices/map/displayed/Selector';
import { selectEditorEnabled } from 'src/components/redux/slices/map/interface/Selector';
import { selectHideRoutesInEditor } from 'src/components/redux/slices/map/options/Selector';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';
import RouteLine from 'src/components/views/map/leaflet/layers/RouteLine';

interface RouteLayerBaseProps {
  routeKey: MSFRouteGroupKey;
  routeGroup: MSFRouteGroupExtended;
}

const mapStateToProps = (state: AppState, { routeKey }: RouteLayerBaseProps) => {
  const hideRoutesInEditor = selectHideRoutesInEditor(state);
  const editorEnabled = selectEditorEnabled(state);
  const routeDisplayed = selectIsRouteGroupDisplayed(state, routeKey);
  return { displayed: !(hideRoutesInEditor && editorEnabled) && routeDisplayed };
};
type RouteLayerStateProps = ReturnType<typeof mapStateToProps>;
const connector = connect<RouteLayerStateProps, Empty, RouteLayerBaseProps, AppState>(
  mapStateToProps
);

type RouteLayerProps = ConnectedProps<typeof connector> & RouteLayerBaseProps;

const _RouteLayer: FunctionComponent<RouteLayerProps> = ({ routeGroup, displayed }) => {
  if (!displayed) return null;

  switch (routeGroup.format) {
    case 2:
      return (
        <LayerGroup>
          {_.map(routeGroup.data, (route) => {
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
