import { LanguageCode } from './Localization';

// NOTE: Using a template for the require() line
// will result in ALL country flags being imported.
// This manual mapping data structure minimizes bundle size.

const languageFlags: { [key in LanguageCode]: any } = {
  de: require(`svg-country-flags/svg/de.svg`).default,
  en: require(`svg-country-flags/svg/us.svg`).default,
  es: require(`svg-country-flags/svg/es.svg`).default,
  fr: require(`svg-country-flags/svg/fr.svg`).default,
  id: require(`svg-country-flags/svg/id.svg`).default,
  ja: require(`svg-country-flags/svg/jp.svg`).default,
  ko: require(`svg-country-flags/svg/kr.svg`).default,
  pt: require(`svg-country-flags/svg/pt.svg`).default,
  ru: require(`svg-country-flags/svg/ru.svg`).default,
  th: require(`svg-country-flags/svg/th.svg`).default,
  vi: require(`svg-country-flags/svg/vi.svg`).default,
  zh: require(`svg-country-flags/svg/cn.svg`).default,
  'zh-tw': require(`svg-country-flags/svg/tw.svg`).default,
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getLanguageFlag = (code: LanguageCode) => languageFlags[code];
