import React from 'react';
import clsx from 'clsx';

import { getFeatureKeysByFilter, MapFeatures } from '../MapFeatures';

import './MapControlFeatures.css';

/**
 * A button in the Filters, with the icon of a Map feature on it.
 * Pressing this toggles display of that Map feature.
 * @param {*} featureKey The key of the feature.
 */
const MapControlFeatureButton = ({ featureKey, mapPreferences, setMapPreferences }) => {
  const mapFeature = MapFeatures[featureKey];

  const toggleFeature = () => {
    setMapPreferences((old) => {
      const previousValue = old?.displayed?.features[featureKey] ?? false;
      return {
        ...old,
        displayed: {
          ...old?.displayed,
          features: {
            ...old?.displayed?.features,
            [featureKey]: !previousValue,
          },
        },
      };
    });
  };

  const active = mapPreferences?.displayed?.features[featureKey] ?? false;

  return (
    <div
      onClick={toggleFeature}
      onKeyDown={toggleFeature}
      role="button"
      aria-label={active ? `Show ${mapFeature.name}` : `Hide ${mapFeature.name}`}
      tabIndex={0}
      className={clsx(
        'map-controls-feature',
        active ? 'map-controls-feature-active' : '',
        'noselect'
      )}
    >
      <div className={clsx('map-controls-feature-border')}>
        <img
          className={clsx('map-controls-feature-icon')}
          src={mapFeature.icons.filter}
          alt={mapFeature.name}
        />
      </div>
      {mapFeature.name}
    </div>
  );
};

const MapControlFeatures = ({
  currentRegion,
  currentCategory,
  mapPreferences,
  setMapPreferences,
}) => {
  return (
    <div className={clsx('map-controls-features-box')}>
      {getFeatureKeysByFilter(currentRegion, currentCategory).map((key) => (
        <MapControlFeatureButton
          key={key}
          featureKey={key}
          mapPreferences={mapPreferences}
          setMapPreferences={setMapPreferences}
        />
      ))}
    </div>
  );
};

export default MapControlFeatures;
