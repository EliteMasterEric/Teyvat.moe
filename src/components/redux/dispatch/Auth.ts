import { dispatchAction } from './Base';
import {
  setGoogleAuthProfile,
  disableGoogleAuth,
  initializeGoogleClient,
  setGoogleClientInProgress,
} from 'src/components/redux/slices/Interface';
import { AuthGoogleProfile } from 'src/components/redux/Types';

export const initializeGoogle = (): void => {
  dispatchAction(initializeGoogleClient());
};

export const disableGoogle = (): void => {
  dispatchAction(disableGoogleAuth());
};

export const setGoogleProfile = (profile: AuthGoogleProfile): void => {
  dispatchAction(setGoogleAuthProfile(profile));
};

export const clearGoogleProfile = (): void => {
  dispatchAction(setGoogleAuthProfile(null));
};

export const setGoogleInProgress = (value: boolean): void => {
  dispatchAction(setGoogleClientInProgress(value));
};
