/**
 * markerId: ABCD123456
 * markerKey: mondstadtAnemoculus/ABCD123456
 * markerPath: feature/mondstadtAnemoculus/ABCD123456
 *
 * featureKey: mondstadtAnemoculus
 *
 * routeId: ABCD123456
 * routeKey: mondstadtCecilia/ABCD123456
 * routePath: route/mondstadtCecilia/ABCD123456
 */
import { getMapFeatureKeys, getMapFeature } from 'src/components/data/MapFeatures';
import { getMapRouteGroupKeys, getMapRouteGroup } from 'src/components/data/MapRoutes';
import { A } from 'ts-toolbelt';

import { MapCategoryKey } from 'src/components/data/MapCategories';
import { MapRegionKey, MapRegionKeys } from 'src/components/data/MapRegions';
import { hashObject, isDev } from 'src/components/util';

// A number used to indicate version changes.
// Version changes are only needed for breaking changes, like restructuring,
// not for new options that can be given optional defaults.
export const MSF_SCHEMA_VERSION = 2;
export type MSFSchemaVersion = A.Type<2, 'MSFSchemaVersion'>;

/**
 * A regular expression which validates whether a string is a link to a YouTube video.
 * If there is a match, the first capture group represents the video ID (?v=<ID>).
 */
export const YOUTUBE_REGEX = /^(?:https?:\/\/)?(?:(?:www\.)?youtube\.com\/watch\?v=|youtu\.?be\/)([-_a-zA-Z0-9]+)(?:&.+)?$/;

export type MSFLocalizedString = A.Type<string, 'MSFLocalizedString'>;
export type MSFLocalizedField = {
  en: MSFLocalizedString;
  [key: string]: MSFLocalizedString;
};

/**
 * The type representing how markers should be clustered at far zoom levels.
 */
export const clusterEnum = ['off', 'on', 'variable'] as const;
export type MSFCluster = 'off' | 'on' | 'variable';
/**
 * The type representing when a marker will be able to be collected again.
 */
export const respawnEnum = ['none', 'boss'] as const;
export type MSFRespawn = 'none' | 'boss' | number;

export type MSFCoordinate = [number, number];

export type MSFPopupTitle = A.Type<MSFLocalizedField, 'MSFPopupTitle'>;
export type MSFPopupContent = A.Type<MSFLocalizedField, 'MSFPopupContent'>;

export type MSFImportKey = A.Type<string, 'MSFImportKey'>;
export type MSFImportSite = 'yuanshen' | 'mapgenie' | 'appsample' | 'gm_legacy' | 'gm_msfv2';

export type MSFMarkerID = A.Type<string, 'MSFMarkerID'>;
export type MSFMarkerKey = A.Type<string, 'MSFMarkerKey'>;
export type MSFRouteID = A.Type<string, 'MSFRouteID'>;
export type MSFRouteKey = A.Type<string, 'MSFRouteKey'>;

export interface MSFMarker {
  id: MSFMarkerID;
  coordinates: MSFCoordinate;
  importIds?: Record<MSFImportSite, MSFImportKey[]>;

  popupTitle?: MSFPopupTitle;
  popupContent?: MSFPopupContent;
  popupMedia?: string;

  popupAttribution?: string;
}

export type MSFRouteColor = A.Type<string, 'MSFRouteColor'>;
export type MSFRouteText = A.Type<string, 'MSFRouteText'>;
export interface MSFRoute {
  id: MSFRouteID;
  coordinates: MSFCoordinate[];
  importIds?: {
    gm_legacy?: MSFImportKey[];
    gm_msfv2?: MSFImportKey[];
  };

  routeColor?: MSFRouteColor;
  routeText?: MSFRouteText;

  popupTitle?: MSFPopupTitle;
  popupContent?: MSFPopupContent;
  popupMedia?: string;

  popupAttribution?: string;
}

type MSFMarkerIcon =
  | {
      marker: true;
      key?: string;
    }
  | {
      marker: false;
      key: string;
      svg?: boolean;
      iconSize: [number, number];
      iconAnchor: [number, number];
      shadowSize: [number, number];
      shadowAnchor: [number, number];
      popupAnchor: [number, number];
      className?: string;
      clusterIcon?: string;
    };

export type MSFFilterIcon = A.Type<string, 'MSFFilterIcon'>;
export interface MSFFeature {
  format: MSFSchemaVersion;
  enabled?: boolean;

  name: MSFLocalizedField;
  description: MSFLocalizedField;

  cluster: MSFCluster;
  respawn: MSFRespawn;

  icons: {
    filter: MSFFilterIcon;
    base: MSFMarkerIcon;
    done: MSFMarkerIcon;
  };

  data: Array<MSFMarker>;
}
export type MSFFeatureKey = A.Type<string, 'MSFFeatureKey'>;
export interface MSFFeatureExtended extends MSFFeature {
  key: MSFFeatureKey;
  region: MapRegionKey;
  category: MapCategoryKey;
}

export interface MSFRouteGroup {
  format: MSFSchemaVersion;
  enabled?: boolean;

  name: MSFLocalizedField;
  description: MSFLocalizedField;

  icons: {
    filter: A.Type<string, 'MSFFilterIcon'>;
  };

  data: Array<MSFRoute>;
}
export type MSFRouteGroupKey = A.Type<string, 'MSFRouteGroupKey'>;
export interface MSFRouteGroupExtended extends MSFRouteGroup {
  key: MSFRouteGroupKey;
  region: MapRegionKey;
  category: MapCategoryKey;
}

//
// Element paths are only used during the permalink parsing process.
//

export const getElementPathById = (id: string): string | null => {
  let result = null;

  // Search the features.
  getMapFeatureKeys().forEach((featureKey: MSFFeatureKey) => {
    const feature = getMapFeature(featureKey);
    const matchingMarkers = feature.data.filter((element) => element.id.startsWith(id));
    if (matchingMarkers[0] !== undefined) {
      result = `feature/${featureKey}/${matchingMarkers[0].id}`;
    }
  });
  if (result !== null) return result;

  // Search the routes.
  getMapRouteGroupKeys().forEach((routeKey) => {
    const routes = getMapRouteGroup(routeKey);
    const matchingRoutes = routes.data.filter((element) => element.id.startsWith(id));
    if (matchingRoutes[0] !== undefined) {
      result = `route/${routeKey}/${matchingRoutes[0].id}`;
    }
  });
  if (result !== null) return result;

  // Couldn't find it.
  return null;
};

export const getElementByPath = (path: string): MSFMarker | MSFRoute | null => {
  const [type, name, id] = path.split('/');
  switch (type) {
    case 'feature':
      const featureKey = name as MSFFeatureKey;
      const feature = getMapFeature(featureKey);
      const markers = feature.data.filter((m) => m.id === id);
      if (markers[0] !== undefined) return markers[0];
      break;
    case 'route':
      const routeGroupKey = name as MSFRouteGroupKey;
      const route = getMapRouteGroup(routeGroupKey);
      const routes = route.data.filter((r) => r.id === id);
      if (routes[0] !== undefined) return routes[0];
      break;
    default:
      console.error(`Unknown type ${type}.`);
      break;
  }
  return null;
};
