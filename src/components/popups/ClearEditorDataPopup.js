import React from 'react';
import clsx from 'clsx';
import Popup from 'reactjs-popup';

import './ClearEditorDataPopup.css';
import { t } from '../Localization';

const ClearEditorDataPopup = ({ trigger, onConfirm }) => {
  // NOTE: className on popup gets overridden with <class>-content, -overlay, and -arrow.
  return (
    <Popup
      trigger={trigger}
      className={clsx('popup-clear-editor-data')}
      modal
      position="center center"
      closeOnDocumentClick
      closeOnEscape
    >
      {(closePopup) => (
        <div className={clsx('popup-clear-editor-data-container')}>
          <span className={clsx('popup-clear-editor-data-header')}>
            {t('popup-clear-editor-data-title')}
          </span>
          <span className={clsx('popup-clear-editor-data-content')}>
            {t('popup-clear-editor-data-content')}
          </span>
          <div className={clsx('popup-clear-editor-data-button-container')}>
            <div
              role="button"
              aria-label={t('popup-cancel')}
              tabIndex={0}
              onClick={closePopup}
              onKeyDown={closePopup}
              className={clsx(
                'popup-clear-editor-data-button',
                'popup-clear-editor-data-button-cancel'
              )}
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
              className={clsx(
                'popup-clear-editor-data-button',
                'popup-clear-editor-data-button-confirm'
              )}
            >
              {t('popup-confirm')}
            </div>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default ClearEditorDataPopup;
