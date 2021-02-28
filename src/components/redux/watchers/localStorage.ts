import { saveStateToLocalStorage } from '~/components/preferences/ReduxStore';
import { AppWatcher } from '~/components/redux/types';

/**
 * Save all the data to local storage whenever the state changes.
 */
const localStorageWatcher: AppWatcher = (currentState) => {
  saveStateToLocalStorage(currentState);
};

export default localStorageWatcher;
