import { overrideLocale } from '~/components/i18n/Localization';

/**
 * Swap the language of the Localization components whenever the user changes it.
 */
export default (currentState) => {
  if ((currentState?.options?.overrideLang ?? '') !== '') {
    overrideLocale(currentState.options.overrideLang);
  }
};
