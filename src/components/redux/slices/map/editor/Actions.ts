import { createAction, PrepareAction } from '@reduxjs/toolkit';
import { REDUX_SLICE_EDITOR } from './Matcher';
import {
  MarkerEditActionPayload,
  MarkerReplaceActionPayload,
  RouteEditActionPayload,
  RouteReplaceActionPayload,
} from './Types';
import { MSFMarkerID, MSFRouteID } from 'src/components/data/map/Element';
import { MapCategoryKey } from 'src/components/data/map/MapCategories';
import { MapRegionKey } from 'src/components/data/map/MapRegions';
import { EditorMarker, EditorRoute } from 'src/components/preferences/map/EditorDataSchema';

/*
 * When performing additional logic to customize the creation of the action payload,
 * use a prepare callback.
 */
const prepareReplaceMarker: PrepareAction<MarkerReplaceActionPayload> = (
  existingId: MSFMarkerID,
  newMarker: EditorMarker
) => {
  return { payload: { existingId, newMarker } };
};
const prepareEditMarker: PrepareAction<MarkerEditActionPayload> = (
  existingId: MSFMarkerID,
  markerProperty: string,
  propertyValue
) => {
  return { payload: { existingId, markerProperty, propertyValue } };
};
const prepareReplaceRoute: PrepareAction<RouteReplaceActionPayload> = (existingId, newRoute) => {
  return { payload: { existingId, newRoute } };
};
const prepareEditRoute: PrepareAction<RouteEditActionPayload> = (
  existingId: MSFRouteID,
  routeProperty: string,
  propertyValue
) => {
  return { payload: { existingId, routeProperty, propertyValue } };
};

/*
 * Create the set of actions.
 * Action names are of the format `teyvatmoe/<namespace>/<slice>/<action>`
 * Set the action type with type generics. Take multiple arguments using a prepare function.
 */
export const setFeatureName = createAction<string>(`${REDUX_SLICE_EDITOR}/setFeatureName`);
export const setFeatureCategory = createAction<MapCategoryKey>(
  `${REDUX_SLICE_EDITOR}/setFeatureCategory`
);
export const setFeatureRegion = createAction<MapRegionKey>(
  `${REDUX_SLICE_EDITOR}/setFeatureRegion`
);
export const clearElements = createAction(`${REDUX_SLICE_EDITOR}/clearElements`);
export const replaceMarker = createAction(
  `${REDUX_SLICE_EDITOR}/replaceMarker`,
  prepareReplaceMarker
);
export const replaceRoute = createAction(`${REDUX_SLICE_EDITOR}/replaceRoute`, prepareReplaceRoute);
export const removeMarker = createAction<MSFMarkerID>(`${REDUX_SLICE_EDITOR}/removeMarker`);
export const removeRoute = createAction<MSFRouteID>(`${REDUX_SLICE_EDITOR}/removeRoute`);
export const appendMarker = createAction<EditorMarker>(`${REDUX_SLICE_EDITOR}/appendMarker`);
export const appendRoute = createAction<EditorRoute>(`${REDUX_SLICE_EDITOR}/appendRoute`);
export const editMarker = createAction(`${REDUX_SLICE_EDITOR}/editMarker`, prepareEditMarker);
export const editRoute = createAction(`${REDUX_SLICE_EDITOR}/editRoute`, prepareEditRoute);

export type EditorAction =
  | ReturnType<typeof setFeatureName>
  | ReturnType<typeof setFeatureCategory>
  | ReturnType<typeof setFeatureRegion>
  | ReturnType<typeof clearElements>
  | ReturnType<typeof replaceMarker>
  | ReturnType<typeof replaceRoute>
  | ReturnType<typeof removeMarker>
  | ReturnType<typeof removeRoute>
  | ReturnType<typeof appendMarker>
  | ReturnType<typeof appendRoute>
  | ReturnType<typeof editMarker>
  | ReturnType<typeof editRoute>;
