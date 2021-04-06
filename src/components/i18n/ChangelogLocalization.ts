/**
 * Contains methods which facilitate translation between languages.
 * Relies on 2-letter locales.
 */

import _ from 'lodash';

import { ChangelogData } from 'src/components/data/ChangelogSchema';
import { DEFAULT_LOCALE_CODE, LanguageCode } from 'src/components/i18n/Localization';
import { importFromContext } from 'src/components/util';

/**
 * The require context referencing all the localization files.
 */
const i18nContext = require.context(
  'src/data/i18n/changelog',
  true,
  /\.json$/,
  'lazy' // webpackMode
);

export const getChangelogData = async (
  locale: LanguageCode | null = null
): Promise<ChangelogData> => {
  if (locale != null) {
    // Else, load from another language.
    const localeFile = `./${locale}.json`;
    const result = await importFromContext(i18nContext, localeFile);
    if (result != null) {
      return result;
    }
  }
  // Fall back to default locale.
  return await importFromContext(i18nContext, `./${DEFAULT_LOCALE_CODE}.json`);
};
