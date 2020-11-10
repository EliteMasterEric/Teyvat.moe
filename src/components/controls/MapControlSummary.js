import _ from 'lodash';
import React from 'react';
import clsx from 'clsx';

import Popup from 'reactjs-popup';
import Tooltip from 'react-tooltip';

import { t } from '../Localization';
import { getFilterIconURL } from '../MapFeaturesData';
import { MapFeatures } from '../MapFeatures';
import { getUnixTimestamp } from '../Util';

import './MapControlSummary.css';

const HIGHLIGHT_ZOOM_LEVEL = 8;

const MapControlProgressBar = ({ percentage, width, ...other }) => {
  const endPos = (90 - 3) * percentage + 3;
  return (
    <svg viewBox={`0 0 100 ${width}`} {...other}>
      <path
        className={clsx('map-controls-about-summary-feature-progress-back')}
        d="M 3,6 L 90,6"
        strokeWidth="5"
        strokeLinecap="round"
        stroke="#D9D9D9"
        fillOpacity="0"
      />
      <path
        className={clsx('map-controls-about-summary-feature-progress-front')}
        d={`M 3,6 L ${endPos},6`}
        strokeWidth="5"
        strokeLinecap="round"
        stroke="#2db7f5"
        fillOpacity="0"
      />
    </svg>
  );
};

const MapControlSummaryFeatureMenu = ({
  locateFeature,
  clearExpiredFeature,
  clearAllFeature,
  doesExpire = false,
}) => {
  return (
    <>
      <Tooltip place="left" />
      <Popup
        trigger={
          <div
            data-tip={t('open-menu')}
            aria-label={t('open-menu')}
            className={clsx(
              'nf',
              'nf-mdi-menu',
              'map-controls-about-summary-feature-button',
              'map-controls-about-summary-feature-button-menu'
            )}
          />
        }
        position="top center"
        closeOnDocumentClick
        className="map-controls-about-summary-feature-menu"
        contentStyle={{ padding: '0px' }}
        nested
        keepTooltipInside
        offsetX={16}
        offsetY={0}
      >
        <div className={clsx('map-controls-about-summary-feature-menu')}>
          <div
            role="button"
            tabIndex={0}
            onClick={locateFeature}
            onKeyDown={locateFeature}
            className={clsx('map-controls-about-summary-feature-menu-item')}
          >
            {t('locate')}
          </div>
          {doesExpire ? (
            <div
              role="button"
              tabIndex={0}
              onClick={clearExpiredFeature}
              onKeyDown={clearExpiredFeature}
              className={clsx('map-controls-about-summary-feature-menu-item')}
            >
              {t('clear-expired')}
            </div>
          ) : null}

          <div
            role="button"
            tabIndex={0}
            onClick={clearAllFeature}
            onKeyDown={clearAllFeature}
            className={clsx('map-controls-about-summary-feature-menu-item')}
          >
            {t('clear-all')}
          </div>
        </div>
      </Popup>
    </>
  );
};

const MapControlSummaryFeature = ({
  completedIds,
  setCompletedIds,
  featureKey,
  setMapLocation,
}) => {
  const mapFeature = MapFeatures[featureKey];

  const totalCount = Object.keys(mapFeature.data).length;
  const completedCount = Object.keys(completedIds).length;

  if (completedCount === 0) return null;

  const locateFeature = () => {
    const unlocatedFeatures = mapFeature.data.filter((element) => {
      return !_.has(completedIds, element.id);
    });
    const unlocatedFeatureId = _.sample(Object.keys(unlocatedFeatures));
    const unlocatedFeature = unlocatedFeatures[unlocatedFeatureId];

    setMapLocation(unlocatedFeature.geometry.coordinates);
  };

  const expirationTime = mapFeature?.respawn;
  const doesExpire = expirationTime !== -1;

  const clearExpiredFeature = () => {
    if (!doesExpire) {
      return;
    }

    setCompletedIds((old) => {
      const now = getUnixTimestamp();
      const newKeys = Object.fromEntries(
        Object.keys(old)
          .map((markerId) => {
            const markerTime = old[markerId];

            // If expired, remove the key.
            if (now - markerTime > expirationTime) {
              return [markerId, null];
            }
            return [markerId, markerTime];
          })
          .filter((entry) => entry[1] !== null)
      );
      return newKeys;
    });
  };
  const clearAllFeature = () => {
    setCompletedIds((_old) => {
      return {};
    });
  };

  return (
    <div className={clsx('map-controls-about-summary-feature')}>
      <div className={clsx('map-controls-about-summary-feature-border')}>
        <img
          className={clsx('map-controls-about-summary-feature-icon')}
          src={getFilterIconURL(mapFeature.icons.filter)}
          alt={mapFeature.name}
        />
      </div>
      <div className={clsx('map-controls-about-summary-feature-subcontainer')}>
        <div className={clsx('map-controls-about-summary-feature-label')}>{mapFeature.name}</div>
        <MapControlProgressBar percentage={completedCount / totalCount} width={12} />
        <div className={clsx('map-controls-about-summary-feature-label')}>
          {completedCount} / {totalCount}
        </div>
      </div>
      <div className={clsx('map-controls-about-summary-feature-subcontainer')}>
        <MapControlSummaryFeatureMenu
          locateFeature={locateFeature}
          clearExpiredFeature={clearExpiredFeature}
          clearAllFeature={clearAllFeature}
          doesExpire={doesExpire ?? false}
        />
      </div>
    </div>
  );
};

/**
 * Displays features which are both:
 * A) Currently visible on the map, and
 * B) Have at least one feature marked as completed.
 */
const MapControlSummary = ({ mapPreferences, setMapPreferences }) => {
  const setMapLocation = (coordinates) => {
    setMapPreferences((old) => {
      return {
        ...old,
        position: {
          latlng: {
            // NOT REVERSED by GeoJSON.
            lat: coordinates[0],
            lng: coordinates[1],
          },
          zoom: HIGHLIGHT_ZOOM_LEVEL,
        },
      };
    });
  };

  return (
    <div className={clsx('map-controls-about-summary-container')}>
      <span className={clsx('map-controls-about-summary-header')}>{t('tab-summary')}</span>
      <span className={clsx('map-controls-about-summary-subtitle')}>{t('summary-subtitle')}</span>
      <div className={clsx('map-controls-about-summary-feature-container')}>
        {Object.keys(mapPreferences?.displayed?.features).map((featureKey) => {
          const completedIds = mapPreferences?.completed?.features[featureKey] ?? {};
          const setCompletedIds = (func) => {
            setMapPreferences((old) => ({
              ...old,
              completed: {
                ...old.completed,
                features: {
                  ...old.completed.features,
                  [featureKey]: func(old?.completed?.features[featureKey] ?? {}),
                },
              },
            }));
          };
          return (
            <MapControlSummaryFeature
              key={featureKey}
              featureKey={featureKey}
              completedIds={completedIds}
              setCompletedIds={setCompletedIds}
              setMapLocation={setMapLocation}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MapControlSummary;
