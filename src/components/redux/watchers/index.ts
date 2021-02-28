// Allow for relative imports here for simplicity.
/* eslint-disable no-restricted-imports */

import { EnhancedStore } from '@reduxjs/toolkit';
import localStorage from './localStorage';
import localization from './localization';

const watchers = [localStorage, localization];

const addWatchers = (store: EnhancedStore): void => {
  // Call these functions whenever the store changes.
  watchers.forEach((watcherFunction) => {
    const listen = () => {
      watcherFunction(store.getState());
    };
    // Call once as the app initializes.
    listen();
    // Call every time the store changes.
    store.subscribe(listen);
  });
};

export default addWatchers;
