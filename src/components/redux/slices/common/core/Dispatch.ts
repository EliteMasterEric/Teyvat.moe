import { setPreferences, clearPreferences } from './Actions';
import { dispatchAction } from 'src/components/redux/Dispatch';
import { AppState } from 'src/components/redux/Types';

export const dispatchSetPreferences = (state: Partial<AppState>): void => {
  dispatchAction(setPreferences(state));
};

export const dispatchClearPreferences = (): void => {
  dispatchAction(clearPreferences());
};
