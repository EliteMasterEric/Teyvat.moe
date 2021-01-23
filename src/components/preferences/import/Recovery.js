import _ from 'lodash';

import localStorage from '~/components/preferences/local-storage';
import { LOCAL_STORAGE_KEY_RECOVERY } from '~/components/preferences/DefaultPreferences';
import { getUnixTimestamp } from '~/components/Util';

/**
 * When attempting to import data, via string or via local storage,
 * if the migration fails, we store data about the failure in local storage as well.
 */
export const storeRecoveryData = (json, message) => {
  console.warn(`Storing data in recovery (version ${json?.version ?? '<BAD VERSION>'})`);

  // Look for the first unused recovery value.
  let counter = 1;
  let sentinel = false;
  do {
    if (!localStorage.get(LOCAL_STORAGE_KEY_RECOVERY.replace('%COUNTER%', counter))) {
      sentinel = true;
    } else {
      counter += 1;
    }
  } while (!sentinel);

  // Store in the first unused recovery value.
  localStorage.set(LOCAL_STORAGE_KEY_RECOVERY.replace('%COUNTER%', counter), {
    json,
    message,
    version: json?.version ?? '<BAD VERSION>',
    timestamp: getUnixTimestamp(),
  });
};
