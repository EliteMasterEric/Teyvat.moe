/**
 * Contains methods used to localize individual features.
 * The names of features are located within the JSON data of that feature,
 * rather than the core i18n JSON file.
 */

import _ from 'lodash';

import { MSFLocalizedField, MSFLocalizedString } from 'src/components/data/ElementSchema';
import {
  DEFAULT_LOCALE_CODE,
  getAvailableLanguages,
  getLocale,
  t,
} from 'src/components/i18n/Localization';
import { LocalizedString } from 'src/components/Types';

/**
 * Given a dict, fetch the appropriate key from 'field'
 * @param field A dictionary containing {'locale': 'value'} fields.
 * @returns {value} The value from 'field' whose key matches the current locale, or the default locale.
 */
export const localizeField = (field: MSFLocalizedField | undefined): MSFLocalizedString => {
  if (typeof field === 'undefined') return <MSFLocalizedString>'';

  const currentLanguage = getLocale();

  const currentLanguageVal = field[currentLanguage];
  if (currentLanguageVal != null) {
    return currentLanguageVal;
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
  if (languageOptions != null) return languageOptions;

  // Generate the list of language options.
  languageOptions = getAvailableLanguages().map((localeCode) => {
    return { value: localeCode, label: t('language', localeCode) };
  });

  return languageOptions;
};
