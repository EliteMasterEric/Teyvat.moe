import { createAction, PrepareAction } from '@reduxjs/toolkit';
import { REDUX_SLICE_INTERFACE } from './Matcher';
import { MSFMarkerID, MSFRouteID } from 'src/components/data/map/Element';
import { MapCategoryKey } from 'src/components/data/map/MapCategories';
import { MapRegionKey } from 'src/components/data/map/MapRegions';
import { MapPosition, UIControlsTab } from 'src/components/Types';

/*
 * When performing additional logic to customize the creation of the action payload,
 * use a prepare callback.
 */
const prepareSetMapPosition: PrepareAction<MapPosition> = (
  latlng: MapPosition['latlng'],
  zoom: MapPosition['zoom']
) => {
  return { payload: { latlng, zoom } };
};

/*
 * Create the set of actions.
 * Action names are of the format `teyvatmoe/<namespace>/<slice>/<action>`
 * Set the action type with type generics. Take multiple arguments using a prepare function.
 */
export const setTab = createAction<UIControlsTab>(`${REDUX_SLICE_INTERFACE}/setTab`);
export const setMapCategory = createAction<MapCategoryKey>(
  `${REDUX_SLICE_INTERFACE}/setMapCategory`
);
export const setMapRegion = createAction<MapRegionKey>(`${REDUX_SLICE_INTERFACE}/setMapRegion`);
export const setOpen = createAction<boolean>(`${REDUX_SLICE_INTERFACE}/setOpen`);
export const toggleOpen = createAction(`${REDUX_SLICE_INTERFACE}/toggleOpen`);
export const setMapHighlight = createAction<MSFMarkerID | MSFRouteID>(
  `${REDUX_SLICE_INTERFACE}/setMapHighlight`
);
export const clearMapHighlight = createAction(`${REDUX_SLICE_INTERFACE}/clearMapHighlight`);
export const setMapPosition = createAction(
  `${REDUX_SLICE_INTERFACE}/setMapPosition`,
  prepareSetMapPosition
);
export const setEditorEnabled = createAction<boolean>(`${REDUX_SLICE_INTERFACE}/setEditorEnabled`);
export const toggleEditorEnabled = createAction(`${REDUX_SLICE_INTERFACE}/toggleEditorEnabled`);
export const setEditorDebugEnabled = createAction<boolean>(
  `${REDUX_SLICE_INTERFACE}/setEditorDebugEnabled`
);
export const toggleEditorDebugEnabled = createAction(
  `${REDUX_SLICE_INTERFACE}/toggleEditorDebugEnabled`
);
export const setMapMarkerCount = createAction<number>(`${REDUX_SLICE_INTERFACE}/setMapMarkerCount`);
export const setMapRouteCount = createAction<number>(`${REDUX_SLICE_INTERFACE}/setMapRouteCount`);
export const setPermalinkId = createAction<string>(`${REDUX_SLICE_INTERFACE}/setPermalinkId`);

export type InterfaceAction =
  | ReturnType<typeof setTab>
  | ReturnType<typeof setMapCategory>
  | ReturnType<typeof setMapRegion>
  | ReturnType<typeof setOpen>
  | ReturnType<typeof toggleOpen>
  | ReturnType<typeof setMapHighlight>
  | ReturnType<typeof clearMapHighlight>
  | ReturnType<typeof setMapPosition>
  | ReturnType<typeof setEditorEnabled>
  | ReturnType<typeof toggleEditorEnabled>
  | ReturnType<typeof setEditorDebugEnabled>
  | ReturnType<typeof toggleEditorDebugEnabled>
  | ReturnType<typeof setMapMarkerCount>
  | ReturnType<typeof setMapRouteCount>
  | ReturnType<typeof setPermalinkId>;
