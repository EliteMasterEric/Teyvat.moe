import { initializeAllMapFeatures } from 'src/components/data/MapFeatures';
import { initializeAllMapRouteGroups } from 'src/components/data/MapRoutes';
import { setLoadingInitialized } from 'src/components/redux/dispatch';
import { AppState, AppWatcher } from 'src/components/redux/Types';

/**
 * Triggers the initialization once the app state has loaded.
 */
const initializationWatcher: AppWatcher = (currentState: AppState): void => {
  if (!currentState.ui.loading.initializedLoading) {
    // Set the flag to prevent re-triggering.
    setLoadingInitialized(true);

    initializeAllMapFeatures();
    initializeAllMapRouteGroups();
  }
};

export default initializationWatcher;
