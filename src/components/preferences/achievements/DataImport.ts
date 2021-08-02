/**
 * Handling importing of data from the new site,
 * either via string or from the local storage.
 *
 * Includes migration handling and recovery states.
 */

import _ from 'lodash';

import { PREFERENCES_PREFIX } from './DataExport';
import {
  ACH_001,
  PREFERENCES_VERSION,
  TeyvatMoeAchievementPreferences,
  TeyvatMoeAchievementPreferencesLatest,
  TeyvatMoeAchievementPreferencesVersion,
} from './PreferencesSchema';
import { storeAchievementsRecoveryData } from './Recovery';
import { fromBase64 } from 'src/components/util';

/**
 * Migrate data if it is an older version, and throw an error for an invalid version..
 * @param {*} input The JSON data.
 * @param {*} version The version prefix.
 */
export const migrateAchievementsData = (
  input: TeyvatMoeAchievementPreferences,
  version: TeyvatMoeAchievementPreferencesVersion
  // defaultState: AchievementsState = initialAchievementsState
): TeyvatMoeAchievementPreferencesLatest | null => {
  console.debug('Migrating data...');

  // eslint-disable-next-line prefer-const
  let output: TeyvatMoeAchievementPreferences = input;

  // By using case fallthrough, we move from
  /* eslint-disable no-fallthrough */
  switch (version) {
    case PREFERENCES_VERSION:
      // Migration is done.
      return <TeyvatMoeAchievementPreferencesLatest>{
        ...output,
        version: PREFERENCES_VERSION,
      };
    default:
      console.error(`[ERROR] Could not identify preferences prefix ${version}`);
      storeAchievementsRecoveryData(
        { input },
        `[ERROR] Could not identify preferences prefix ${version}`
      );
      return null;
  }
  /* eslint-enable no-fallthrough */
};

/**
 * Parse and migrate data from a current or former version of GenshinMap via string.
 * @param {*} input The input string.
 * @returns The newest data format.
 */
export const parseAchievementsDataFromString = (
  input: string
): TeyvatMoeAchievementPreferencesLatest | null => {
  const decodedData = fromBase64(input);

  const versionPrefix = decodedData.slice(
    0,
    Math.max(0, PREFERENCES_VERSION.length)
  ) as TeyvatMoeAchievementPreferencesVersion;

  const jsonData = JSON.parse(
    decodedData.slice(PREFERENCES_PREFIX.length)
  ) as TeyvatMoeAchievementPreferences;

  const migratedData = migrateAchievementsData(jsonData, versionPrefix);

  return migratedData;
};
