/**
 * Handles the importing of data from the legacy Yuanshen.site.
 */

import _ from 'lodash';

import { getFeatureKeysByFilter, MapFeatures } from '../MapFeatures';

import { getUnixTimestamp, reloadWindow } from '../Util';
import { DEFAULT_MAP_PREFERENCES } from './DefaultPreferences';

/**
 * Feature names are stored only as IDs on Yuanshen.site.
 * For the markers I imported, I kept the marker IDs the same,
 * so 0_23 is mondstadtAnemoculus: {23: true}.
 */
const LEGACY_MAPPING = {
  0: 'mondstadtAnemoculus',
  1: 'liyueGeoculus',
  2: 'mondstadtShrine',
  3: 'liyueShrine',
  4: 'liyueJueyunChili',
  5: 'liyueSilkFlower',
  6: 'liyueGlazeLily',
  7: 'mondstadtWolfhook',
  8: 'mondstadtCallaLily',
  9: 'mondstadtCecilia',
  10: 'mondstadtPhilanemoMushroom',
  11: 'mondstadtValberry',
  12: 'mondstadtWindwheelAster',
  13: 'mondstadtDandelionSeed',
  14: 'liyueNoctilucousJade',
  15: 'liyueCorLapis',
  16: 'liyueCrystalChunk',
  17: 'liyueWhiteIronChunk',
  18: 'mondstadtCrystalChunk',
  19: 'mondstadtWhiteIronChunk',
  20: 'liyueRuinGuard',
  21: 'liyueRuinHunter',
  22: 'liyueFatuiElectroCicinMage',
  23: 'liyueFatuiPyroAgent',
  24: 'liyueAbyssMage',
  25: 'liyueMitachurl',
  // mondstadtChests
  // liyueChests
  28: 'liyueVioletgrass',
  29: 'mondstadtRuinGuard',
  30: 'mondstadtMitachurl',
  31: 'mondstadtAbyssMage',
  32: 'mondstadtFatuiElectroCicinMage',
  // mondstadtTreasureHoarder
  34: 'liyueTreasureHoarder',
  35: 'mondstadtWhopperflower',
  36: 'liyueWhopperflower',
  37: 'mondstadtFatuiSkirmisher',
  38: 'liyueFatuiSkirmisher',
  39: 'liyueGeovishapHatchling',
  40: 'mondstadtSlime',
  41: 'liyueSlime',
  // ???
  // ???
  44: 'liyueQingxin',
  45: 'liyueHorsetail',
  46: 'liyueLotusPetal',
  47: 'liyueStarconch',
  48: 'mondstadtSmallLampGrass',
  49: 'mondstadtMistFlowerCorolla',
  50: 'liyueMistFlowerCorolla',
  51: 'mondstadtFlamingFlowerStamen',
  52: 'liyueFlamingFlowerStamen',
  53: 'mondstadtElectoCrystal',
  54: 'liyueElectoCrystal',
  // mondstadtMoraSquirrel
  // liyueMoraSquirrel
  57: 'mondstadtLuminescentSpine',
  58: 'liyueLuminescentSpine',
  59: 'mondstadtCrystalCore',
  60: 'liyueCrystalCore',
  61: 'mondstadtSnapdragon',
  62: 'liyueSnapdragon',
  63: 'mondstadtButterfly',
  64: 'liyueButterfly',
  // Shrimp???
  // Shrimp???
  67: 'mondstadtFrog',
  68: 'liyueFrog',
  69: 'mondstadtSweetFlower',
  70: 'liyueSweetFlower',
  71: 'mondstadtMint',
  72: 'liyueMint',
  73: 'mondstadtMatsusake',
  74: 'liyueMatsusake',
  75: 'mondstadtRawMeat',
  76: 'liyueRawMeat',
  77: 'mondstadtFowl',
  78: 'liyueFowl',
  79: 'mondstadtFish',
  80: 'liyueFish',
  81: 'mondstadtRadish',
  82: 'liyueRadish',
  83: 'mondstadtCarrot',
  84: 'liyueCarrot',
  85: 'mondstadtMushroom',
  86: 'liyueMushroom',
  87: 'mondstadtLizardTail',
  88: 'liyueLizardTail',
  89: 'mondstadtPinecone',
  90: 'liyuePinecone',
  91: 'mondstadtBerry',
  92: 'liyueBerry',
  93: 'mondstadtHillichurl',
  94: 'liyueHillichurl',
  95: 'mondstadtSamachurl',
  96: 'liyueSamachurl',
};

const processChestFeatures = (featureKeys) => {
  return _.fromPairs(
    _.flatten(
      featureKeys.map((featureKey) => {
        const feature = MapFeatures[featureKey];

        return feature.data.map((featureMarker) => {
          return [String(featureMarker.id), featureKey];
        });
      })
    )
  );
};

const MONDSTADT_CHEST_ID = '26';
const MONDSTADT_CHEST_KEYS = getFeatureKeysByFilter('mondstadt', 'chest');
const MONDSTADT_CHEST_LIST = processChestFeatures(MONDSTADT_CHEST_KEYS);

const LIYUE_CHEST_ID = '27';
const LIYUE_CHEST_KEYS = getFeatureKeysByFilter('liyue', 'chest');
const LIYUE_CHEST_LIST = processChestFeatures(LIYUE_CHEST_KEYS);

const LEGACY_ENTRY_REGEX = new RegExp(/([0-9]+)_([0-9]+)/);

const parseLegacyEntry = (element) => {
  // Is this a string?
  if (typeof element !== 'string' && !(element instanceof String)) return null;

  // Is it in the format 12_34?
  // Returns null if no match is found.
  const splitElement = LEGACY_ENTRY_REGEX.exec(element);
  if (splitElement == null || splitElement.length !== 3) return null;

  let featureKey = null;
  switch (splitElement[1]) {
    case MONDSTADT_CHEST_ID:
      if (splitElement[2] in MONDSTADT_CHEST_LIST) {
        featureKey = MONDSTADT_CHEST_LIST[splitElement[2]];
      } else {
        console.error(`[ERROR]: Missing Mondstadt Chest ID ${splitElement[2]}`);
      }

      break;
    case LIYUE_CHEST_ID:
      if (splitElement[2] in LIYUE_CHEST_LIST) {
        featureKey = LIYUE_CHEST_LIST[splitElement[2]];
      } else {
        console.error(`[ERROR]: Missing Liyue Chest ID ${splitElement[2]}`);
      }
      break;
    default:
      featureKey = LEGACY_MAPPING[splitElement[1]];
  }
  const markerId = splitElement[2];

  if (featureKey === undefined) return null;

  return `${featureKey}.${markerId}`;
};

export const parseLegacyDataFromString = (input) => {
  const jsonData = JSON.parse(input);

  const importedData = {
    completed: {
      features: {},
    },
  };

  const currentTime = getUnixTimestamp();

  if (Array.isArray(jsonData)) {
    jsonData.forEach((jsonDataElement) => {
      const entry = parseLegacyEntry(jsonDataElement);

      if (entry == null) return;

      const fullPath = `completed.features.${entry}`;

      _.setWith(importedData, fullPath, currentTime, Object);
    });
  } else {
    console.error('Could not import legacy data, did not match expected format.');
  }

  return importedData;
};

/**
 * Import data from a current or former version of GenshinMap.
 * @param {*} input The input JSON string.
 * @param {*} setMapPreferences The function to set the map preferences state.
 */
export const importLegacyDataFromString = (input, setMapPreferences) => {
  const jsonData = JSON.parse(input);

  const importedData = _.cloneDeep(DEFAULT_MAP_PREFERENCES);

  const currentTime = getUnixTimestamp();

  // Mark if any data was imported.
  let wroteData = false;
  if (Array.isArray(jsonData)) {
    jsonData.forEach((jsonDataElement) => {
      const entry = parseLegacyEntry(jsonDataElement);

      if (entry == null) return;

      const fullPath = `completed.features.${entry}`;

      _.setWith(importedData, fullPath, currentTime, Object);

      wroteData = true;
    });
  } else {
    console.error('Could not import legacy data, did not match expected format.');
  }

  // Set local storage if data was imported.
  if (wroteData) {
    setMapPreferences(importedData);
    // Reload when there's a big data change.
    reloadWindow();
  } else {
    console.warn('No data to import.');
  }
};
