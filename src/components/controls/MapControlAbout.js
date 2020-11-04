import React from 'react';
import clsx from 'clsx';

import './MapControlAbout.css';

const MapControlAbout = () => {
  return (
    <div className={clsx('map-controls-about-container')}>
      <span className={clsx('map-control-about-header')}>GenshinMap</span>
      <span className={clsx('map-control-about-content')}>
        This interactive map was developed by the community.
      </span>

      <span className={clsx('map-control-about-content')}>
        Click the Features tab above to filter the map to display Oculi, ores, plants, monsters, and
        more.
      </span>

      <span className={clsx('map-control-about-content')}>
        Click the tab above to filter the map to display Oculi, ores, plants, monsters, and more.
      </span>

      <span className={clsx('map-control-about-content')}>
        <a href="https://github.com/GenshinMap/genshinmap.github.io/wiki/Contributing">
          Click here
        </a>{' '}
        to learn how to contribute to the site.
      </span>
    </div>
  );
};

export default MapControlAbout;
