import { createAction } from '@reduxjs/toolkit';
import { REDUX_SLICE_OPTIONS } from './Matcher';
import { OptionsState } from './Types';

/*
 * Create the set of actions.
 * Action names are of the format `teyvatmoe/<namespace>/<slice>/<action>`
 * Set the action type with type generics. Take multiple arguments using a prepare function.
 */
export const setCompletedAlpha = createAction<number>(`${REDUX_SLICE_OPTIONS}/setCompletedAlpha`);
export const setClusterMarkers = createAction<boolean>(`${REDUX_SLICE_OPTIONS}/setClusterMarkers`);
export const setWorldBorderEnabled = createAction<boolean>(
  `${REDUX_SLICE_OPTIONS}/setWorldBorderEnabled`
);
export const setRegionLabelsEnabled = createAction<boolean>(
  `${REDUX_SLICE_OPTIONS}/setRegionLabelsEnabled`
);
export const setHideFeaturesInEditor = createAction<boolean>(
  `${REDUX_SLICE_OPTIONS}/setHideFeaturesInEditor`
);
export const setHideRoutesInEditor = createAction<boolean>(
  `${REDUX_SLICE_OPTIONS}/setHideRoutesInEditor`
);
export const setShowHiddenFeaturesInSummary = createAction<boolean>(
  `${REDUX_SLICE_OPTIONS}/setShowHiddenFeaturesInSummary`
);
export const setOverrideLang = createAction<OptionsState['overrideLang']>(
  `${REDUX_SLICE_OPTIONS}/setOverrideLang`
);

export type OptionsAction =
  | ReturnType<typeof setCompletedAlpha>
  | ReturnType<typeof setClusterMarkers>
  | ReturnType<typeof setWorldBorderEnabled>
  | ReturnType<typeof setRegionLabelsEnabled>
  | ReturnType<typeof setHideFeaturesInEditor>
  | ReturnType<typeof setHideRoutesInEditor>
  | ReturnType<typeof setShowHiddenFeaturesInSummary>
  | ReturnType<typeof setOverrideLang>;
