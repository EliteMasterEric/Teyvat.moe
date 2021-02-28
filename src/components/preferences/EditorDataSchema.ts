import {
  MSFCoordinate,
  MSFCoordinates,
  MSFMarkerID,
  MSFPopupContent,
  MSFPopupMedia,
  MSFPopupTitle,
  MSFRouteColor,
  MSFRouteID,
  MSFRouteText,
} from '~/components/data/ElementSchema';

// Legacy data had a GeoJSON format.
export interface LegacyEditorMarker {
  type: 'Feature';
  geometry: {
    coordinates: MSFCoordinates;
  };
  properties: {
    popupTitle?: MSFPopupTitle;
    popupContent?: MSFPopupContent;
    popupMedia?: MSFPopupMedia;
  };
}
export interface LegacyEditorRoute {
  type: 'Feature';
  geometry: {
    coordinates: MSFCoordinates;
  };
  properties: {
    popupTitle?: MSFPopupTitle;
    popupContent?: MSFPopupContent;
    popupMedia?: MSFPopupMedia;
  };
}
// The popupImage element was later moved to
export interface GM_002_EditorMarker extends LegacyEditorMarker {
  properties: {
    popupTitle?: MSFPopupTitle;
    popupContent?: MSFPopupContent;
    popupImage?: MSFPopupMedia;
  };
}
export interface GM_002_EditorRoute extends LegacyEditorRoute {
  properties: {
    popupTitle?: MSFPopupTitle;
    popupContent?: MSFPopupContent;
    popupImage?: MSFPopupMedia;
  };
}

// New data strips GeoJSON metadata.
export interface EditorMarker {
  coordinates: MSFCoordinate;
  id: MSFMarkerID;

  popupTitle?: MSFPopupTitle;
  popupContent?: MSFPopupContent;
  popupMedia?: MSFPopupMedia;
  popupAttribution?: 'Unknown';
}
export interface EditorRoute {
  coordinates: MSFCoordinates;
  id: MSFRouteID;

  routeColor: MSFRouteColor;
  routeText: MSFRouteText;

  popupTitle?: MSFPopupTitle;
  popupContent?: MSFPopupContent;
  popupMedia?: MSFPopupMedia;
  popupAttribution?: 'Unknown';
}

export const isMarker = (element: EditorMarker | EditorRoute): boolean => {
  return !Array.isArray(element.coordinates);
};
export const isRoute = (element: EditorMarker | EditorRoute): boolean => {
  return Array.isArray(element.coordinates);
};
