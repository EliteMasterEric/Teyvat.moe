/**
 * Relies on locales in BCP-47 format.
 */
import LocalizedStrings from 'react-localization';
import { getInterfaceLanguage } from 'localized-strings';

/**
 * The require context referencing all the localization files.
 */
const i18nContext = require.context('../data/i18n', true, /.json$/);

const DEFAULT_LOCALE_CODE = 'en';
const DEFAULT_LOCALE_FILE = `./${DEFAULT_LOCALE_CODE}.json`;

/**
 * A list of JSON file paths, excluding the default locale.
 */
const i18nKeys = i18nContext.keys().filter((key) => key !== DEFAULT_LOCALE_FILE);

/**
 * A list of JSON data objects, including the default locale (it must be moved to the front).
 */
const i18nData = [DEFAULT_LOCALE_FILE, ...i18nKeys].map((filePath) => {
  return i18nContext(filePath);
});

const localizedStrings = new LocalizedStrings(i18nData, {
  pseudo: false, // Enable while testing to find unlocalized strings.
});

/**
 * 'T'ranslate the given localization key.
 * @param {*} key The localization key.
 * @returns {String} The localized string.
 */
export const t = (key, locale = null) => {
  // If specified, use a specific locale.
  if (locale !== null) localizedStrings.getString(key, locale);

  // Else use the current locale.
  return localizedStrings[key];
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
  return getInterfaceLanguage();
};

/**
 * Formats a Date into a string, based on the locale.
 * @param {Date} input A Date object.
 * @returns {String} The resulting string.
 */
export const formatDateTime = (input) => {
  const dateFormatter = new Intl.DateTimeFormat(getLocale());
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
