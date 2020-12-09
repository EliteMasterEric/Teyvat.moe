import React from 'react';
import clsx from 'clsx';
import Popup from 'reactjs-popup';
import { connect } from 'react-redux';

import { t } from '../Localization';

import './ImportDataPopup.css';
import { clearImportError } from '../../redux/ducks/import';

const _ImportDataPopup = ({ title, content, onConfirm, trigger, error, clearError }) => {
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
      {(closePopupFunc) => {
        const closePopup = () => {
          clearError();
          closePopupFunc();
        };

        const onClickConfirm = () => {
          const success = onConfirm(textarea);

          if (success) closePopup();
        };

        return (
          <div className={clsx('popup-import-data-container')}>
            <span className={clsx('popup-import-data-header')}>{title}</span>
            <span className={clsx('popup-import-data-content')}>{content}</span>
            <textarea
              className={clsx('popup-import-data-textarea')}
              text={textarea}
              onChange={(event) => setTextarea(event.target.value)}
            />

            <span className={clsx('popup-import-data-error')}>{error}</span>

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
                onClick={onClickConfirm}
                onKeyDown={onClickConfirm}
                className={clsx(
                  'popup-clear-editor-data-button',
                  'popup-clear-editor-data-button-confirm'
                )}
              >
                {t('popup-confirm')}
              </div>
            </div>
          </div>
        );
      }}
    </Popup>
  );
};

const mapStateToProps = (state) => ({
  error: state.importError,
});
const mapDispatchToProps = (dispatch) => ({
  clearError: () => dispatch(clearImportError()),
});
const ImportDataPopup = connect(mapStateToProps, mapDispatchToProps)(_ImportDataPopup);

export default ImportDataPopup;
