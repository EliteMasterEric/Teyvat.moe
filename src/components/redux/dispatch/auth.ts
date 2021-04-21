import {
  setGoogleAuthProfile,
  disableGoogleAuth,
  initializeGoogleClient,
  setGoogleClientInProgress,
} from '../slices/ui';
import { AuthGoogleProfile } from '../types';
import { dispatchAction } from './base';

export const initializeGoogle = () => {
  dispatchAction(initializeGoogleClient());
};

export const disableGoogle = () => {
  dispatchAction(disableGoogleAuth());
};

export const setGoogleProfile = (profile: AuthGoogleProfile) => {
  dispatchAction(setGoogleAuthProfile(profile));
};

export const clearGoogleProfile = () => {
  dispatchAction(setGoogleAuthProfile(null));
};

export const setGoogleInProgress = (value: boolean) => {
  dispatchAction(setGoogleClientInProgress(value));
};
