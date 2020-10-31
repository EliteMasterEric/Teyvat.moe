import clsx from 'clsx';
import React from 'react';

import MapControlCategories from './MapControlCategories';
import MapControlFeatures from './MapControlFeatures';
import MapControlFoldButton from './MapControlFoldButton';

// CSS
import './MapControls.css';

const MapControlRegions = () => {
  return <div className={clsx()} />;
};

const MapControlOptions = () => {
  return <div className={clsx()} />;
};

const MapControls = ({ mapPreferences, setMapPreferences }) => {
  const [isOpen, setOpen] = React.useState(true);
  const [currentRegion, setCurrentRegion] = React.useState('mondstadt');
  const [currentCategory, setCurrentCategory] = React.useState('special');

  return (
    <div
      className={clsx(
        'map-controls-main',
        isOpen ? 'map-controls-main-open' : 'map-controls-main-closed'
      )}
    >
      <MapControlFoldButton isOpen={isOpen} setOpen={setOpen} />
      <MapControlRegions currentRegion={currentRegion} setCurrentRegion={setCurrentRegion} />

      <MapControlOptions mapPreferences={mapPreferences} setMapPreferences={setMapPreferences} />
      <MapControlCategories
        currentCategory={currentCategory}
        setCurrentCategory={setCurrentCategory}
      />
      <MapControlFeatures
        currentRegion={currentRegion}
        currentCategory={currentCategory}
        mapPreferences={mapPreferences}
        setMapPreferences={setMapPreferences}
      />
    </div>
  );
};

export default MapControls;
