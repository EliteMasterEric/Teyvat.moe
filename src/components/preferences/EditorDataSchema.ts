import {
  MSFCluster,
  MSFCoordinate,
  MSFCoordinates,
  MSFFeature,
  MSFMarkerID,
  MSFPopupContent,
  MSFPopupMedia,
  MSFPopupTitle,
  MSFRespawn,
  MSFRouteColor,
  MSFRouteID,
  MSFRouteText,
  MSFSchemaVersion,
} from '~/components/data/ElementSchema';
import { MapCategoryKey } from '~/components/data/MapCategories';
import { MapRegionKey } from '~/components/data/MapRegions';

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

  subtype: {
    test: string;
    testb: string;
  };

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

export type EditorFeatureSubmission = {
  format: MSFSchemaVersion;
  name: {
    en: string;
  };
  description: {
    en: string;
  };
  category: MapCategoryKey;
  region: MapRegionKey;
  enabled: boolean;
  respawn: MSFRespawn;
  cluster: MSFCluster;
  icons: MSFFeature['icons'];
};
