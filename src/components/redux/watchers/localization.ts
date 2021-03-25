import { overrideLocale } from 'src/components/i18n/Localization';
import { AppState, AppWatcher } from 'src/components/redux/types';

/**
 * Swap the language of the Localization components whenever the user changes it.
 */
const localizationWatcher: AppWatcher = (currentState: AppState): void => {
  if (currentState.options.overrideLang !== null && currentState.options.overrideLang != '') {
    overrideLocale(currentState.options.overrideLang);
  }
};

export default localizationWatcher;
