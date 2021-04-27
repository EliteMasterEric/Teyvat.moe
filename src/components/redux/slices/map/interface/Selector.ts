import _ from 'lodash';
import initialState from './InitialState';
import { InterfaceState } from './Types';
import { MSFMarkerID, MSFRouteID } from 'src/components/data/map/Element';
import { MapCategoryKey } from 'src/components/data/map/MapCategories';
import { MapRegionKey } from 'src/components/data/map/MapRegions';
import selectNamespace from 'src/components/redux/slices/map/Selector';
import { MapState } from 'src/components/redux/slices/map/Types';

import { AppState } from 'src/components/redux/Types';
import { UIControlsTab, MapPosition } from 'src/components/Types';

export const selectTab = (state: AppState): UIControlsTab =>
  selectSlice(selectNamespace(state))?.tab;
export const selectIsTabDisplayed = (
  state: AppState,
  tab: UIControlsTab | UIControlsTab[]
): boolean => {
  return _.isArray(tab) ? _.includes(tab, selectTab(state)) : selectTab(state) === tab;
};
export const selectMapCategory = (state: AppState): MapCategoryKey =>
  selectSlice(selectNamespace(state))?.mapCategory;
export const selectIsCategoryDisplayed = (state: AppState, category: MapCategoryKey): boolean =>
  selectMapCategory(state) === category;
export const selectMapRegion = (state: AppState): MapRegionKey =>
  selectSlice(selectNamespace(state))?.mapRegion;
export const selectIsRegionDisplayed = (state: AppState, region: MapRegionKey): boolean =>
  selectMapRegion(state) === region;
export const selectOpen = (state: AppState): boolean => selectSlice(selectNamespace(state))?.open;
export const selectMapHighlight = (state: AppState): InterfaceState['mapHighlight'] =>
  selectSlice(selectNamespace(state))?.mapHighlight;
export const selectIsMarkerHighlighted = (state: AppState, markerID: MSFMarkerID): boolean =>
  selectMapHighlight(state) == markerID;
export const selectIsRouteHighlighted = (state: AppState, routeID: MSFRouteID): boolean =>
  selectMapHighlight(state) == routeID;
export const selectMapPosition = (state: AppState): MapPosition =>
  selectSlice(selectNamespace(state))?.mapPosition;
export const selectEditorEnabled = (state: AppState): boolean =>
  selectSlice(selectNamespace(state))?.editorEnabled;
export const selectEditorDebugEnabled = (state: AppState): boolean =>
  selectSlice(selectNamespace(state))?.editorDebugEnabled;
export const selectMapMarkerCount = (state: AppState): number | null =>
  selectSlice(selectNamespace(state))?.mapStats.markerCount;
export const selectMapRouteCount = (state: AppState): number | null =>
  selectSlice(selectNamespace(state))?.mapStats.routeCount;
export const selectPermalinkID = (state: AppState): string | null =>
  selectSlice(selectNamespace(state))?.permalinkId;

const selectSlice = (state: MapState | null): InterfaceState => {
  return state?.interface ?? initialState;
};
export default selectSlice;
