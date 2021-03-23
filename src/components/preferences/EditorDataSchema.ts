import {
  MSFCluster,
  MSFCoordinate,
  MSFFeature,
  MSFLocalizedField,
  MSFMarkerID,
  MSFPopupContent,
  MSFPopupTitle,
  MSFRespawn,
  MSFRouteColor,
  MSFRouteID,
  MSFRouteText,
  MSFSchemaVersion,
} from 'src/components/data/ElementSchema';
import { MapCategoryKey } from 'src/components/data/MapCategories';
import { MapRegionKey } from 'src/components/data/MapRegions';

// Legacy data had a GeoJSON format.
export interface LegacyEditorMarker {
  type: 'Feature';
  geometry: {
    coordinates: MSFCoordinate;
  };
  properties: {
    popupTitle?: MSFPopupTitle;
    popupContent?: MSFPopupContent;
    popupMedia?: string;
  };
}
export interface LegacyEditorRoute {
  type: 'Feature';
  geometry: {
    coordinates: MSFCoordinate[];
  };
  properties: {
    popupTitle?: MSFPopupTitle;
    popupContent?: MSFPopupContent;
    popupMedia?: string;
  };
}
// The popupImage element was later moved to
export interface GM_002_EditorMarker extends LegacyEditorMarker {
  properties: {
    popupTitle?: MSFPopupTitle;
    popupContent?: MSFPopupContent;
    popupImage?: string;
  };
}
export interface GM_002_EditorRoute extends LegacyEditorRoute {
  properties: {
    popupTitle?: MSFPopupTitle;
    popupContent?: MSFPopupContent;
    popupImage?: string;
  };
}

// New data strips GeoJSON metadata.
export interface EditorMarker {
  coordinates: MSFCoordinate;
  id: MSFMarkerID;

  popupTitle?: MSFLocalizedField;
  popupContent?: MSFLocalizedField;
  popupMedia?: string;
  popupAttribution?: string;
}
export interface EditorRoute {
  coordinates: MSFCoordinate[];
  id: MSFRouteID;

  routeColor?: MSFRouteColor;
  routeText?: MSFRouteText;

  popupTitle?: MSFLocalizedField;
  popupContent?: MSFLocalizedField;
  popupMedia?: string;
  popupAttribution?: string;
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
