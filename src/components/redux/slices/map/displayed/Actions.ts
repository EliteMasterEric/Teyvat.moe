import { createAction } from '@reduxjs/toolkit';
import { REDUX_SLICE_DISPLAYED } from './Matcher';
import { MSFFeatureKey, MSFRouteGroupKey } from 'src/components/data/map/Element';

/*
 * Create the set of actions.
 * Action names are of the format `teyvatmoe/<namespace>/<slice>/<action>`
 * Set the action type with type generics. Take multiple arguments using a prepare function.
 */
export const setFeatureDisplayed = createAction<MSFFeatureKey>(
  `${REDUX_SLICE_DISPLAYED}/setFeatureDisplayed`
);
export const clearFeatureDisplayed = createAction<MSFFeatureKey>(
  `${REDUX_SLICE_DISPLAYED}/clearFeatureDisplayed`
);
export const toggleFeatureDisplayed = createAction<MSFFeatureKey>(
  `${REDUX_SLICE_DISPLAYED}/toggleFeatureDisplayed`
);
export const setRouteGroupDisplayed = createAction<MSFRouteGroupKey>(
  `${REDUX_SLICE_DISPLAYED}/setRouteGroupDisplayed`
);
export const clearRouteGroupDisplayed = createAction<MSFRouteGroupKey>(
  `${REDUX_SLICE_DISPLAYED}/clearRouteGroupDisplayed`
);
export const toggleRouteGroupDisplayed = createAction<MSFRouteGroupKey>(
  `${REDUX_SLICE_DISPLAYED}/toggleRouteGroupDisplayed`
);

export type DisplayedAction =
  | ReturnType<typeof setFeatureDisplayed>
  | ReturnType<typeof clearFeatureDisplayed>
  | ReturnType<typeof toggleFeatureDisplayed>
  | ReturnType<typeof setRouteGroupDisplayed>
  | ReturnType<typeof clearRouteGroupDisplayed>
  | ReturnType<typeof toggleRouteGroupDisplayed>;
