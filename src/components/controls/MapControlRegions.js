import React from 'react';
import clsx from 'clsx';

import './MapControlRegions.css';
import { MapRegions } from '../MapFeatures';
import { t } from '../Localization';

const controlsContext = require.context('../../images/controls', true);

const MapControlRegion = ({ regionKey, currentRegion, setCurrentRegion }) => {
  const region = MapRegions[regionKey];

  const active = regionKey === currentRegion;

  return (
    <div
      onClick={() => setCurrentRegion(regionKey)}
      onKeyDown={() => setCurrentRegion(regionKey)}
      role="button"
      aria-label={t(region?.nameKey)}
      tabIndex={0}
      className={clsx('map-control-region', active ? 'map-control-region-active' : '')}
    >
      <img
        alt={t(region?.nameKey)}
        className={clsx('map-control-region-img')}
        src={controlsContext(`./${regionKey}-${active ? 'on' : 'off'}.png`).default}
      />
    </div>
  );
};

const MapControlRegions = ({ isOpen, currentRegion, setCurrentRegion }) => {
  return (
    <div
      className={clsx(
        'map-control-regions',
        isOpen ? 'map-control-regions-on' : 'map-control-regions-off'
      )}
    >
      {Object.keys(MapRegions).map((key) =>
        MapRegions[key]?.enabled ? (
          <MapControlRegion
            key={key}
            regionKey={key}
            currentRegion={currentRegion}
            setCurrentRegion={setCurrentRegion}
          />
        ) : null
      )}
    </div>
  );
};

export default MapControlRegions;
