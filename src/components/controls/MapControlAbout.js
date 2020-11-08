import React from 'react';
import clsx from 'clsx';

import './MapControlAbout.css';
import { f, t } from '../Localization';

const MapControlAbout = () => {
  return (
    <div className={clsx('map-controls-about-container')}>
      <span className={clsx('map-control-about-header')}>GenshinMap</span>
      <span className={clsx('map-control-about-content')}>{t('about-a')}</span>

      <span className={clsx('map-control-about-content')}>{t('about-b')}</span>

      <span className={clsx('map-control-about-content')}>{t('about-c')}</span>

      <span className={clsx('map-control-about-content')}>{t('about-d')}</span>

      <span className={clsx('map-control-about-content')}>
        {f('about-e', {
          link: (
            <a href="https://github.com/GenshinMap/genshinmap.github.io/issues/10">
              {t('click-here')}
            </a>
          ),
        })}
      </span>

      <span className={clsx('map-control-about-content')}>
        {f('about-f', {
          link: (
            <a href="https://github.com/GenshinMap/genshinmap.github.io/wiki/Contributing">
              {t('click-here')}
            </a>
          ),
        })}
      </span>

      <span className={clsx('map-control-about-content')}>{t('about-g')}</span>
    </div>
  );
};

export default MapControlAbout;
