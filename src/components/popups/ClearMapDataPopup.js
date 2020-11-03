import React from 'react';
import clsx from 'clsx';
import Popup from 'reactjs-popup';

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
          <span className={clsx('popup-clear-map-data-header')}>Clear Map Data?</span>
          <span className={clsx('popup-clear-map-data-content')}>
            Are you sure? If you clear the map preferences data, it cannot be recovered.
          </span>
          <div className={clsx('popup-clear-map-data-button-container')}>
            <div
              role="button"
              aria-label="Cancel Clear Data"
              tabIndex={0}
              onClick={closePopup}
              onKeyDown={closePopup}
              className={clsx('popup-clear-map-data-button', 'popup-clear-map-data-button-cancel')}
            >
              Cancel
            </div>
            <div
              role="button"
              aria-label="Confirm Clear Data"
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
              Confirm
            </div>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default ClearMapDataPopup;
