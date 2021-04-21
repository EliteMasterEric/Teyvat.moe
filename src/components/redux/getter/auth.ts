import {
  selectAuthGoogleEnabled,
  selectAuthGoogleInitialized,
  selectAuthGoogleProfile,
} from '../slices/ui';
import { getState } from './base';

export const getGoogleAuthEnabled = () => {
  return selectAuthGoogleEnabled(getState());
};

export const getGoogleAuthInitialized = () => {
  return selectAuthGoogleInitialized(getState());
};

export const getGoogleAuthProfile = () => {
  return selectAuthGoogleProfile(getState());
};
