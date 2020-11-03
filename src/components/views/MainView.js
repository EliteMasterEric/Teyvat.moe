import React from 'react';

import LeafletMap from '../map/LeafletMap';
import MapControls from '../controls/MapControls';

import './MainView.css';

const MainView = ({ mapPreferences, setMapPreferences }) => {
  return (
    <div className="map">
      <LeafletMap mapPreferences={mapPreferences} setMapPreferences={setMapPreferences} />
      <MapControls mapPreferences={mapPreferences} setMapPreferences={setMapPreferences} />
    </div>
  );
};

export default MainView;
