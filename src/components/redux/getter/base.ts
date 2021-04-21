import { AppState } from '../types';
import { store } from 'src/components/redux';

export const getState = (): AppState => {
  return store.getState();
};
