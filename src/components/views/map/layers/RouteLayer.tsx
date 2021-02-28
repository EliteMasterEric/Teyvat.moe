/**
 * Provides the map layer used to display a Route on the leaflet map.
 */

// Importing these libraries changes the behavior of leaflet to include new functions.
import 'leaflet-textpath';
import React from 'react';
import { connect } from 'react-redux';
import { MSFRouteGroupExtended } from '~/components/data/ElementSchema';
import RouteLine from '~/components/views/map/layers/RouteLine';

const _RouteLayer = ({
  routeGroup,
  displayed,
}: {
  routeGroup: MSFRouteGroupExtended;
  displayed: boolean;
}) => {
  // TODO: We hide by destroying it. Is there a better way?
  if (!displayed) return null;

  switch (routeGroup.format) {
    case 2:
      return routeGroup.data.map((route) => {
        return (
          <RouteLine
            key={route.id}
            routeKey={`${routeGroup.key}/${route.id}`}
            route={route}
            feature={routeGroup}
          />
        );
      });
    default:
      return null;
  }
};

const mapStateToProps = (state, { routeKey }) => ({
  // Display the route if the route is enabled in the controls,
  // and we aren't in the state of (editor on + hide routes when editor is on)
  displayed:
    !((state.options.hideRoutesInEditor ?? false) && (state.editorEnabled ?? false)) &&
    state.displayed.routes[routeKey],
});
const mapDispatchToProps = (_dispatch) => ({});
const RouteLayer = connect(mapStateToProps, mapDispatchToProps)(_RouteLayer);

export default RouteLayer;
