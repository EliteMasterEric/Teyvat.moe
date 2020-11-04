import React from 'react';
import clsx from 'clsx';
import Popup from 'reactjs-popup';

import './ExportDataPopup.css';
import CopyTextArea from './CopyTextArea';

const ExportDataPopup = ({ header, message, fetchData, trigger }) => {
  const data = fetchData();

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
      <div className={clsx('popup-export-data-container')}>
        <span className={clsx('popup-export-data-header')}>{header}</span>
        <span className={clsx('popup-export-data-content')}>{message}</span>
        <CopyTextArea className={clsx('popup-export-data-textarea')} text={data} />
      </div>
    </Popup>
  );
};

export default ExportDataPopup;
