import React from 'react';

import MainView from './components/views/MainView';

import { useStateStored, resetLocalStorage } from './components/Preferences';

import './App.css';
import './NerdFonts.css';

const App = () => {
  const [mapPreferences, setMapPreferences] = useStateStored();

  return <MainView mapPreferences={mapPreferences} setMapPreferences={setMapPreferences} />;
};

export default App;
