import { overrideLocale } from 'src/components/i18n/Localization';
import { selectCurrentLanguage } from 'src/components/redux/slices/common/i18n/Selector';
import { AppState, AppWatcher } from 'src/components/redux/Types';

/**
 * Swap the language of the Localization components whenever the user changes it.
 */
const localizationWatcher: AppWatcher = (currentState: AppState): void => {
  const currentLanguage = selectCurrentLanguage(currentState);
  if (currentLanguage !== null) {
    overrideLocale(currentLanguage);
  }
};

export default localizationWatcher;
