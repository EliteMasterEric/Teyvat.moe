import _ from 'lodash';

import localStorage from 'src/components/preferences/local-storage';
import { getUnixTimestamp } from 'src/components/util';

export const LOCAL_STORAGE_KEY_RECOVERY = 'genshinmap-preferences-recovery-%COUNTER%';

/**
 * When attempting to import data, via string or via local storage,
 * if the migration fails, we store data about the failure in local storage as well.
 */
export const storeMapRecoveryData = (json: Record<string, unknown>, message: string): void => {
  console.warn(`Storing data in recovery (version ${json.version ?? '<BAD VERSION>'})`);

  // Look for the first unused recovery value.
  let counter = 1;
  let sentinel = false;
  do {
    if (!localStorage.get(_.replace(LOCAL_STORAGE_KEY_RECOVERY, '%COUNTER%', counter.toString()))) {
      sentinel = true;
    } else {
      counter += 1;
    }
  } while (!sentinel);

  // Store in the first unused recovery value.
  localStorage.set(_.replace(LOCAL_STORAGE_KEY_RECOVERY, '%COUNTER%', counter.toString()), {
    json,
    message,
    version: json.version ?? '<BAD VERSION>',
    timestamp: getUnixTimestamp(),
  });
};
