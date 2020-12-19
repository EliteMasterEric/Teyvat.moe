/**
 * Provides the interface for the popup which displays
 * when clicking "Export Data" or "Export Legacy Data" in the Options tab of the map controls.
 */

import clsx from 'clsx';
import React from 'react';
import Popup from 'reactjs-popup';

import CopyTextArea from '~/components/interface/CopyTextArea';

import './ExportDataPopup.css';

const ExportDataPopup = ({ title, message, fetchData, trigger }) => {
  const [data, setData] = React.useState('');

  // When the popup opens, update the contents.
  const onOpen = () => {
    setData(fetchData());
  };

  // NOTE: className on popup gets overridden with <class>-content, -overlay, and -arrow.
  return (
    <Popup
      trigger={trigger}
      className={clsx('popup-export-data')}
      modal
      onOpen={onOpen}
      position="center center"
      closeOnDocumentClick
      closeOnEscape
    >
      <div className={clsx('popup-export-data-container')}>
        <span className={clsx('popup-export-data-header')}>{title}</span>
        <span className={clsx('popup-export-data-content')}>{message}</span>
        <CopyTextArea className={clsx('popup-export-data-textarea')} text={data} />
      </div>
    </Popup>
  );
};

export default ExportDataPopup;
