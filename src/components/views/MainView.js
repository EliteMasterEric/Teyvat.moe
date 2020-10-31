import React from 'react';

import LeafletMap from '../map/LeafletMap';
import MapControls from '../controls/MapControls';

const MainView = ({ mapPreferences, setMapPreferences }) => {
  return (
    <div className="map">
      <LeafletMap mapPreferences={mapPreferences} />
      <MapControls mapPreferences={mapPreferences} setMapPreferences={setMapPreferences} />
    </div>
  );
};

export default MainView;
