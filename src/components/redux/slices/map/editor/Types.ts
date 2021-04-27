import { MSFMarkerID, MSFRouteID } from 'src/components/data/map/Element';
import { EditorMarker, EditorRoute } from 'src/components/preferences/map/EditorDataSchema';
import { GenshinMapPreferencesLatest } from 'src/components/preferences/map/PreferencesSchema';

export type EditorState = GenshinMapPreferencesLatest['editor'];

export type MarkerReplaceActionPayload = {
  existingId: MSFMarkerID;
  newMarker: EditorMarker;
};
export type MarkerEditActionPayload = {
  existingId: MSFMarkerID;
  markerProperty: string; // TODO: Validate this?
  propertyValue: any;
};
export type RouteReplaceActionPayload = {
  existingId: MSFRouteID;
  newRoute: EditorRoute;
};
export type RouteEditActionPayload = {
  existingId: MSFRouteID;
  routeProperty: string; // TODO: Validate this?
  propertyValue: any;
};
