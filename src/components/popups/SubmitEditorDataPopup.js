import React from 'react';
import clsx from 'clsx';
import Popup from 'reactjs-popup';

import './SubmitEditorDataPopup.css';

const SubmitEditorDataPopup = ({ trigger, onConfirm }) => {
  const [submissionName, setSubmissionName] = React.useState('');

  const onClickConfirm = (closePopup) => () => {
    if (submissionName !== '') {
      onConfirm(submissionName);
      closePopup();
    }
  };

  // NOTE: className on popup gets overridden with <class>-content, -overlay, and -arrow.
  return (
    <Popup
      trigger={trigger}
      className={clsx('popup-submit-editor-data')}
      modal
      position="center center"
      closeOnDocumentClick
      closeOnEscape
    >
      {(closePopup) => (
        <div className={clsx('popup-submit-editor-data-container')}>
          <span className={clsx('popup-submit-editor-data-header')}>Submit Editor Data</span>
          <span className={clsx('popup-submit-editor-data-content')}>
            Specify a name for your submission, then click &quot;Confirm&quot; below to be
            redirected to GitHub.
            <div className={clsx('popup-submit-editor-data-field-container')}>
              <span>Submission Name</span>
              <input
                type="text"
                value={submissionName}
                onChange={(event) => setSubmissionName(event.target.value)}
              />
            </div>
          </span>
          <div className={clsx('popup-submit-editor-data-button-container')}>
            <div
              role="button"
              aria-label="Cancel Clear Data"
              tabIndex={0}
              onClick={closePopup}
              onKeyDown={closePopup}
              className={clsx(
                'popup-submit-editor-data-button',
                'popup-submit-editor-data-button-cancel'
              )}
            >
              Cancel
            </div>
            <div
              role="button"
              aria-label="Confirm Clear Data"
              tabIndex={0}
              onClick={onClickConfirm(closePopup)}
              onKeyDown={onClickConfirm(closePopup)}
              className={clsx(
                'popup-submit-editor-data-button',
                'popup-submit-editor-data-button-confirm'
              )}
            >
              Confirm
            </div>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default SubmitEditorDataPopup;
