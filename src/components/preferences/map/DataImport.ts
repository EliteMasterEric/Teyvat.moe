/**
 * Handling importing of data from the new site,
 * either via string or from the local storage.
 *
 * Includes migration handling and recovery states.
 */

import _ from 'lodash';

import { PREFERENCES_PREFIX } from './DataExport';
import {
  EditorMarker,
  EditorRoute,
  GM_002_EditorMarker,
  GM_002_EditorRoute,
  LegacyEditorMarker,
  LegacyEditorRoute,
} from './EditorDataSchema';
import { buildImportMapping } from './ExternalImportDictionary';
import {
  GM_001,
  GM_002,
  GM_003,
  GM_004,
  GM_005,
  GM_006,
  GM_007,
  GenshinMapPreferences,
  GenshinMapPreferencesLatest,
  GenshinMapPreferencesVersion,
  PREFERENCES_VERSION,
  GM_008,
} from './PreferencesSchema';
import { storeMapRecoveryData } from './Recovery';
import {
  MSFFeatureKey,
  MSFImportKey,
  MSFMarkerID,
  MSFMarkerKey,
  MSFRouteID,
} from 'src/components/data/map/Element';
import { f } from 'src/components/i18n/Localization';
import { buildNotification } from 'src/components/redux/slices/common/notify/Dispatch';
import { Notification } from 'src/components/redux/slices/common/notify/Types';
import initialMapState from 'src/components/redux/slices/map/InitialState';
import { MapState } from 'src/components/redux/slices/map/Types';
import { fromBase64, getRecord, getUnixTimestamp, hashObject } from 'src/components/util';

const demercateCoordinate = (coordinate: [number, number]): [number, number] => {
  // Spherical Mercator projection.
  const size = 256 * 2 ** 1;
  const d = size / 2;
  const bc = size / 360;
  const cc = size / (2 * Math.PI);
  const fa = Math.min(Math.max(Math.sin((Math.PI / 180) * coordinate[1]), -0.9999), 0.9999); // Invert lon_lat[1].
  const x = d + coordinate[0] * bc;
  const y = d + 0.5 * Math.log((1 + fa) / (1 - fa)) * -cc;

  return [x, y];
};
const ORIGIN = demercateCoordinate([0, 0]);

const reprojectCoordinate = (coordinate: [number, number]): [number, number] => {
  const demercated = demercateCoordinate([coordinate[1], coordinate[0]]);
  return [(demercated[1] - ORIGIN[1]) * -0.5 + -0.1, (demercated[0] - ORIGIN[0]) * 0.5 + 0.15];
};

// Type guards.
const distinguishLegacyRoute = (value: any): value is LegacyEditorRoute => {
  return _.isArray((value as LegacyEditorRoute).geometry.coordinates[0]);
};

export const importMapEditorDataFromGMLegacy = (
  data: GM_006
): {
  editorData: (EditorMarker | EditorRoute)[];
  notifications: Notification[];
} => {
  const editorElements = data.editor.feature.data;

  const modifiedElements = _.map(editorElements, (element) => {
    if (distinguishLegacyRoute(element)) {
      const coordinates = _.map(element.geometry.coordinates, (coord) =>
        reprojectCoordinate(coord)
      );
      const id = hashObject(coordinates) as MSFRouteID;
      return {
        coordinates,
        id,
        popupTitle: element.properties.popupTitle,
        popupContent: element.properties.popupContent,
        popupMedia: element.properties.popupMedia,
        popupAttribution: 'Unknown',
      } as EditorRoute;
    } else {
      const coordinates = reprojectCoordinate(element.geometry.coordinates);
      const id = hashObject(coordinates) as MSFMarkerID;
      return {
        coordinates,
        id,
        popupTitle: element.properties.popupTitle,
        popupContent: element.properties.popupContent,
        popupMedia: element.properties.popupMedia,
        popupAttribution: 'Unknown',
      } as EditorMarker;
    }
  });

  return {
    editorData: modifiedElements,
    // Else, complete success.
    notifications: [
      buildNotification(
        f('message-import-success', {
          count: modifiedElements.length.toString(),
        }),
        {
          variant: 'success',
        }
      ),
    ],
  };
};

export const importMapMarkerDataFromGMLegacy = (
  data: GM_005
): { completed: GM_006['completed']; notify: GM_006['notify'] } => {
  const dataCompletedFeatures = data.completed.features as Record<
    MSFFeatureKey,
    Record<MSFImportKey, number>
  >;

  const dictionary = buildImportMapping('gm_legacy');
  const getDictionaryEntry = (key: MSFImportKey): MSFMarkerKey[] => {
    return dictionary?.[key] ?? [];
  };

  const missingEntries: MSFImportKey[] = [];
  let totalEntries = 0;

  const featureDataUnmapped = _.fromPairs(
    _.flatMap(
      _.toPairs(dataCompletedFeatures) as [MSFFeatureKey, Record<MSFMarkerID, number>][],
      (entry) => {
        const [featureKey, featureMarkers] = entry;
        const subEntries = _.toPairs(featureMarkers) as [MSFMarkerID, number][];
        totalEntries += subEntries.length;
        const subResult = _.map(subEntries, (subEntry): [MSFImportKey, number] => {
          const [markerID, timestamp] = subEntry;
          const markerKey = `${featureKey}/${markerID}` as MSFImportKey;
          return [markerKey, timestamp];
        });
        return subResult;
      }
    )
  ) as Record<MSFImportKey, number>;

  const featureDataMapped = _.fromPairs(
    _.flatMap(
      _.toPairs(featureDataUnmapped) as [MSFImportKey, number][],
      (featureDataEntry: [MSFImportKey, number]): ([MSFMarkerKey, number] | [])[] => {
        const [importKey, timestamp] = featureDataEntry;
        const dictionaryEntries = getDictionaryEntry(importKey);
        if (dictionaryEntries.length === 0) {
          missingEntries.push(importKey);
          return [];
        }
        const result = _.map(
          dictionaryEntries,
          (dictEntry: MSFMarkerKey): [MSFMarkerKey, number] => [dictEntry, timestamp]
        );
        return result;
      }
    )
  ) as Record<MSFMarkerKey, number>;

  const successfulEntries = _.keys(featureDataMapped).length;

  const partialData = {
    completed: {
      features: featureDataMapped,
    },
    notify: {
      notifications: [] as Notification[],
    },
  };

  if (successfulEntries < totalEntries) {
    // Some entries were missing.
    console.warn(`Skipped over ${missingEntries.length} entries when importing.`);
    console.warn(missingEntries);
    storeMapRecoveryData(
      { missingEntries },
      `[WARN] Could not import ${totalEntries - successfulEntries} entries.`
    );
    partialData.notify.notifications.push(
      buildNotification(
        f('map-ui:message-import-success-partial', {
          success: successfulEntries.toString(),
          count: totalEntries.toString(),
        }),
        {
          variant: 'success',
        }
      )
    );
  } else {
    // Else, complete success.
    partialData.notify.notifications.push(
      buildNotification(
        f('map-ui:message-import-success', {
          count: totalEntries.toString(),
        }),
        {
          variant: 'success',
        }
      )
    );
  }

  return partialData;
};

/**
 * Migrate data if it is an older version, and throw an error for an invalid version..
 * @param {*} input The JSON data.
 * @param {*} version The version prefix.
 */
export const migrateMapData = (
  input: GenshinMapPreferences,
  version: GenshinMapPreferencesVersion,
  defaultState: MapState = initialMapState
): GenshinMapPreferencesLatest | null => {
  console.debug('Migrating data...');

  // eslint-disable-next-line prefer-const
  let output: GenshinMapPreferences = input;

  // By using case fallthrough, we move from
  /* eslint-disable no-fallthrough */
  switch (version) {
    case 'GM_001':
      /*
       * This update adds many new options, so defaults are injected.
       */
      output = output as GM_001;
      output = <GM_002>{
        version: 'GM_002',
        options: {
          ...defaultState.options,
          ...output?.options,
        },
        displayed: {
          ...defaultState.displayed,
          ...output?.displayed,
        },
        completed: {
          ...defaultState.completed,
          ...output?.completed,
        },
        editor: {
          feature: {
            ...defaultState.editor.feature,
            ...output?.editor?.feature,
          },
        },
      };
    case 'GM_002':
      /*
       * This update makes the following changes:
       * - Rename editor.feature.data[#].properties.popupImage to popupMedia.
       */
      output = output as GM_002;
      output = <GM_003>{
        ...output,
        version: 'GM_003',
        editor: {
          ...output?.editor,
          feature: {
            ...output?.editor?.feature,
            data: _.map(
              output?.editor?.feature?.data,
              (
                element: GM_002_EditorMarker | GM_002_EditorRoute
              ): LegacyEditorMarker | LegacyEditorRoute => {
                return {
                  ...element,
                  properties: {
                    popupTitle: element?.properties?.popupTitle,
                    popupContent: element?.properties?.popupContent,
                    popupMedia: element?.properties?.popupImage,
                  },
                };
              }
            ),
          },
        },
      };
    case 'GM_003':
      /*
       * This update makes the following changes:
       * - Rename Hillichurl to Hilichurl.
       * - Rename Hilichurl Shooter to Hillichurl Shooter.
       */
      output = output as GM_003;
      output = <GM_004>{
        ...output,
        version: 'GM_004',
        displayed: {
          ...output?.displayed,
          features: {
            ..._.omit(output?.displayed?.features, [
              'mondstadtHillichurl',
              'liyueHillichurl',
              'mondstadtHillichurlShooter',
              'liyueHillichurlShooter',
              'mondstadtWei',
              'liyueWei',
            ]),
            mondstadtHilichurl: getRecord(
              output?.displayed?.features,
              'mondstadtHillichurl' as MSFFeatureKey,
              false
            ),
            liyueHilichurl: getRecord(
              output?.displayed?.features,
              'liyueHillichurl' as MSFFeatureKey,
              false
            ),
            mondstadtHilichurlShooter: getRecord(
              output?.displayed?.features,
              'mondstadtHillichurlShooter' as MSFFeatureKey,
              false
            ),
            liyueHilichurlShooter: getRecord(
              output?.displayed?.features,
              'liyueHillichurlShooter' as MSFFeatureKey,
              false
            ),
            mondstadtUnusualHilichurl: getRecord(
              output?.displayed?.features,
              'mondstadtWei' as MSFFeatureKey,
              false
            ),
            liyueUnusualHilichurl: getRecord(
              output?.displayed?.features,
              'liyueWei' as MSFFeatureKey,
              false
            ),
          },
        },
        completed: {
          ...output.completed,
          features: {
            ..._.omit(output.completed.features, [
              'mondstadtHillichurl',
              'liyueHillichurl',
              'mondstadtHillichurlShooter',
              'liyueHillichurlShooter',
              'mondstadtWei',
              'liyueWei',
            ]),
            mondstadtHilichurl: getRecord(
              output.completed.features,
              'mondstadtHillichurl' as MSFFeatureKey,
              false
            ),
            liyueHilichurl: getRecord(
              output.completed.features,
              'liyueHillichurl' as MSFFeatureKey,
              false
            ),
            mondstadtHilichurlShooter: getRecord(
              output.completed.features,
              'mondstadtHillichurlShooter' as MSFFeatureKey,
              false
            ),
            liyueHilichurlShooter: getRecord(
              output.completed.features,
              'liyueHillichurlShooter' as MSFFeatureKey,
              false
            ),
            mondstadtUnusualHilichurl: getRecord(
              output.completed.features,
              'mondstadtWei' as MSFFeatureKey,
              false
            ),
            liyueUnusualHilichurl: getRecord(
              output.completed.features,
              'liyueWei' as MSFFeatureKey,
              false
            ),
          },
        },
      };
    case 'GM_004':
      /*
       * This update makes the following changes:
       * - Rename Matsusake to Matsutake.
       */
      output = output as GM_004;
      output = <GM_005>{
        ...output,
        version: 'GM_005',
        displayed: {
          ...output?.displayed,
          features: {
            ..._.omit(output?.displayed?.features, ['mondstadtMatsusake', 'liyueMatsusake']),
            mondstadtMatsutake: getRecord(
              output.displayed.features,
              'mondstadtMatsusake' as MSFFeatureKey,
              false
            ),
            liyueMatsutake: getRecord(
              output.displayed.features,
              'liyueMatsusake' as MSFFeatureKey,
              false
            ),
          },
        },
        completed: {
          ...output?.completed,
          features: {
            ..._.omit(output?.completed?.features, ['mondstadtMatsusake', 'liyueMatsusake']),
            mondstadtMatsutake: getRecord(
              output.completed.features,
              'mondstadtMatsusake' as MSFFeatureKey,
              false
            ),
            liyueMatsutake: getRecord(
              output.completed.features,
              'liyueMatsusake' as MSFFeatureKey,
              false
            ),
          },
        },
      };
    case 'GM_005':
      /**
       * This update makes the following changes:
       * - Migrate marker storage format to MSFv2.
       */
      output = output as GM_005;
      output = <GM_006>{
        ...output,
        version: 'GM_006',
        ...importMapMarkerDataFromGMLegacy(output),
      };
    case 'GM_006':
      /**
       * This update makes the following changes:
       * - Migrate editor data to MSFv2.
       */
      output = output as GM_006;
      const { editorData, notifications } = importMapEditorDataFromGMLegacy(output);
      output = <GM_007>{
        ...output,
        version: 'GM_007',
        notifications,
        options: {
          ...initialMapState.options,
          ...output?.options,
        },
        editor: {
          ...output?.editor,
          feature: {
            ...output?.editor?.feature,
            data: editorData,
          },
        },
      };
    case 'GM_007':
      output = output as GM_007;
      output = <GM_008>{
        ...output,
        version: 'GM_008',
        timestamp: getUnixTimestamp(),
        displayed: {
          ...output.displayed,
          archipelagoTeleporter: true,
        },
      };
    case PREFERENCES_VERSION:
      // Migration is done.
      return <GenshinMapPreferencesLatest>{
        ...output,
        version: PREFERENCES_VERSION,
      };
    default:
      console.error(`[ERROR] Could not identify preferences prefix ${version}`);
      storeMapRecoveryData({ input }, `[ERROR] Could not identify preferences prefix ${version}`);
      return null;
  }
  /* eslint-enable no-fallthrough */
};

/**
 * Parse and migrate data from a current or former version of GenshinMap via string.
 * @param {*} input The input string.
 * @returns The newest data format.
 */
export const parseMapDataFromString = (input: string): GenshinMapPreferencesLatest | null => {
  const decodedData = fromBase64(input);

  const versionPrefix = decodedData.slice(
    0,
    Math.max(0, PREFERENCES_VERSION.length)
  ) as GenshinMapPreferencesVersion;

  const jsonData = JSON.parse(
    decodedData.slice(PREFERENCES_PREFIX.length)
  ) as GenshinMapPreferences;

  const migratedData = migrateMapData(jsonData, versionPrefix);

  return migratedData;
};
