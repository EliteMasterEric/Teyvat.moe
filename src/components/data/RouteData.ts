/**
 * Loads, validates, and includes utility methods for retrieving route data.
 */
import _ from 'lodash';

import { MSFRouteGroup, validateRouteData } from 'src/components/data/ElementSchema';
import { importFromContext, isDev } from 'src/components/util';

const routesContext = require.context('../../data/routes/', true, /.json$/);
export const listRouteFiles = (): string[] => routesContext.keys();
export const loadRoute = (key: string): MSFRouteGroup | null => {
  const routeData: MSFRouteGroup = importFromContext(routesContext, key);

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
