/**
 * Contains methods which facilitate translation between languages.
 * Relies on 2-letter locales.
 */

import _ from 'lodash';
import LocalizedStrings from 'react-localization';

import { DEFAULT_LOCALE_CODE } from '~/components/preferences/DefaultPreferences';
import { importFromContext } from '../Util';

/**
 * The path, relative to ./data/i18n/, of the default locale code's language file.
 */
const DEFAULT_LOCALE_FILE = `./${DEFAULT_LOCALE_CODE}.json`;

/**
 * The require context referencing all the localization files.
 */
const i18nContext = require.context('../../data/i18n/ui', true, /.json$/);

/**
 * A list of JSON file paths, excluding the default locale.
 */
const i18nKeys = i18nContext.keys().filter((key) => key !== DEFAULT_LOCALE_FILE);

// ex [./en-US.json, en-US].
const getLocaleFromI18nFilePath = (string) => {
  const match = string.match(/\.\/([-_a-zA-Z0-9]+)\.json/);
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

const localizedStrings = new LocalizedStrings(i18nData, {
  pseudo: false, // Enable while testing to find unlocalized strings.
  logsEnabled: true,
});

/**
 * 'T'ranslate the given localization key.
 * @param {*} key The localization key.
 * @returns {String} The localized string.
 */
export const t = (key, locale = null) => {
  // Use the current locale.
  return localizedStrings.getString(key, locale);
};

/**
 * 'F'ormat the passed string, replacing placeholders with the other arguments strings.
 * @param {*} key The string key of the localized string to replace.
 * @param  {...any} options Placeholder values. Can be JSX! Nice.
 * @returns {String} The formatted string.
 */
export const f = (key, ...options) => {
  return localizedStrings.formatString(t(key), ...options);
};

/**
 * Retrieve the current language's locale string.
 * @returns {String} The current locale in BCP-47 format.
 */
export const getLocale = () => {
  return localizedStrings.getLanguage();
};

/**
 * Retrieves a shortened form of the current locale.
 */
export const getShortLocale = () => {
  const language = getLocale();
  const idx = language.indexOf('-');
  const auxLang = idx >= 0 ? language.substring(0, idx) : language;
  return auxLang;
};

/**
 * Retrieve the list of available languges
 * @returns {String} A list of locale strings.
 */
export const getAvailableLanguages = () => {
  return localizedStrings.getAvailableLanguages();
};

/**
 * Replace the currently selected locale with the specified one.
 * @param {String} lang The new locale code.
 */
export const overrideLocale = (lang) => {
  localizedStrings.setLanguage(lang);
};

/**
 * Formats a Date into a string, based on the locale.
 * @param {Date} input A Date object.
 * @returns {String} The resulting string.
 */
export const formatDateTime = (input) => {
  const dateFormatter = new Intl.DateTimeFormat(getLocale(), {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  return dateFormatter.format(input);
};

/**
 * Formats a numeric value into a string, with proper separators based on locale.
 * @param {*} input The input numeric value.
 * @returns {String} The resulting string.
 */
export const formatNumber = (input) => {
  const numberFormatter = new Intl.NumberFormat(getLocale());
  return numberFormatter.format(input);
};

/**
 * Formats a numeric value into a string, specifically a currency.
 * @param {*} input The input numeric value.
 * @param {*} currency Currency used, defaults to USD.
 * * @returns {String} The resulting string.
 */
export const formatCurrency = (input, currency = 'USD') => {
  const currencyFormatter = new Intl.NumberFormat(getLocale(), { style: 'currency', currency });
  return currencyFormatter.format(input);
};

/**
 * For a given number, returns a key used for pluralization.
 * @param {*} input
 * @returns {String} 'one', 'two', 'few', or 'other'
 */
export const formatPlural = (input) => {
  const pluralFormatter = new Intl.PluralRules(getLocale());
  return pluralFormatter.select(input);
};

/**
 * Returns a comparison function, which you can pass into 'list.sort' as a predicate
 * to sort a string in a language-specific way.
 * @returns {Function} A function of the format (a, b) => [int] which tells allows you to sort strings.
 */
export const formatCollator = () => {
  const collator = new Intl.Collator(getLocale());
  return collator.compare;
};

/**
 * Convert a Unix Timestamp into a Date display.
 * @param {*} timestamp The timestamp to display, in seconds.
 * @returns {String} A date string.
 */
export const displayUnixTimestamp = (timestamp) => {
  const dateTime = new Date(timestamp * 1000);
  return formatDateTime(dateTime);
};
