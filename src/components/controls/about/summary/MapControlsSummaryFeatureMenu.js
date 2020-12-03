import _ from 'lodash';
import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import Popup from 'reactjs-popup';
import Tooltip from 'react-tooltip';

import { t } from '../../../Localization';

import {
  clearFeatureCompleted,
  clearFeatureMarkersCompleted,
} from '../../../../redux/ducks/completed';
import store from '../../../../redux';
import { getUnixTimestamp } from '../../../Util';
import { setEditorHighlight, setPositionAndZoom } from '../../../../redux/ducks/ui';

import './MapControlsSummaryFeatureMenu.css';
import { MapFeatures } from '../../../MapFeatures';
import { setFeatureDisplayed } from '../../../../redux/ducks/displayed';

const _MapControlSummaryFeatureMenu = ({
  featureKey,

  hideFeature,
  clearAllFeature,
  clearExpiredFeature,
  locateFeature,
}) => {
  const mapFeature = MapFeatures[featureKey];
  const doesExpire = (mapFeature?.respawn ?? -1) !== -1;

  return (
    <>
      <Tooltip place="left" />
      <Popup
        trigger={
          <div
            data-tip={t('map-summary-menu-open')}
            aria-label={t('map-summary-menu-open')}
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
        {(closePopup) => (
          <div className={clsx('map-controls-about-summary-feature-menu')}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                locateFeature();
                closePopup();
              }}
              onKeyDown={() => {
                locateFeature();
                closePopup();
              }}
              className={clsx('map-controls-about-summary-feature-menu-item')}
            >
              {t('map-summary-menu-locate')}
            </div>
            {doesExpire ? (
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  clearExpiredFeature();
                  closePopup();
                }}
                onKeyDown={() => {
                  clearExpiredFeature();
                  closePopup();
                }}
                className={clsx('map-controls-about-summary-feature-menu-item')}
              >
                {t('map-summary-menu-clear-expired')}
              </div>
            ) : null}

            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                hideFeature();
                closePopup();
              }}
              onKeyDown={() => {
                hideFeature();
                closePopup();
              }}
              className={clsx('map-controls-about-summary-feature-menu-item')}
            >
              {t('map-summary-menu-hide-feature')}
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                clearAllFeature();
                closePopup();
              }}
              onKeyDown={() => {
                clearAllFeature();
                closePopup();
              }}
              className={clsx('map-controls-about-summary-feature-menu-item')}
            >
              {t('map-summary-menu-clear-all')}
            </div>
          </div>
        )}
      </Popup>
    </>
  );
};

const mapStateToProps = (_state) => ({});
const mapDispatchToProps = (dispatch, { featureKey }) => {
  const mapFeature = MapFeatures[featureKey];
  return {
    clearAllFeature: () => dispatch(clearFeatureCompleted(featureKey)),
    clearExpiredFeature: () => {
      const currentCompleted = store.getState().completed.features[featureKey];
      const now = getUnixTimestamp();
      const toClear = _.keys(
        _.pickBy(currentCompleted, (markerTime) => {
          // Is respawn set, and has the respawn time elapsed?
          return (mapFeature?.respawn ?? -1) !== -1 && now - markerTime > mapFeature?.respawn;
        })
      );
      dispatch(clearFeatureMarkersCompleted(featureKey, toClear));
    },
    locateFeature: () => {
      const HIGHLIGHT_ZOOM_LEVEL = 8;
      const completedMarkers = _.keys(store.getState().completed.features[featureKey]);
      const uncompletedMarkers = _.filter(mapFeature.data, (value) => {
        return !completedMarkers.includes(value.id);
      });
      const randomMarker = _.sample(uncompletedMarkers);

      dispatch(setEditorHighlight(randomMarker.id));
      dispatch(
        setPositionAndZoom(
          {
            lat: randomMarker.geometry.coordinates[0],
            lng: randomMarker.geometry.coordinates[1],
          },
          HIGHLIGHT_ZOOM_LEVEL
        )
      );
    },
    hideFeature: () => {
      dispatch(setFeatureDisplayed(featureKey, false));
    },
  };
};
const MapControlSummaryFeatureMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(_MapControlSummaryFeatureMenu);

export default MapControlSummaryFeatureMenu;
