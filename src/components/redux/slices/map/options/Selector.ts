import _ from 'lodash';
import initialState from './InitialState';
import { OptionsState } from './Types';
import { LanguageCode } from 'src/components/i18n/Localization';
import selectNamespace from 'src/components/redux/slices/map/Selector';
import { MapState } from 'src/components/redux/slices/map/Types';
import { AppState } from 'src/components/redux/Types';

export const selectCompletedAlpha = (state: AppState): number =>
  selectSlice(selectNamespace(state))?.completedAlpha;
export const selectClusterMarkers = (state: AppState): boolean =>
  selectSlice(selectNamespace(state))?.clusterMarkers;
export const selectWorldBorderEnabled = (state: AppState): boolean =>
  selectSlice(selectNamespace(state))?.worldBorderEnabled;
export const selectRegionLabelsEnabled = (state: AppState): boolean =>
  selectSlice(selectNamespace(state))?.regionLabelsEnabled;
export const selectHideFeaturesInEditor = (state: AppState): boolean =>
  selectSlice(selectNamespace(state))?.hideFeaturesInEditor;
export const selectHideRoutesInEditor = (state: AppState): boolean =>
  selectSlice(selectNamespace(state))?.hideRoutesInEditor;
export const selectShowHiddenFeaturesInSummary = (state: AppState): boolean =>
  selectSlice(selectNamespace(state))?.showHiddenFeaturesInSummary;
export const selectOverrideLang = (state: AppState): LanguageCode | null =>
  selectSlice(selectNamespace(state))?.overrideLang;

const selectSlice = (state: MapState | null): OptionsState => {
  return state?.options ?? initialState;
};
export default selectSlice;
