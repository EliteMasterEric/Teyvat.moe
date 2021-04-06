import {
  MSFFeatureKey,
  MSFImportKey,
  MSFMarkerID,
  MSFMarkerKey,
  MSFRouteGroupKey,
} from 'src/components/data/Element';
import { MapCategoryKey } from 'src/components/data/MapCategories';
import { MapRegionKey } from 'src/components/data/MapRegions';
import {
  EditorMarker,
  EditorRoute,
  GM_002_EditorMarker,
  GM_002_EditorRoute,
  LegacyEditorMarker,
  LegacyEditorRoute,
} from 'src/components/preferences/EditorDataSchema';
import { Notification } from 'src/components/redux/slices/notify';
import { LanguageCode } from '../i18n/Localization';

export const PREFERENCES_VERSION = 'GM_007';

export type MigrationData = MSFImportKey[];

export interface GM_001 {
  version: 'GM_001';
  options: {
    completedAlpha: number;
    clusterMarkers: boolean;
    worldBorderEnabled: boolean;
    regionLabelsEnabled: boolean;
    hideFeaturesInEditor: boolean;
    hideRoutesInEditor: boolean;
    overrideLang: LanguageCode | null;
  };
  displayed: {
    features: Record<MSFFeatureKey, boolean>;
    routes: Record<MSFRouteGroupKey, boolean>;
  };
  completed: {
    features: Record<MSFFeatureKey, Record<MSFMarkerID, number>>;
  };
  editor: {
    feature: {
      name: string;
      category: string;
      region: string;
      data: Array<GM_002_EditorMarker | GM_002_EditorRoute>;
    };
  };
}
export interface GM_002 {
  version: 'GM_002';
  options: GM_001['options'];
  displayed: GM_001['displayed'];
  completed: GM_001['completed'];
  editor: GM_001['editor'];
}
export interface GM_003 {
  version: 'GM_003';
  options: GM_002['options'];
  displayed: GM_002['displayed'];
  completed: GM_002['completed'];
  editor: {
    feature: {
      name: string;
      category: string;
      region: string;
      data: Array<LegacyEditorMarker | LegacyEditorRoute>;
    };
  };
}
export interface GM_004 {
  version: 'GM_004';
  options: GM_003['options'];
  displayed: GM_003['displayed'];
  completed: GM_003['completed'];
  editor: GM_003['editor'];
}
export interface GM_005 {
  version: 'GM_005';
  options: GM_004['options'];
  displayed: GM_004['displayed'];
  completed: GM_004['completed'];
  editor: GM_004['editor'];
}
/**
 * GM_006 migrates marker completion data to MSFv2.
 */
export interface GM_006 {
  version: 'GM_006';
  options: GM_005['options'];
  displayed: GM_005['displayed'];
  completed: {
    features: Record<MSFMarkerKey, number>;
  };
  editor: GM_005['editor'];
  // Optional, used during loading to queue notifications to display,
  // indicating the success of data import.
  notify: { notifications: Notification[] };
}

/**
 * GM_007 migrates editor data to MSFv2.
 */
export interface GM_007 {
  version: 'GM_007';
  options: GM_006['options'] & {
    showHiddenFeaturesInSummary: boolean;
  };
  displayed: GM_006['displayed'];
  completed: GM_006['completed'];
  // Optional, used during loading to queue notifications to display,
  // indicating the success of data import.
  notify: GM_006['notify'];
  editor: {
    feature: {
      name: string;
      category: MapCategoryKey;
      region: MapRegionKey;
      data: Array<EditorMarker | EditorRoute>;
    };
  };
}

export type GenshinMapPreferences = GM_001 | GM_002 | GM_003 | GM_004 | GM_005 | GM_006 | GM_007;
export type GenshinMapPreferencesLatest = GM_007;

export type GenshinMapPreferencesVersion = GenshinMapPreferences['version'];
