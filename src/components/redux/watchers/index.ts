import { EnhancedStore } from '@reduxjs/toolkit';

import initialization from './LoadInitialization';
import localization from './Localization';
import localStorage from './LocalStorage';

const watchers = [initialization, localStorage, localization];

const addWatchers = (store: EnhancedStore): void => {
  // Call these functions whenever the store changes.
  for (const watcherFunction of watchers) {
    const listen = () => {
      watcherFunction(store.getState());
    };
    // Call once as the app initializes.
    listen();
    // Call every time the store changes.
    store.subscribe(listen);
  }
};

export default addWatchers;
