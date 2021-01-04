/**
 * Contains methods used to localize individual features.
 * The names of features are located within the JSON data of that feature,
 * rather than the core i18n JSON file.
 */

import _ from 'lodash';

import { getAvailableLanguages, getLocale, t } from '~/components/i18n/Localization';
import { DEFAULT_LOCALE_CODE } from '~/components/preferences/DefaultPreferences';

/**
 * Given a dict, fetch the appropriate key from 'field'
 * @param {*} field A dictionary containing {'locale': 'value'} fields.
 * @returns {value} The value from 'field' whose key matches the current locale, or the default locale.
 */
export const localizeField = (field) => {
  if (!field) return '';

  const currentLanguage = getLocale();
  if (field[currentLanguage]) {
    return field[currentLanguage];
  }
  // Else, fall back to default locale.
  if (field[DEFAULT_LOCALE_CODE]) {
    return field[DEFAULT_LOCALE_CODE];
  }
  // Else, return null.
  return '';
};

const FEATURE_TO_LOCALIZE = ['name'];
const FEATURE_DATA_KEY = 'data';
const FEATURE_TO_LOCALIZE_DATA = ['properties.popupTitle', 'properties.popupContent'];
export const localizeFeature = (feature) => {
  const newFeature = _.cloneDeep(feature);

  FEATURE_TO_LOCALIZE.forEach((field) => {
    const unlocalized = _.get(newFeature, field);
    const localized = localizeField(unlocalized);
    _.set(newFeature, field, localized);
  });

  newFeature[FEATURE_DATA_KEY] = newFeature[FEATURE_DATA_KEY].map((data) => {
    const newData = _.cloneDeep(data);
    FEATURE_TO_LOCALIZE_DATA.forEach((field) => {
      const unlocalized = _.get(data, field);
      const localized = localizeField(unlocalized);
      _.set(newData, field, localized);
    });

    return newData;
  });

  return newFeature;
};

const ROUTE_TO_LOCALIZE = ['name'];
const ROUTE_DATA_KEY = 'data';
const ROUTE_TO_LOCALIZE_DATA = ['properties.popupTitle', 'properties.popupContent'];
export const localizeRoute = (route) => {
  const newRoute = _.cloneDeep(route);

  ROUTE_TO_LOCALIZE.forEach((field) => {
    const unlocalized = _.get(newRoute, field);
    const localized = localizeField(unlocalized);
    _.set(newRoute, field, localized);
  });

  newRoute[ROUTE_DATA_KEY] = newRoute[ROUTE_DATA_KEY].map((data) => {
    const newData = _.cloneDeep(data);
    ROUTE_TO_LOCALIZE_DATA.forEach((field) => {
      const unlocalized = _.get(data, field);
      const localized = localizeField(unlocalized);
      _.set(newData, field, localized);
    });

    return newData;
  });

  return newRoute;
};

let languageOptions;
export const getLanguageOptions = () => {
  if (typeof languageOptions !== 'undefined') return languageOptions;

  // Generate the list of language options.
  languageOptions = getAvailableLanguages().map((localeCode) => {
    return { value: localeCode, label: t('language', localeCode) };
  });

  return languageOptions;
};
