import React from 'react';
import clsx from 'clsx';

import './MapControlAbout.css';
import { f, t } from '../Localization';
import MapControlSummary from './MapControlSummary';

const MapControlHelp = () => {
  const translatorAttribution = t('about-translator-attribution');

  return (
    <div className={clsx('map-controls-about-help-container')}>
      <span className={clsx('map-control-about-help-header')}>GenshinMap</span>
      <span className={clsx('map-control-about-help-content')}>{t('about-a')}</span>

      <span className={clsx('map-control-about-help-content')}>{t('about-b')}</span>

      <span className={clsx('map-control-about-help-content')}>{t('about-c')}</span>

      <span className={clsx('map-control-about-help-content')}>{t('about-d')}</span>

      <span className={clsx('map-control-about-help-content')}>{t('about-e')}</span>

      <span className={clsx('map-control-about-help-content')}>
        {f('about-f', {
          link: (
            <a href="https://github.com/GenshinMap/genshinmap.github.io/issues/10">
              {t('click-here')}
            </a>
          ),
        })}
      </span>

      <span className={clsx('map-control-about-help-content')}>
        {f('about-g', {
          link: (
            <a href="https://github.com/GenshinMap/genshinmap.github.io/wiki/Contributing">
              {t('click-here')}
            </a>
          ),
        })}
      </span>

      <span className={clsx('map-control-about-help-content')}>
        {f('about-h', {
          link: (
            <a href="https://github.com/GenshinMap/genshinmap.github.io/wiki/Contributing#how-to-localize-the-site">
              {t('click-here')}
            </a>
          ),
        })}
      </span>

      {translatorAttribution !== '' ? (
        <span className={clsx('map-control-about-help-content')}>{translatorAttribution}</span>
      ) : null}
    </div>
  );
};

const MapControlAboutTabs = ({ tab, setTab }) => {
  return (
    <div className={clsx('map-controls-about-tab-container')}>
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
