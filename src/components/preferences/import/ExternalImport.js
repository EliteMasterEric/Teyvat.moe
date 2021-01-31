import _ from 'lodash';

import { f, t } from '~/components/i18n/Localization';
import { buildImportMapping } from '~/components/preferences/import/ImportDictionary';
import { isValidJSON } from '~/components/Util';
import { displayImportError } from '~/redux/dispatch/error';
import { setToast } from '~/redux/dispatch/ui';

/**
 * Import marker completion data from another site.
 *
 * @param {*} dataString Imported data from a given site, formatted as a JSON array of strings.
 * @param {*} importKey Key of importIds to extract.
 * @param {*} setFeaturesCompleted The function to call to mark a list of features as completed.
 * @param {*} showToast The function to call to display a notification.
 * @returns True for success or partial success, false for failure.
 */
export const importMarkerDataFromSite = (dataString, importKey, setFeaturesCompleted) => {
  // fullData is a JSON array of externalsite keys.
  try {
    if (!isValidJSON(dataString)) {
      displayImportError(t('message-import-error-malformed-json'));
      return false;
    }

    const fullData = JSON.parse(dataString);

    // Get the list of all externalsite keys, and their corresponding values.
    const dictionary = buildImportMapping(importKey);

    const missingEntries = [];

    // Map each externalsite entry to a GenshinMap entry.
    const fullDataMapped = _.filter(
      fullData.map((entry) => {
        if (entry in dictionary) {
          return dictionary[entry];
        }

        missingEntries.push(entry);
        return '';
      }),
      _.size
    );

    const successfulEntries = _.size(fullDataMapped);
    const totalEntries = _.size(fullData);

    // Actually set the features as completed.
    setFeaturesCompleted(fullDataMapped);

    if (successfulEntries < totalEntries) {
      // Some entries were missing.
      console.warn(`Skipped over ${missingEntries} entries when importing.`);
      console.warn(missingEntries);
      setToast(
        f('message-import-success-partial', { success: successfulEntries, count: totalEntries })
      );
      return true;
    }

    // Else, complete success.
    setToast(f('message-import-success', { count: totalEntries }));
    return true;
  } catch (e) {
    console.error(e);
    displayImportError(t('message-import-error-generic'));
    return false;
  }
};
