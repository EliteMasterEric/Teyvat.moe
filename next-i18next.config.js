module.exports = {
  i18n: {
    // Use subpath routing.
    locales: ['en'],
    // , 'zh'
    // This is the default locale.
    defaultLocale: 'en',

    // i18next options.
    defaultNS: 'core',
    ns: ['core', 'map-ui', 'map-changelog', 'error'],
    localeExtension: 'json',
    localePath: './public/locales',
    localeStructure: '{{lng}}/{{ns}}',
    serializeConfig: true,
    strictMode: true,
    // Only use the language code, skipping the region code.
    // For example, en-US becomes simply en.
    load: 'languageOnly',

    // (if working with a flat json, it's recommended to set keySeparator to false)
    keySeparator: false,

    // allow an empty value to count as invalid (by default is true)
    returnEmptyString: false,
    debug: true,
    react: {
      // Basic HTML nodes like <b></b> and <br /> are supported.
      transSupportBasicHtmlNodes: true,
      useSuspense: false, // << ----- this line
    },
  },
};
