import clsx from 'clsx';
import React from 'react';

import MapControlCategories from './MapControlCategories';
import MapControlEditor from './MapControlEditor';
import MapControlFeatures from './MapControlFeatures';
import MapControlRoutes from './MapControlRoutes';
import MapControlFoldButton from './MapControlFoldButton';
import MapControlOptions from './MapControlOptions';
import MapControlRegions from './MapControlRegions';

// CSS
import './MapControls.css';

const MapControlTabs = ({ mapPreferences, tab, setTab }) => {
  return (
    <div className={clsx('map-controls-tab-container')}>
      {!mapPreferences?.editor?.enabled ? (
        <>
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
            onClick={() => setTab('routes')}
            onKeyDown={() => setTab('routes')}
            role="button"
            aria-label="Routes"
            tabIndex={0}
            className={clsx(
              'map-controls-tab',
              tab === 'routes' ? 'map-controls-tab-active' : '',
              'noselect'
            )}
          >
            Routes
          </div>
        </>
      ) : null}
      {mapPreferences?.editor?.enabled ? (
        <div
          onClick={() => setTab('elements')}
          onKeyDown={() => setTab('elements')}
          role="button"
          aria-label="Markers"
          tabIndex={0}
          className={clsx(
            'map-controls-tab',
            tab === 'elements' ? 'map-controls-tab-active' : '',
            'noselect'
          )}
        >
          Elements
        </div>
      ) : null}

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

  const editorActive = mapPreferences?.editor?.enabled;

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
          isOpen={isOpen && !editorActive}
          currentRegion={currentRegion}
          setCurrentRegion={setCurrentRegion}
        />
        <MapControlTabs mapPreferences={mapPreferences} tab={tab} setTab={setTab} />

        {tab === 'features' || tab === 'routes' ? (
          <MapControlCategories
            currentCategory={currentCategory}
            setCurrentCategory={setCurrentCategory}
          />
        ) : null}

        {tab === 'features' ? (
          <MapControlFeatures
            currentRegion={currentRegion}
            currentCategory={currentCategory}
            mapPreferences={mapPreferences}
            setMapPreferences={setMapPreferences}
          />
        ) : null}

        {tab === 'routes' ? (
          <MapControlRoutes
            currentRegion={currentRegion}
            currentCategory={currentCategory}
            mapPreferences={mapPreferences}
            setMapPreferences={setMapPreferences}
          />
        ) : null}

        {tab === 'elements' ? (
          <MapControlEditor
            setTab={setTab}
            mapPreferences={mapPreferences}
            setMapPreferences={setMapPreferences}
          />
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
