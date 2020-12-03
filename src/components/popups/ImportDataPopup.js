import React from 'react';
import clsx from 'clsx';
import Popup from 'reactjs-popup';

import { t } from '../Localization';

import './ImportDataPopup.css';

const ImportDataPopup = ({ title, content, onConfirm, trigger }) => {
  const [textarea, setTextarea] = React.useState('');

  // NOTE: className on popup gets overridden with <class>-content, -overlay, and -arrow.
  return (
    <Popup
      trigger={trigger}
      className={clsx('popup-export-data')}
      modal
      position="center center"
      closeOnDocumentClick
      closeOnEscape
    >
      {(closePopup) => (
        <div className={clsx('popup-import-data-container')}>
          <span className={clsx('popup-import-data-header')}>{title}</span>
          <span className={clsx('popup-import-data-content')}>{content}</span>
          <textarea
            className={clsx('popup-import-data-textarea')}
            text={textarea}
            onChange={(event) => setTextarea(event.target.value)}
          />

          <div className={clsx('popup-import-data-button-container')}>
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
                onConfirm(textarea);
                closePopup();
              }}
              onKeyDown={() => {
                onConfirm(textarea);
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

export default ImportDataPopup;
