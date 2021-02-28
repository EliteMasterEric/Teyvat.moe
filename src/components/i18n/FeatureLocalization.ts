/**
 * Contains methods used to localize individual features.
 * The names of features are located within the JSON data of that feature,
 * rather than the core i18n JSON file.
 */

import _ from 'lodash';

import { MSFLocalizedField, MSFLocalizedString } from '~/components/data/ElementSchema';
import {
  DEFAULT_LOCALE_CODE,
  getAvailableLanguages,
  getLocale,
  t,
} from '~/components/i18n/Localization';
import { LocalizedString } from '~/components/Types';

/**
 * Given a dict, fetch the appropriate key from 'field'
 * @param field A dictionary containing {'locale': 'value'} fields.
 * @returns {value} The value from 'field' whose key matches the current locale, or the default locale.
 */
export const localizeField = (field: MSFLocalizedField): MSFLocalizedString => {
  if (!field) return <MSFLocalizedString>'';

  const currentLanguage = getLocale();
  if (field[currentLanguage]) {
    return field[currentLanguage];
  }
  // Else, fall back to default locale.
  if (field[DEFAULT_LOCALE_CODE]) {
    return field[DEFAULT_LOCALE_CODE];
  }
  // Else, return null.
  return <MSFLocalizedString>'';
};

let languageOptions: { value: string; label: LocalizedString }[];
export const getLanguageOptions = (): typeof languageOptions => {
  if (typeof languageOptions !== 'undefined') return languageOptions;

  // Generate the list of language options.
  languageOptions = getAvailableLanguages().map((localeCode) => {
    return { value: localeCode, label: t('language', localeCode) };
  });

  return languageOptions;
};
