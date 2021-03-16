import _ from 'lodash';

import { MSFImportSite } from '~/components/data/ElementSchema';
import { f, t } from '~/components/i18n/Localization';
import { buildImportMapping } from '~/components/preferences/ExternalImportDictionary';
import {
  displayImportError,
  markMarkersCompleted,
  sendNotification,
} from '~/components/redux/dispatch';
import { isValidJSON } from '~/components/util';

/**
 * Import marker completion data from another site.
 *
 * @param {*} dataString Imported data from a given site, formatted as a JSON array of strings.
 * @param {*} importKey Key of importIds to extract.
 * @param {*} setFeaturesCompleted The function to call to mark a list of features as completed.
 * @param {*} showToast The function to call to display a notification.
 * @returns True for success or partial success, false for failure.
 */
export const importMarkerDataFromSite = (dataString: string, importKey: MSFImportSite): boolean => {
  // fullData is a JSON array of externalsite keys.
  try {
    if (!isValidJSON(dataString)) {
      displayImportError(t('message-import-error-malformed-json'));
      return false;
    }

    const fullData = JSON.parse(dataString);
    if (!Array.isArray(fullData)) {
      displayImportError(t('message-import-error-malformed-json'));
      return false;
    }

    // Get the list of all externalsite keys, and their corresponding values.
    const dictionary = buildImportMapping(importKey);

    const missingEntries = [];

    // Map each externalsite entry to a GenshinMap entry.
    const fullDataMapped = _.flatten(
      _.filter(
        fullData.map((entry: any) => {
          if (typeof entry !== 'string') {
            return '';
          }
          if (entry in dictionary) {
            return dictionary[entry];
          }

          missingEntries.push(entry);
          return '';
        }),
        _.size
      )
    );

    const successfulEntries = _.size(fullDataMapped);
    const totalEntries = _.size(fullData);

    // Actually set the features as completed.
    markMarkersCompleted(fullDataMapped);

    if (successfulEntries < totalEntries) {
      // Some entries were missing.
      console.warn(`Skipped over ${missingEntries} entries when importing.`);
      console.warn(missingEntries);
      sendNotification(
        f('message-import-success-partial', {
          success: successfulEntries.toString(),
          count: totalEntries.toString(),
        })
      );
      return true;
    }

    // Else, complete success.
    sendNotification(f('message-import-success', { count: totalEntries.toString() }));
    return true;
  } catch (e) {
    console.error(e);
    displayImportError(t('message-import-error-generic'));
    return false;
  }
};
