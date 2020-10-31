import React from 'react';

import MainView from './components/views/MainView';

import {
  LOCAL_STORAGE_KEY,
  DEFAULT_MAP_PREFERENCES,
  useStateStored,
  resetLocalStorage,
} from './components/Preferences';

import './App.css';
import './NerdFonts.css';

const App = () => {
  const [mapPreferences, setMapPreferences] = useStateStored(
    LOCAL_STORAGE_KEY,
    DEFAULT_MAP_PREFERENCES
  );

  // resetLocalStorage(LOCAL_STORAGE_KEY);

  return <MainView mapPreferences={mapPreferences} setMapPreferences={setMapPreferences} />;
};

export default App;
