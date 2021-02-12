/**
 * Provides the map layer used to display a Route on the leaflet map.
 */

// Importing these libraries changes the behavior of leaflet to include new functions.
import 'leaflet-textpath';
import React from 'react';
import { connect } from 'react-redux';
import RouteLine from '~/components/views/map/layers/RouteLine';

const _RouteLayer = ({ mapRoute, displayed, routeKey }) => {
  // TODO: We hide by destroying it. Is there a better way?
  if (!displayed) return null;

  switch (mapRoute.format) {
    case 2:
      return mapRoute.data.map((route) => {
        return (
          <RouteLine
            key={route.id}
            routeKey={`${routeKey}/${route.id}`}
            route={route}
            feature={mapRoute}
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
