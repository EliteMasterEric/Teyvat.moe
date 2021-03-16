/**
 * Handling importing of data from the new site,
 * either via string or from the local storage.
 *
 * Includes migration handling and recovery states.
 */

import _ from 'lodash';

import {
  MSFFeatureKey,
  MSFImportKey,
  MSFMarkerID,
  MSFMarkerKey,
} from '~/components/data/ElementSchema';
import { f } from '~/components/i18n/Localization';
import { PREFERENCES_PREFIX } from '~/components/preferences/DataExport';
import {
  EditorMarker,
  GM_002_EditorMarker,
  GM_002_EditorRoute,
  LegacyEditorMarker,
  LegacyEditorRoute,
} from '~/components/preferences/EditorDataSchema';
import { buildImportMapping } from '~/components/preferences/ExternalImportDictionary';
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
} from '~/components/preferences/PreferencesSchema';
import { storeRecoveryData } from '~/components/preferences/Recovery';
import { Notification, buildNotification } from '~/components/redux/slices/notify';
import { AppState, initialState } from '~/components/redux/types';
import { fromBase64, hashObject } from '~/components/util';

const demercateCoordinate = (coordinate) => {
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

const reprojectCoordinate = (coordinate) => {
  const demercated = demercateCoordinate([coordinate[1], coordinate[0]]);
  return [(demercated[1] - ORIGIN[1]) * -0.5 + -0.1, (demercated[0] - ORIGIN[0]) * 0.5 + 0.15];
};

export const importEditorDataFromGMLegacy = (
  data: GM_006
): { editorData: EditorMarker[]; notifications: Notification[] } => {
  const editorElements = data.editor.feature.data;

  const modifiedElements = editorElements.map((element) => {
    const isRoute = Array.isArray(element.geometry.coordinates[0]);
    const coordinates = isRoute
      ? element.geometry.coordinates.map((coord) => reprojectCoordinate(coord))
      : reprojectCoordinate(element.geometry.coordinates);
    return <EditorMarker>{
      coordinates,
      id: hashObject(coordinates),
      popupTitle: element.properties.popupTitle,
      popupContent: element.properties.popupContent,
      popupMedia: element.properties.popupMedia,
      popupAttribution: 'Unknown',
    };
  });

  return {
    editorData: modifiedElements,
    // Else, complete success.
    notifications: [
      buildNotification(
        f('message-import-success', { count: modifiedElements.length.toString() }),
        {
          variant: 'success',
        }
      ),
    ],
  };
};

export const importMarkerDataFromGMLegacy = (
  data: GM_005
): { completed: GM_006['completed']; notify: GM_006['notify'] } => {
  const dataCompletedFeatures = data.completed.features as Record<
    MSFFeatureKey,
    Record<MSFImportKey, number>
  >;

  const dictionary = buildImportMapping('gm_legacy');

  const missingEntries = [];
  let totalEntries = 0;

  const featureDataUnmapped = _.fromPairs(
    _.flatten(
      _.map(
        _.entries(dataCompletedFeatures) as [MSFFeatureKey, Record<MSFMarkerID, number>][],
        (entry) => {
          const [featureKey, featureMarkers] = entry;
          const subEntries = _.entries(featureMarkers) as [MSFMarkerID, number][];
          totalEntries += subEntries.length;
          const subResult = _.map(subEntries, (subEntry): [MSFImportKey, number] => {
            const [markerID, timestamp] = subEntry;
            const markerKey = `${featureKey}/${markerID}` as MSFImportKey;
            return [markerKey, timestamp];
          });
          return subResult;
        }
      )
    )
  ) as Record<MSFImportKey, number>;

  const featureDataMapped = _.fromPairs(
    _.flatten(
      _.map(
        _.entries(featureDataUnmapped) as [MSFImportKey, number][],
        (entry: [MSFImportKey, number]): ([MSFMarkerKey, number] | [])[] => {
          const [importKey, timestamp] = entry;
          if (importKey in dictionary) {
            const result = _.map(dictionary[importKey], (entry: MSFMarkerKey): [
              MSFMarkerKey,
              number
            ] => [entry, timestamp]);
            return result;
          } else {
            return [];
          }
        }
      )
    )
  ) as Record<MSFMarkerKey, number>;

  const successfulEntries = _.keys(featureDataMapped).length;

  const partialData = {
    completed: {
      features: featureDataMapped,
    },
    notify: {
      notifications: [],
    },
  };

  if (successfulEntries < totalEntries) {
    // Some entries were missing.
    console.warn(`Skipped over ${missingEntries} entries when importing.`);
    console.warn(missingEntries);
    storeRecoveryData(
      { missingEntries },
      `[WARN] Could not import ${totalEntries - successfulEntries} entries.`
    );
    partialData.notify.notifications.push([
      buildNotification(
        f('message-import-success-partial', {
          success: successfulEntries.toString(),
          count: totalEntries.toString(),
        }),
        {
          variant: 'success',
        }
      ),
    ]);
  } else {
    // Else, complete success.
    partialData.notify.notifications.push([
      buildNotification(
        f('message-import-success', {
          count: totalEntries.toString(),
        }),
        {
          variant: 'success',
        }
      ),
    ]);
  }

  return partialData;
};

/**
 * Migrate data if it is an older version, and throw an error for an invalid version..
 * @param {*} input The JSON data.
 * @param {*} version The version prefix.
 */
export const migrateData = (
  input: GenshinMapPreferences,
  version: GenshinMapPreferencesVersion,
  defaultState: AppState = initialState
): GenshinMapPreferencesLatest => {
  // eslint-disable-next-line prefer-const
  let output: GenshinMapPreferences = input;

  // By using case fallthrough, we move from
  /* eslint-disable no-fallthrough */
  switch (version) {
    default:
      console.error(`[ERROR] Could not identify preferences prefix ${version}`);
      storeRecoveryData({ input }, `[ERROR] Could not identify preferences prefix ${version}`);
      return null;
    case 'GM_001':
      /*
       * This update adds many new options, so defaults are injected.
       */
      output = output as GM_001;
      output = <GM_002>{
        version: 'GM_002',
        options: {
          ...defaultState.options,
          ...output.options,
        },
        displayed: {
          ...defaultState.displayed,
          ...output.displayed,
        },
        completed: {
          ...defaultState.completed,
          ...output.completed,
        },
        editor: {
          feature: {
            ...defaultState.editor.feature,
            data: output.editor.feature.data,
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
          ...output.editor,
          feature: {
            ...output.editor.feature,
            data: _.map(
              output.editor.feature.data,
              (
                element: GM_002_EditorMarker | GM_002_EditorRoute
              ): LegacyEditorMarker | LegacyEditorRoute => {
                return {
                  ...element,
                  properties: {
                    popupTitle: element.properties.popupTitle,
                    popupContent: element.properties.popupContent,
                    popupMedia: element.properties.popupImage,
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
          ...output.displayed,
          features: {
            ..._.omit(output.displayed.features, [
              'mondstadtHillichurl',
              'liyueHillichurl',
              'mondstadtHillichurlShooter',
              'liyueHillichurlShooter',
              'mondstadtWei',
              'liyueWei',
            ]),
            mondstadtHilichurl: output.displayed.features?.['mondstadtHillichurl'],
            liyueHilichurl: output.displayed.features?.['liyueHillichurl'],
            mondstadtHilichurlShooter: output.displayed.features?.['mondstadtHillichurlShooter'],
            liyueHilichurlShooter: output.displayed.features?.['liyueHillichurlShooter'],
            mondstadtUnusualHilichurl: output.displayed.features?.['mondstadtWei'],
            liyueUnusualHilichurl: output.displayed.features?.['liyueWei'],
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
            mondstadtHilichurl: output.completed.features?.['mondstadtHillichurl'],
            liyueHilichurl: output.completed.features?.['liyueHillichurl'],
            mondstadtHilichurlShooter: output.completed.features?.['mondstadtHillichurlShooter'],
            liyueHilichurlShooter: output.completed.features?.['liyueHillichurlShooter'],
            mondstadtUnusualHilichurl: output.completed.features?.['mondstadtWei'],
            liyueUnusualHilichurl: output.completed.features?.['liyueWei'],
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
          ...output.displayed,
          features: {
            ..._.omit(output.displayed.features, ['mondstadtMatsusake', 'liyueMatsusake']),
            mondstadtMatsutake: output.displayed.features?.['mondstadtMatsusake'],
            liyueMatsutake: output.displayed.features?.['liyueMatsusake'],
          },
        },
        completed: {
          ...output.completed,
          features: {
            ..._.omit(output.completed.features, ['mondstadtMatsusake', 'liyueMatsusake']),
            mondstadtMatsutake: output.completed.features?.['mondstadtMatsusake'],
            liyueMatsutake: output.completed.features?.['liyueMatsusake'],
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
        ...importMarkerDataFromGMLegacy(output),
      };
    case 'GM_006':
      /**
       * This update makes the following changes:
       * - Migrate editor data to MSFv2.
       */
      output = output as GM_006;
      const { editorData, notifications } = importEditorDataFromGMLegacy(output);
      output = <GM_007>{
        ...output,
        version: 'GM_007',
        notifications,
        options: {
          ...initialState.options,
          ...output.options,
        },
        editor: {
          ...output.editor,
          feature: {
            ...output.editor.feature,
            data: editorData,
          },
        },
      };
    case PREFERENCES_VERSION:
      // Migration is done.
      return <GenshinMapPreferencesLatest>{
        ...output,
        version: PREFERENCES_VERSION,
      };
  }
  /* eslint-enable no-fallthrough */
};

/**
 * Parse and migrate data from a current or former version of GenshinMap via string.
 * @param {*} input The input string.
 * @returns The newest data format.
 */
export const parseDataFromString = (input: string): GenshinMapPreferencesLatest => {
  const decodedData = fromBase64(input);

  const versionPrefix = decodedData.substring(
    0,
    PREFERENCES_VERSION.length
  ) as GenshinMapPreferencesVersion;

  const jsonData = JSON.parse(
    decodedData.substring(PREFERENCES_PREFIX.length)
  ) as GenshinMapPreferences;

  const migratedData = migrateData(jsonData, versionPrefix);

  return migratedData;
};
