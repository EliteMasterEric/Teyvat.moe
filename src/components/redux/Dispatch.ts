import { AppAction } from './Actions';
import { store } from 'src/components/redux';

export const dispatchAction = (action: AppAction): void => {
  store.dispatch(action);
};
