import { store } from 'src/components/redux';
import { AppState } from 'src/components/redux/Types';

export const getState = (): AppState => {
  return store.getState();
};
