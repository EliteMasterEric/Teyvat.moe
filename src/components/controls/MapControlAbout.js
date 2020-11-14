import React from 'react';
import clsx from 'clsx';

import './MapControlAbout.css';
import { t } from '../Localization';
import MapControlSummary from './MapControlSummary';
import { SafeHTML } from '../Util';
import { useImageExtension } from '../Image';

const MapControlHelp = () => {
  const ext = useImageExtension();
  const translatorAttribution = t('about-translator-attribution');

  return (
    <div
      className={clsx(
        'map-controls-about-help-container',
        `map-controls-about-help-container-${ext}`
      )}
    >
      <SafeHTML className={clsx('map-control-about-help-header')}>{t('short-title')}</SafeHTML>
      <SafeHTML className={clsx('map-control-about-help-content')}>{t('about-a')}</SafeHTML>

      <SafeHTML className={clsx('map-control-about-help-content')}>{t('about-b')}</SafeHTML>

      <SafeHTML className={clsx('map-control-about-help-content')}>{t('about-c')}</SafeHTML>

      <SafeHTML className={clsx('map-control-about-help-content')}>{t('about-d')}</SafeHTML>

      <SafeHTML className={clsx('map-control-about-help-content')}>{t('about-e')}</SafeHTML>

      <SafeHTML className={clsx('map-control-about-help-content')}>{t('about-f')}</SafeHTML>

      {translatorAttribution !== '' ? (
        <SafeHTML className={clsx('map-control-about-help-content')}>
          {translatorAttribution}
        </SafeHTML>
      ) : null}
    </div>
  );
};

const MapControlAboutTabs = ({ tab, setTab }) => {
  const ext = useImageExtension();

  return (
    <div
      className={clsx(
        'map-controls-about-tab-container',
        `map-controls-about-tab-container-${ext}`
      )}
    >
      <div
        onClick={() => setTab('help')}
        onKeyDown={() => setTab('help')}
        role="button"
        aria-label={t('tab-help')}
        tabIndex={0}
        className={clsx(
          'map-controls-about-tab',
          tab === 'help' ? 'map-controls-about-tab-active' : '',
          'noselect'
        )}
      >
        {t('tab-help')}
      </div>
      <div
        onClick={() => setTab('summary')}
        onKeyDown={() => setTab('summary')}
        role="button"
        aria-label={t('tab-summary')}
        tabIndex={0}
        className={clsx(
          'map-controls-about-tab',
          tab === 'summary' ? 'map-controls-about-tab-active' : '',
          'noselect'
        )}
      >
        {t('tab-summary')}
      </div>
    </div>
  );
};

const MapControlAbout = ({ tab, setTab, mapPreferences, setMapPreferences }) => {
  return (
    <>
      <MapControlAboutTabs tab={tab} setTab={setTab} />
      {tab === 'help' ? <MapControlHelp /> : null}
      {tab === 'summary' ? (
        <MapControlSummary mapPreferences={mapPreferences} setMapPreferences={setMapPreferences} />
      ) : null}
    </>
  );
};

export default MapControlAbout;
