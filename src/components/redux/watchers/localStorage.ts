import { savePreferencesToLocalStorage } from 'src/components/preferences/ReduxStore';
import { AppWatcher } from 'src/components/redux/types';

/**
 * Save all the data to local storage whenever the state changes.
 */
const localStorageWatcher: AppWatcher = (currentState) => {
  savePreferencesToLocalStorage(currentState);
};

export default localStorageWatcher;
