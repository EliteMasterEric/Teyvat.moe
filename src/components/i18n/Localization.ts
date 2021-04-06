/**
 * Contains methods which facilitate translation between languages.
 * Relies on 2-letter locales.
 */

import _ from 'lodash';
import LocalizedStrings from 'react-localization';

import { LocalizedString, ValueOf } from 'src/components/Types';
import { getKeys, importFromContext } from 'src/components/util';

import languageCoreData from 'src/data/i18n/ui/_core.json';
/**
 * The path, relative to ./data/i18n/, of the default locale code's language file.
 */
export const DEFAULT_LOCALE_CODE = 'en';

export type LanguageCode = keyof typeof languageCoreData;
export const languageCodeList: LanguageCode[] = getKeys(languageCoreData);
const distinguishLanguageCode = (input: any): input is LanguageCode => input in languageCodeList;
type LanguageCoreDataValue = ValueOf<typeof languageCoreData>;
export type LanguageFlag = LanguageCoreDataValue['flag'];

/**
 * @param source 'en'
 * @param target 'fr'
 * @returns 'Anglais'
 */
type CoreName = Omit<{ [key in LanguageCode]?: string }, 'en'> & { en: string };
export const getLanguageName = (source: string, target: LanguageCode): string => {
  if (!distinguishLanguageCode(source)) return 'UNKNOWN SOURCE';
  const coreName = languageCoreData[source].name as CoreName;
  return coreName?.[target] ?? coreName.en;
};

/**
 * Load the English locale synchronously.
 */
const DEFAULT_LOCALE = require('src/data/i18n/ui/en.json');

type LocalizationData = typeof DEFAULT_LOCALE;
type LocalizationKey = keyof LocalizationData;

/**
 * The require context referencing all the localization files.
 */
const i18nContext = require.context(
  'src/data/i18n/ui',
  true,
  /\.json$/,
  'lazy' // webpackMode: One bundle per language.
);

const localizedStrings = new LocalizedStrings(
  { en: DEFAULT_LOCALE },
  {
    pseudo: false, // Enable while testing to find unlocalized strings.
    logsEnabled: true,
  }
);

const appendLanguage = (localizationData: LocalizationData, languageCode: string) => {
  localizedStrings.setContent(
    Object.assign({}, localizedStrings.getContent(), {
      [languageCode]: localizationData,
    })
  );
};

const loadLanguage = async (languageCode: string) => {
  const localizationData = await importFromContext(i18nContext, `./${languageCode}.json`);
  if (localizationData != null) {
    appendLanguage(localizationData, languageCode);
  } else {
    console.error(`Failed to load language ${localizationData}`);
  }
};

const isLanguageLoaded = (languageCode: string) => {
  return languageCode in localizedStrings.getContent();
};

/**
 * 'T'ranslate the given localization key.
 * @param {*} key The localization key.
 * @returns {String} The localized string.
 */
export const t = (key: LocalizationKey, locale?: string | undefined): LocalizedString => {
  // Use the current locale.
  return <LocalizedString>localizedStrings.getString(key, locale);
};

/**
 * 'F'ormat the passed string, replacing placeholders with the other arguments strings.
 * @param {*} key The string key of the localized string to replace.
 * @param  {...any} options Placeholder values. Can be JSX! Nice.
 * @returns {String} The formatted string.
 */
export const f = (key: LocalizationKey, options: Record<string, string>): LocalizedString => {
  return <LocalizedString>localizedStrings.formatString(t(key), options);
};

/**
 * Retrieve the current language's locale string.
 * @returns {String} The current locale in BCP-47 format.
 */
export const getLocale = (): string => {
  return localizedStrings.getLanguage();
};

/**
 * Retrieves a shortened form of the current locale.
 */
export const getShortLocale = (): string => {
  const language = getLocale();
  const idx = language.indexOf('-');
  const auxLang = idx >= 0 ? language.substring(0, idx) : language;
  return auxLang;
};

/**
 * Replace the currently selected locale with the specified one.
 * @param {String} lang The new locale code.
 */
export const overrideLocale = async (lang: string): Promise<void> => {
  if (!isLanguageLoaded(lang)) {
    await loadLanguage(lang);
  }
  localizedStrings.setLanguage(lang);
};

/**
 * Formats a Date into a string, based on the locale.
 * @param {Date} input A Date object.
 * @returns {String} The resulting string.
 */
export const formatDateTime = (input: Date): string => {
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
export const formatNumber = (input: number): string => {
  const numberFormatter = new Intl.NumberFormat(getLocale());
  return numberFormatter.format(input);
};

/**
 * Formats a numeric value into a string, specifically a currency.
 * @param {*} input The input numeric value.
 * @param {*} currency Currency used, defaults to USD.
 * * @returns {String} The resulting string.
 */
export const formatCurrency = (input: number, currency = 'USD'): string => {
  const currencyFormatter = new Intl.NumberFormat(getLocale(), { style: 'currency', currency });
  return currencyFormatter.format(input);
};

/**
 * For a given number, returns a key used for pluralization.
 * @param {*} input
 * @returns {String} 'one', 'two', 'few', or 'other'
 */
export const formatPlural = (input: number): string => {
  const pluralFormatter = new Intl.PluralRules(getLocale());
  return pluralFormatter.select(input);
};

/**
 * Returns a comparison function, which you can pass into 'list.sort' as a predicate
 * to sort a string in a language-specific way.
 * @returns {Function} A function of the format (a, b) => [int] which tells allows you to sort strings.
 */
export const formatCollator = (): ((a: string, b: string) => number) => {
  const collator = new Intl.Collator(getLocale());
  return collator.compare;
};

/**
 * Convert a Unix Timestamp into a Date display.
 * @param {*} timestamp The timestamp to display, in seconds.
 * @returns {String} A date string.
 */
export const formatUnixTimestamp = (timestamp: number): string => {
  const dateTime = new Date(timestamp * 1000);
  return formatDateTime(dateTime);
};
