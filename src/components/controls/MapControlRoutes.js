import React from 'react';
import clsx from 'clsx';

import { getRouteKeysByFilter, MapRoutes } from '../MapFeatures';

import './MapControlRoutes.css';

/**
 * A button in the Filters, with the icon of a Map route on it.
 * Pressing this toggles display of that Map route.
 * @param {*} routeKey The key of the route.
 */
const MapControlRouteButton = ({ routeKey, mapPreferences, setMapPreferences }) => {
  const mapRoute = MapRoutes[routeKey];

  const toggleRoute = () => {
    setMapPreferences((old) => {
      const previousValue = old?.displayed?.routes[routeKey] ?? false;
      return {
        ...old,
        displayed: {
          ...old?.displayed,
          routes: {
            ...old?.displayed?.routes,
            [routeKey]: !previousValue,
          },
        },
      };
    });
  };

  const active = mapPreferences?.displayed?.routes[routeKey] ?? false;

  return (
    <div
      onClick={toggleRoute}
      onKeyDown={toggleRoute}
      role="button"
      aria-label={active ? `Show ${mapRoute.name}` : `Hide ${mapRoute.name}`}
      tabIndex={0}
      className={clsx('map-controls-route', active ? 'map-controls-route-active' : '', 'noselect')}
    >
      <div className={clsx('map-controls-route-border')}>
        <img
          className={clsx('map-controls-route-icon')}
          src={mapRoute.icons.filter}
          alt={mapRoute.name}
        />
      </div>
      {mapRoute.name}
    </div>
  );
};

const MapControlRoutes = ({
  currentRegion,
  currentCategory,
  mapPreferences,
  setMapPreferences,
}) => {
  return (
    <div className={clsx('map-controls-routes-box')}>
      {getRouteKeysByFilter(currentRegion, currentCategory).map((key) => (
        <MapControlRouteButton
          routeKey={key}
          mapPreferences={mapPreferences}
          setMapPreferences={setMapPreferences}
        />
      ))}
    </div>
  );
};

export default MapControlRoutes;
