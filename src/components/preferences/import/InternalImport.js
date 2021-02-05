/**
 * Handling importing of data from the new site,
 * either via string or from the local storage.
 *
 * Includes migration handling and recovery states.
 */

import _ from 'lodash';

import { f } from '~/components/i18n/Localization';
import {
  GENSHINMAP_DATA_VERSION,
  DEFAULT_MAP_PREFERENCES,
  PREFERENCES_PREFIX,
} from '~/components/preferences/DefaultPreferences';
import { buildImportMapping } from '~/components/preferences/import/ImportDictionary';
import { storeRecoveryData } from '~/components/preferences/import/Recovery';
import { fromBase64, hashObject } from '~/components/Util';

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

export const importEditorDataFromGMLegacy = (data) => {
  const editorElements = data.editor.feature.data;

  const modifiedElements = editorElements.map((element) => {
    const isRoute = Array.isArray(element.geometry.coordinates[0]);
    const coordinates = isRoute
      ? element.geometry.coordinates.map((coord) => reprojectCoordinate(coord))
      : reprojectCoordinate(element.geometry.coordinates);
    return {
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
    currentToast: {
      ...DEFAULT_MAP_PREFERENCES.currentToast,
      message: f('message-import-success', { count: modifiedElements.length }),
    },
  };
};

export const importMarkerDataFromGMLegacy = (data) => {
  const dataCompletedFeatures = data.completed.features;

  const dictionary = buildImportMapping('gm_legacy');

  const missingEntries = [];
  let totalEntries = 0;

  // Map each externalsite entry to a GenshinMap entry.
  const fullDataMapped = _.filter(
    _.keys(dataCompletedFeatures).map((featureKey) => {
      return _.keys(dataCompletedFeatures[featureKey]).map((markerKey) => {
        const entry = `${featureKey}/${markerKey}`;
        totalEntries += 1;
        if (entry in dictionary) {
          const timestamp = dataCompletedFeatures[featureKey][markerKey];
          return [dictionary[entry], timestamp];
        }
        // Else, add to a list.
        missingEntries.push(entry);
        return [];
      });
    }),
    _.size
  );

  const featureData = _.fromPairs(_.flatten(fullDataMapped));

  const successfulEntries = _.keys(featureData).length;

  const partialData = {
    completed: {
      features: featureData,
    },
  };

  if (successfulEntries < totalEntries) {
    // Some entries were missing.
    console.warn(`Skipped over ${missingEntries} entries when importing.`);
    console.warn(missingEntries);
    storeRecoveryData(
      missingEntries,
      `[WARN] Could not import ${totalEntries - successfulEntries} entries.`
    );
    partialData.currentToast = {
      ...DEFAULT_MAP_PREFERENCES.currentToast,
      message: f('message-import-success-partial', {
        success: successfulEntries,
        count: totalEntries,
      }),
    };
  } else {
    // Else, complete success.
    partialData.currentToast = {
      ...DEFAULT_MAP_PREFERENCES.currentToast,
      message: f('message-import-success', { count: totalEntries }),
    };
  }

  return partialData;
};

/**
 * Migrate data if it is an older version, and throw an error for an invalid version..
 * @param {*} input The JSON data.
 * @param {*} version The version prefix.
 */
export const migrateData = (input, version) => {
  // eslint-disable-next-line prefer-const
  let output = input;

  // By using case fallthrough, we move from
  /* eslint-disable no-fallthrough */
  switch (version) {
    default:
      console.error(`[ERROR] Could not identify preferences prefix ${version}`);
      storeRecoveryData(input, `[ERROR] Could not identify preferences prefix ${version}`);
      return null;
    case 'GM_001':
      /*
       * This update adds many new options, so defaults are injected.
       */
      output = {
        options: {
          ...DEFAULT_MAP_PREFERENCES.options,
          ...output.options,
        },
        displayed: {
          ...DEFAULT_MAP_PREFERENCES.displayed,
          ...output.displayed,
        },
        completed: {
          ...DEFAULT_MAP_PREFERENCES.completed,
          ...output.completed,
        },
        editor: {
          feature: {
            ...DEFAULT_MAP_PREFERENCES.editor.feature,
            data: output.editor.feature.data,
          },
        },
      };
    case 'GM_002':
      /*
       * This update makes the following changes:
       * - Rename editor.feature.data[#].properties.popupImage to popupMedia.
       */
      output = {
        ...output,
        editor: {
          ...output.editor,
          feature: {
            ...output.editor.feature,
            data: output.editor.feature.data.map((element) => {
              return {
                ...element,
                properties: {
                  popupTitle: element.properties.popupTitle,
                  popupContent: element.properties.popupContent,
                  popupMedia: element.properties.popupImage,
                },
              };
            }),
          },
        },
      };
    case 'GM_003':
      /*
       * This update makes the following changes:
       * - Rename Hillichurl to Hilichurl.
       * - Rename Hilichurl Shooter to Hillichurl Shooter.
       */
      output = {
        ...output,
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
            mondstadtHilichurl: output.displayed.features.mondstadtHillichurl,
            liyueHilichurl: output.displayed.features.liyueHillichurl,
            mondstadtHilichurlShooter: output.displayed.features.mondstadtHillichurlShooter,
            liyueHilichurlShooter: output.displayed.features.liyueHillichurlShooter,
            mondstadtUnusualHilichurl: output.displayed.features.mondstadtWei,
            liyueUnusualHilichurl: output.displayed.features.liyueWei,
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
            mondstadtHilichurl: output.completed.features.mondstadtHillichurl,
            liyueHilichurl: output.completed.features.liyueHillichurl,
            mondstadtHilichurlShooter: output.completed.features.mondstadtHillichurlShooter,
            liyueHilichurlShooter: output.completed.features.liyueHillichurlShooter,
            mondstadtUnusualHilichurl: output.completed.features.mondstadtWei,
            liyueUnusualHilichurl: output.completed.features.liyueWei,
          },
        },
      };
    case 'GM_004':
      /*
       * This update makes the following changes:
       * - Rename Matsusake to Matsutake.
       */
      output = {
        ...output,
        displayed: {
          ...output.displayed,
          features: {
            ..._.omit(output.displayed.features, ['mondstadtMatsusake', 'liyueMatsusake']),
            mondstadtMatsutake: output.displayed.features.mondstadtMatsusake,
            liyueMatsutake: output.displayed.features.liyueMatsusake,
          },
        },
        completed: {
          ...output.completed,
          features: {
            ..._.omit(output.completed.features, ['mondstadtMatsusake', 'liyueMatsusake']),
            mondstadtMatsutake: output.completed.features.mondstadtMatsusake,
            liyueMatsutake: output.completed.features.liyueMatsusake,
          },
        },
      };
    case 'GM_005':
      /**
       * This update makes the following changes:
       * - Migrate marker storage format to MSFv2.
       */
      output = {
        ...output,
        ...importMarkerDataFromGMLegacy(output),
      };
    case 'GM_006':
      /**
       * This update makes the following changes:
       * - Migrate editor data to MSFv2.
       */
      const { editorData, currentToast } = importEditorDataFromGMLegacy(output);
      output = {
        ...output,
        currentToast,
        editor: {
          ...output.editor,
          feature: {
            ...output.editor.feature,
            data: editorData,
          },
        },
      };
    case GENSHINMAP_DATA_VERSION:
      // Migration is done.
      return {
        ...output,
        version: GENSHINMAP_DATA_VERSION,
      };
  }
  /* eslint-enable no-fallthrough */
};

/**
 * Parse and migrate data from a current or former version of GenshinMap via string.
 * @param {*} input The input string.
 * @returns The newest data format.
 */
export const parseDataFromString = (input) => {
  const decodedData = fromBase64(input);

  const versionPrefix = decodedData.substring(0, GENSHINMAP_DATA_VERSION.length);

  const jsonData = JSON.parse(decodedData.substring(PREFERENCES_PREFIX.length));

  const migratedData = migrateData(jsonData, versionPrefix);

  return migratedData;
};
