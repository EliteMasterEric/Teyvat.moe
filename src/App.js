import React from 'react';

import MainView from './components/views/MainView';

import { useStateStored } from './components/Preferences';

import './App.css';
import './NerdFonts.css';

const App = () => {
  const [mapPreferences, setMapPreferences] = useStateStored();

  // Call this function once when the app initializes.
  React.useEffect(() => {
    // Fix a bug where the app would start with the Editor enabled.
    setMapPreferences((old) => ({
      ...old,
      editor: {
        ...old?.editor,
        enabled: false,
      },
    }));
  }, []);

  return <MainView mapPreferences={mapPreferences} setMapPreferences={setMapPreferences} />;
};

export default App;
