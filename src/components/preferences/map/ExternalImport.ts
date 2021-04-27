import _ from 'lodash';

import { buildImportMapping } from './ExternalImportDictionary';
import { MSFImportSite, MSFMarkerKey } from 'src/components/data/map/Element';
import { f, t } from 'src/components/i18n/Localization';
import { sendNotification } from 'src/components/redux/slices/common/notify/Dispatch';
import { dispatchSetMarkersCompleted } from 'src/components/redux/slices/map/completed/Dispatch';
import { dispatchSetImportError } from 'src/components/redux/slices/map/error/Dispatch';
import { isValidJSON } from 'src/components/util';

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
      dispatchSetImportError(t('map-ui:message-import-error-malformed-json'));
      return false;
    }

    const fullData = JSON.parse(dataString);
    if (!_.isArray(fullData)) {
      dispatchSetImportError(t('map-ui:message-import-error-malformed-json'));
      return false;
    }

    // Get the list of all externalsite keys, and their corresponding values.
    const dictionary = buildImportMapping(importKey);

    const missingEntries: string[] = [];

    // Map each externalsite entry to a GenshinMap entry.
    const fullDataMapped = _.flatten(
      _.filter(
        _.map(fullData, (entry: any) => {
          if (_.isString(entry)) {
            return '';
          }
          if (entry in dictionary) {
            return dictionary[entry];
          }

          missingEntries.push(entry);
          return '';
        }),
        (entry: MSFMarkerKey[] | '' | undefined): entry is MSFMarkerKey[] => {
          return entry != '' && !_.isNil(entry);
        }
      )
    );

    const successfulEntries = _.size(fullDataMapped);
    const totalEntries = _.size(fullData);

    // Actually set the features as completed.
    dispatchSetMarkersCompleted(fullDataMapped);

    if (successfulEntries < totalEntries) {
      // Some entries were missing.
      console.warn(`Skipped over ${missingEntries.length} entries when importing.`);
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
  } catch (error) {
    console.error(error);
    dispatchSetImportError(t('map-ui:message-import-error-generic'));
    return false;
  }
};
