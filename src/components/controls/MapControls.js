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
import MapControlAbout from './MapControlAbout';
import { t } from '../Localization';
import { useImageExtension } from '../Image';

const MapControlTabs = ({ mapPreferences, tab, setTab }) => {
  return (
    <div className={clsx('map-controls-tab-container')}>
      <div
        onClick={() => setTab('help')}
        onKeyDown={() => setTab('help')}
        role="button"
        aria-label={t('tab-about')}
        tabIndex={0}
        className={clsx(
          'map-controls-tab',
          tab === 'help' || tab === 'summary' ? 'map-controls-tab-active' : '',
          'noselect'
        )}
      >
        {t('tab-about')}
      </div>
      {!mapPreferences?.editor?.enabled ? (
        <>
          <div
            onClick={() => setTab('features')}
            onKeyDown={() => setTab('features')}
            role="button"
            aria-label={t('tab-features')}
            tabIndex={0}
            className={clsx(
              'map-controls-tab',
              tab === 'features' ? 'map-controls-tab-active' : '',
              'noselect'
            )}
          >
            {t('tab-features')}
          </div>
          <div
            onClick={() => setTab('routes')}
            onKeyDown={() => setTab('routes')}
            role="button"
            aria-label={t('tab-routes')}
            tabIndex={0}
            className={clsx(
              'map-controls-tab',
              tab === 'routes' ? 'map-controls-tab-active' : '',
              'noselect'
            )}
          >
            {t('tab-routes')}
          </div>
        </>
      ) : null}
      {mapPreferences?.editor?.enabled ? (
        <div
          onClick={() => setTab('elements')}
          onKeyDown={() => setTab('elements')}
          role="button"
          aria-label={t('tab-elements')}
          tabIndex={0}
          className={clsx(
            'map-controls-tab',
            tab === 'elements' ? 'map-controls-tab-active' : '',
            'noselect'
          )}
        >
          {t('tab-elements')}
        </div>
      ) : null}

      <div
        onClick={() => setTab('options')}
        onKeyDown={() => setTab('options')}
        role="button"
        aria-label={t('tab-options')}
        tabIndex={0}
        className={clsx(
          'map-controls-tab',
          tab === 'options' ? 'map-controls-tab-active' : '',
          'noselect'
        )}
      >
        {t('tab-options')}
      </div>
    </div>
  );
};

const MapControls = ({ mapPreferences, setMapPreferences }) => {
  const [isOpen, setOpen] = React.useState(true);
  const [currentRegion, setCurrentRegion] = React.useState('mondstadt');
  const [currentCategory, setCurrentCategory] = React.useState('special');

  const [tab, setTab] = React.useState('help');

  const editorActive = mapPreferences?.editor?.enabled;

  const ext = useImageExtension();

  return (
    <div className={clsx('map-controls-wrapper')}>
      <div
        className={clsx(
          'map-controls-main',
          `map-controls-main-${ext}`,
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

        {tab === 'help' || tab === 'summary' ? (
          <MapControlAbout
            tab={tab}
            setTab={setTab}
            mapPreferences={mapPreferences}
            setMapPreferences={setMapPreferences}
          />
        ) : null}

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
