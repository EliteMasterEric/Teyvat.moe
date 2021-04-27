import {
  disableGoogleAuth,
  initializeGoogleClient,
  setGoogleAuthProfile,
  setGoogleClientInProgress,
} from './Actions';
import { AuthGoogleProfile } from './Types';
import { dispatchAction } from 'src/components/redux/Dispatch';

export const dispatchDisableGoogleAuth = (): void => {
  dispatchAction(disableGoogleAuth());
};
export const dispatchSetGoogleAuthProfile = (value: AuthGoogleProfile | null): void => {
  dispatchAction(setGoogleAuthProfile(value));
};
export const dispatchInitializeGoogleClient = (): void => {
  dispatchAction(initializeGoogleClient());
};
export const dispatchSetGoogleClientInProgress = (value: boolean): void => {
  dispatchAction(setGoogleClientInProgress(value));
};
