/**
 * Provides the interface for the popup which displays
 * when clicking "Clear Map Data" in the Options tab of the map controls.
 */

import React from 'react';
import clsx from 'clsx';
import Popup from 'reactjs-popup';

import { t } from '~/components/i18n/Localization';

import './ClearMapDataPopup.css';

const ClearMapDataPopup = ({ trigger, onConfirm }) => {
  // NOTE: className on popup gets overridden with <class>-content, -overlay, and -arrow.
  return (
    <Popup
      trigger={trigger}
      className={clsx('popup-clear-map-data')}
      modal
      position="center center"
      closeOnDocumentClick
      closeOnEscape
    >
      {(closePopup) => (
        <div className={clsx('popup-clear-map-data-container')}>
          <span className={clsx('popup-clear-map-data-header')}>
            {t('popup-clear-map-data-title')}
          </span>
          <span className={clsx('popup-clear-map-data-content')}>
            {t('popup-clear-map-data-content')}
          </span>
          <div className={clsx('popup-clear-map-data-button-container')}>
            <div
              role="button"
              aria-label={t('popup-cancel')}
              tabIndex={0}
              onClick={closePopup}
              onKeyDown={closePopup}
              className={clsx('popup-clear-map-data-button', 'popup-clear-map-data-button-cancel')}
            >
              {t('popup-cancel')}
            </div>
            <div
              role="button"
              aria-label={t('popup-confirm')}
              tabIndex={0}
              onClick={() => {
                onConfirm();
                closePopup();
              }}
              onKeyDown={() => {
                onConfirm();
                closePopup();
              }}
              className={clsx('popup-clear-map-data-button', 'popup-clear-map-data-button-confirm')}
            >
              {t('popup-confirm')}
            </div>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default ClearMapDataPopup;
