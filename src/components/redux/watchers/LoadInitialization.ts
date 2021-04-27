import { initializeAllMapFeatures } from 'src/components/data/map/MapFeatures';
import { initializeAllMapRouteGroups } from 'src/components/data/map/MapRoutes';
import { selectLoading } from 'src/components/redux/slices/map/loading/Selector';
import { AppState, AppWatcher } from 'src/components/redux/Types';

/**
 * Triggers the initialization once the app state has loaded.
 */
const initializationWatcher: AppWatcher = (currentState: AppState): void => {
  if (selectLoading(currentState, 'loadMapFeatures') === false) {
    initializeAllMapFeatures();
    initializeAllMapRouteGroups();
  }
};

export default initializationWatcher;
