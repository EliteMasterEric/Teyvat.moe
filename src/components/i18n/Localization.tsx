/**
 * Contains methods which facilitate translation between languages.
 * Relies on 2-letter locales.
 */

import { Typography, TypographyProps } from '@material-ui/core';
import _ from 'lodash';
import { useTranslation, i18n } from 'next-i18next';
import Router from 'next/router';
import React, { FunctionComponent } from 'react';

import { LocalizedString } from 'src/components/Types';
import { getKeys, SafeHTML } from 'src/components/util';

/**
 * We need to keep trach of what languages are supported ourselves,
 * since i18next can't do that for you.
 *
 * https://github.com/i18next/i18next/issues/1068
 */
import languageCoreData from 'src/data/core/languages.json';

export const DEFAULT_LOCALE_CODE: LanguageCode = 'en';

/**
 * Determine if the string is an existing language code.
 */
export type LanguageCode = keyof typeof languageCoreData;
export const languageCodeList: LanguageCode[] = getKeys(languageCoreData);
const distinguishLanguageCode = (input: any): input is LanguageCode =>
  _.includes(languageCodeList, input);

/**
 * @param source 'en'
 * @param target 'fr'
 * @returns 'Anglais'
 */
type CoreName = Omit<{ [key in LanguageCode]?: string }, 'en'> & { en: string };
export const getLanguageName = (source: string, target: LanguageCode): string => {
  if (!distinguishLanguageCode(source)) return `UNKNOWN SOURCE ${source}`;
  const coreName = languageCoreData[source].name as CoreName;
  return coreName?.[target] ?? coreName.en;
};

export const isI18nLoaded = (): boolean => {
  return i18n != null;
};

/**
 * 'T'ranslate the given localization key.
 * @param {*} key The localization key.
 * @returns {String} The localized string.
 */
export const t = (key: string): LocalizedString => {
  // Use the current locale.
  return (i18n == null ? 'NULL I18N' : i18n.t(key)) as LocalizedString;
};

/**
 * 'F'ormat the passed string, replacing placeholders with the other arguments strings.
 * @param {*} key The string key of the localized string to replace.
 * @param  {...any} options Placeholder values. Can be JSX! Nice.
 * @returns {String} The formatted string.
 */
export const f = (key: string, options: Record<string, string>): LocalizedString => {
  return (i18n == null ? '' : i18n.t(key, options)) as LocalizedString;
};

/**
 * Retrieve the current language's locale string.
 * @returns {String} The current locale in BCP-47 format.
 */
export const getLocale = (): string => {
  if (i18n == null) return 'en';
  return i18n.language;
};

/**
 * Retrieves a shortened form of the current locale.
 */
export const getShortLocale = (): string => {
  const language = getLocale();
  const index = language.indexOf('-');
  const auxLang = index >= 0 ? language.slice(0, Math.max(0, index)) : language;
  return auxLang;
};

/**
 * Replace the currently selected locale with the specified one.
 * @param {String} lang The new locale code.
 */
export const overrideLocale = async (lang: string): Promise<void> => {
  // NOTE: Setting the language to 'cimode' will cause the `t` function to always return the key.
  if (i18n != null) {
    i18n.changeLanguage(lang);
  }
};

/**
 * Formats a Date into a string, based on the locale.
 * @param {Date} input A Date object.
 * @returns {String} The resulting string.
 */
export const formatDateTime = (input: Date): string => {
  const locale = getLocale();
  const dateFormatter = new Intl.DateTimeFormat(locale, {
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

type LocalizedTypographyProps = TypographyProps & {
  i18nKey: string;
  /**
   * A set of key-value pairs used for formatting strings.
   */
  values?: { [key: string]: any };
};

/**
 * Will display translated text simply and efficiently.
 *
 * Utilizes any props supported by Typography.
 * Re-renders only if the properties change.
 * @param i18nKey The localization key to use.
 * @param values If defined, value is used for formatting string.
 */
export const LocalizedTypography: FunctionComponent<LocalizedTypographyProps> = ({
  i18nKey,
  values,
  ...options
}) => {
  const { t: translate } = useTranslation();
  return <Typography {...options}>{translate(i18nKey, values)}</Typography>;
};

export const LocalizedSafeHTML: FunctionComponent<LocalizedTypographyProps> = ({
  i18nKey,
  values,
  ...options
}) => {
  const { t: translate } = useTranslation();
  return <SafeHTML {...options}>{translate(i18nKey, values)}</SafeHTML>;
};

/**
 * You can use next/router to transition between locales.
 */
export const routeToLanguage = (locale: string): void => {
  console.log(Router.pathname);
};
