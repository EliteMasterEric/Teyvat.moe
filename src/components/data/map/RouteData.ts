/**
 * Loads, validates, and includes utility methods for retrieving route data.
 */
import _ from 'lodash';

import { MSFRouteGroup } from './Element';
import { importFromContext } from 'src/components/util';

const routesContext = require.context(
  'src/data/routes/',
  true,
  /.json$/,
  'lazy-once' // webpackMode
);
export const listRouteFiles = (): string[] => routesContext.keys();
export const loadRoute = async (key: string): Promise<MSFRouteGroup | null> => {
  // This import must be relative.
  // It is a promise here since we are lazy loading the data.
  const routeData: MSFRouteGroup = await importFromContext(routesContext, key);

  return routeData;
};
