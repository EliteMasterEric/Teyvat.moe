import {
  selectGoogleClientInProgress,
  selectGoogleEnabled,
  selectGoogleInitialized,
  selectGoogleProfile,
} from './Selector';
import { AuthGoogleProfile } from './Types';
import { store } from 'src/components/redux';

export const getGoogleEnabled = (): boolean => selectGoogleEnabled(store.getState());
export const getGoogleProfile = (): AuthGoogleProfile | null =>
  selectGoogleProfile(store.getState());
export const getGoogleInitialized = (): boolean => selectGoogleInitialized(store.getState());
export const getGoogleClientInProgress = (): boolean =>
  selectGoogleClientInProgress(store.getState());
