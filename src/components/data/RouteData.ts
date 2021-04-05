/**
 * Loads, validates, and includes utility methods for retrieving route data.
 */
import _ from 'lodash';

import { MSFRouteGroup, validateRouteData } from 'src/components/data/ElementSchema';
import { importFromContext, isDev } from 'src/components/util';

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

  if (isDev()) {
    const validation = validateRouteData(routeData);
    if (validation == null || validation.error) {
      console.warn(`ERROR during validation of route '${key}'`);
      console.warn(validation);
      return null;
    }
  }

  return routeData;
};
