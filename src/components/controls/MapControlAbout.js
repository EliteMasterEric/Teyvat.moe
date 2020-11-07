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
        Double-click a feature marker to flag it as done. For some features such as chests, a single
        click will display a popup with more information, including an image or comment.
      </span>

      <span className={clsx('map-control-about-content')}>
        Click the Routes tab above to filter the map to display community made farming routes, such
        as ones to efficiently collect regional specialties or fight monsters.
      </span>

      <span className={clsx('map-control-about-content')}>
        <a href="https://github.com/GenshinMap/genshinmap.github.io/wiki/Contributing">
          Click here
        </a>{' '}
        to learn how you can help make the Chest display better.
      </span>

      <span className={clsx('map-control-about-content')}>
        <a href="https://github.com/GenshinMap/genshinmap.github.io/wiki/Contributing">
          Click here
        </a>{' '}
        to learn how to contribute new markers or routes to the site.
      </span>
    </div>
  );
};

export default MapControlAbout;
