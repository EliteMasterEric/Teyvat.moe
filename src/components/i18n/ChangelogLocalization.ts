/**
 * Contains methods which facilitate translation between languages.
 * Relies on 2-letter locales.
 */

import _ from 'lodash';

import { ChangelogData } from 'src/components/data/ChangelogSchema';
import { DEFAULT_LOCALE_CODE } from 'src/components/i18n/Localization';
import { importFromContext } from 'src/components/util';

/**
 * The require context referencing all the localization files.
 */
const i18nContext = require.context('../../data/i18n/changelog', true, /.json$/);

const DEFAULT_LOCALE_FILE = `./${DEFAULT_LOCALE_CODE}.json`;

/**
 * A list of JSON file paths, excluding the default locale.
 */
const i18nKeys = i18nContext.keys().filter((key) => key !== DEFAULT_LOCALE_FILE);

// ex [./en-US.json, en-US].
const getLocaleFromI18nFilePath = (input: string) => {
  const match = input.match(/\.\/([-_a-zA-Z0-9]+)\.json/);
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

export const getChangelogData = (locale: string | null = null): ChangelogData => {
  if (locale != null) {
    if (locale in i18nData) {
      return i18nData[locale];
    }
  }
  return i18nData[DEFAULT_LOCALE_CODE];
};
