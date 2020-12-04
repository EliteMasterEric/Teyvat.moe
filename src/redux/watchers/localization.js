import { overrideLocale } from '../../components/Localization';

/**
 * Swap the language of the Localization components whenever the user changes it.
 */
export default (currentState) => {
  if ((currentState?.options?.overrideLang ?? '') !== '') {
    overrideLocale(currentState.options.overrideLang);
  }
};
