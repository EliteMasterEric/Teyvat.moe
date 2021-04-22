import { getState } from './Base';
import {
  selectAuthGoogleEnabled,
  selectAuthGoogleInitialized,
  selectAuthGoogleProfile,
} from 'src/components/redux/slices/Interface';
import { AuthGoogleProfile } from 'src/components/redux/Types';

export const getGoogleAuthEnabled = (): boolean => {
  return selectAuthGoogleEnabled(getState());
};

export const getGoogleAuthInitialized = (): boolean => {
  return selectAuthGoogleInitialized(getState());
};

export const getGoogleAuthProfile = (): AuthGoogleProfile | null => {
  return selectAuthGoogleProfile(getState());
};
