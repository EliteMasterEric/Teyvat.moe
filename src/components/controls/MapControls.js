import clsx from 'clsx';
import React from 'react';

import MapControlCategories from './MapControlCategories';
import MapControlEditor from './MapControlEditor';
import MapControlFeatures from './MapControlFeatures';
import MapControlFoldButton from './MapControlFoldButton';
import MapControlOptions from './MapControlOptions';
import MapControlRegions from './MapControlRegions';

// CSS
import './MapControls.css';

const MapControlTabs = ({ tab, setTab }) => {
  return (
    <div className={clsx('map-controls-tab-container')}>
      <div
        onClick={() => setTab('features')}
        onKeyDown={() => setTab('features')}
        role="button"
        aria-label="Features"
        tabIndex={0}
        className={clsx(
          'map-controls-tab',
          tab === 'features' ? 'map-controls-tab-active' : '',
          'noselect'
        )}
      >
        Features
      </div>
      <div
        onClick={() => setTab('options')}
        onKeyDown={() => setTab('options')}
        role="button"
        aria-label="Options"
        tabIndex={0}
        className={clsx(
          'map-controls-tab',
          tab === 'options' ? 'map-controls-tab-active' : '',
          'noselect'
        )}
      >
        Options
      </div>
    </div>
  );
};

const MapControls = ({ mapPreferences, setMapPreferences }) => {
  const [isOpen, setOpen] = React.useState(true);
  const [currentRegion, setCurrentRegion] = React.useState('mondstadt');
  const [currentCategory, setCurrentCategory] = React.useState('special');

  const [tab, setTab] = React.useState('features');

  return (
    <div className={clsx('map-controls-wrapper')}>
      <div
        className={clsx(
          'map-controls-main',
          isOpen ? 'map-controls-main-open' : 'map-controls-main-closed'
        )}
      >
        <MapControlFoldButton isOpen={isOpen} setOpen={setOpen} />
        <MapControlRegions
          isOpen={isOpen}
          currentRegion={currentRegion}
          setCurrentRegion={setCurrentRegion}
        />
        <MapControlTabs tab={tab} setTab={setTab} />

        {tab === 'features' && !mapPreferences?.editor?.enabled ? (
          <>
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
          </>
        ) : null}

        {tab === 'features' && mapPreferences?.editor?.enabled ? (
          <MapControlEditor mapPreferences={mapPreferences} setMapPreferences={setMapPreferences} />
        ) : null}

        {tab === 'options' ? (
          <>
            <MapControlOptions
              mapPreferences={mapPreferences}
              setMapPreferences={setMapPreferences}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default MapControls;
