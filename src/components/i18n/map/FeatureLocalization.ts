/**
 * Contains methods used to localize individual features.
 * The names of features are located within the JSON data of that feature,
 * rather than the core i18n JSON file.
 */

import _ from 'lodash';

import { MSFLocalizedField, MSFLocalizedString } from 'src/components/data/map/Element';
import {
  DEFAULT_LOCALE_CODE,
  getLanguageName,
  getLocale,
  LanguageCode,
  languageCodeList,
} from 'src/components/i18n/Localization';

/**
 * Given a dict, fetch the appropriate key from 'field'
 * @param field A dictionary containing {'locale': 'value'} fields.
 * @returns {value} The value from 'field' whose key matches the current locale, or the default locale.
 */
export const localizeField = (field: MSFLocalizedField | undefined): MSFLocalizedString => {
  if (_.isUndefined(field)) return <MSFLocalizedString>'';

  const currentLanguage = getLocale();

  const currentLanguageValue = field[currentLanguage];
  if (currentLanguageValue != null) {
    return currentLanguageValue;
  }
  // Else, fall back to default locale.
  const defaultLanguageValue = field[DEFAULT_LOCALE_CODE];
  if (defaultLanguageValue != null) {
    return defaultLanguageValue;
  }
  // Else, return null.
  return <MSFLocalizedString>'';
};

export const getLanguageOptions = (
  source: string
): Array<{ value: LanguageCode; label: string }> => {
  return _.map(languageCodeList, (lang) => {
    return { value: lang, label: getLanguageName(source, lang) };
  });
};
