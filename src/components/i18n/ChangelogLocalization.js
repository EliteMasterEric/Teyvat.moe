/**
 * Contains methods which facilitate translation between languages.
 * Relies on 2-letter locales.
 */

import _ from 'lodash';

import { DEFAULT_LOCALE_CODE } from '~/components/preferences/DefaultPreferences';
import { importFromContext } from '../Util';

/**
 * The require context referencing all the localization files.
 */
const i18nContext = require.context('../../data/i18n/changelog', true, /.jsonc$/);

const DEFAULT_LOCALE_FILE = `./${DEFAULT_LOCALE_CODE}.jsonc`;

/**
 * A list of JSON file paths, excluding the default locale.
 */
const i18nKeys = i18nContext.keys().filter((key) => key !== DEFAULT_LOCALE_FILE);

// ex [./en-US.json, en-US].
const getLocaleFromI18nFilePath = (string) => {
  const match = string.match(/\.\/([-_a-zA-Z0-9]+)\.jsonc/);
  return match ? match[1] : 'UNKNOWN';
};

/**
 * A map of locales and JSON data objects, including the default locale (it must be moved to the front).
 */
const i18nData = _.fromPairs(
  [DEFAULT_LOCALE_FILE, ...i18nKeys].map((filePath) => {
    return [getLocaleFromI18nFilePath(filePath), importFromContext(i18nContext, filePath)];
  })
);

export const getChangelogData = (locale = 'en') => {
  return locale in i18nData ? i18nData[locale] : i18nData[DEFAULT_LOCALE_CODE];
};
