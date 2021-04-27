import { saveMapPreferencesToLocalStorage } from 'src/components/preferences/map/ReduxStore';
import { selectNamespaceMap } from 'src/components/redux/slices/map';
import { AppState, AppWatcher } from 'src/components/redux/Types';

/**
 * Save all the data to local storage whenever the state changes.
 */
const localStorageWatcher: AppWatcher = (currentState: AppState) => {
  // TODO: This gets called even when parts of the map that aren't the namespace get changed.
  // How to subscribe to partial state?
  saveMapPreferencesToLocalStorage(selectNamespaceMap(currentState));
};

export default localStorageWatcher;
