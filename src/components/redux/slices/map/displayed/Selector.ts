import _ from 'lodash';
import initialState from './InitialState';
import { DisplayedState } from './Types';
import { MSFFeatureKey, MSFRouteGroupKey } from 'src/components/data/map/Element';
import selectNamespace from 'src/components/redux/slices/map/Selector';
import { MapState } from 'src/components/redux/slices/map/Types';
import { AppState } from 'src/components/redux/Types';

export const selectDisplayedFeatures = (state: AppState): MSFFeatureKey[] =>
  _.keys(_.pickBy(selectSlice(selectNamespace(state))?.features)) as MSFFeatureKey[];
export const selectDisplayedRouteGroups = (state: AppState): MSFRouteGroupKey[] =>
  _.keys(_.pickBy(selectSlice(selectNamespace(state))?.routes)) as MSFRouteGroupKey[];
export const selectIsFeatureDisplayed = (state: AppState, featureKey: MSFFeatureKey): boolean =>
  _.includes(selectDisplayedFeatures(state), featureKey);
export const selectIsRouteGroupDisplayed = (state: AppState, routeKey: MSFRouteGroupKey): boolean =>
  _.includes(selectDisplayedRouteGroups(state), routeKey);

const selectSlice = (state: MapState | null): DisplayedState => {
  return state?.displayed ?? initialState;
};
export default selectSlice;
