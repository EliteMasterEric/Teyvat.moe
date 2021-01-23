import { saveStateToLocalStorage } from '~/components/preferences/ReduxStore';

/**
 * Save all the data to local storage whenever the state changes.
 */
export default (currentState) => {
  saveStateToLocalStorage(currentState);
};
