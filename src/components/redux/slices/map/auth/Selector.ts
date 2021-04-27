import _ from 'lodash';
import initialState from './InitialState';
import { AuthGoogleProfile, AuthState } from './Types';
import selectNamespace from 'src/components/redux/slices/map/Selector';
import { MapState } from 'src/components/redux/slices/map/Types';
import { AppState } from 'src/components/redux/Types';

export const selectGoogleEnabled = (state: AppState): boolean =>
  selectSlice(selectNamespace(state))?.google.enabled;
export const selectGoogleProfile = (state: AppState): AuthGoogleProfile | null =>
  selectSlice(selectNamespace(state))?.google.profile;
export const selectGoogleInitialized = (state: AppState): boolean =>
  selectSlice(selectNamespace(state))?.google.initialized;
export const selectGoogleClientInProgress = (state: AppState): boolean =>
  selectSlice(selectNamespace(state))?.google.inProgress;

const selectSlice = (state: MapState | null): AuthState => {
  return state?.auth ?? initialState;
};
export default selectSlice;
