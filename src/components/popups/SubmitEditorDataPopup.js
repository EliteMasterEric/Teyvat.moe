/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import clsx from 'clsx';

import Popup from 'reactjs-popup';
import Select from 'react-select';
import ReactSwitch from 'react-switch';

import './SubmitEditorDataPopup.css';
import { MapCategories, MapRegions } from '../MapFeatures';

const SubmitEditorDataPopup = ({ trigger, onConfirm }) => {
  const [submissionName, setSubmissionName] = React.useState('');
  const [submissionRegion, setSubmissionRegion] = React.useState('');
  const [submissionCategory, setSubmissionCategory] = React.useState('');
  const [clusterMarkers, setClusterMarkers] = React.useState(false);

  const isValid = () => {
    return submissionName !== '' && submissionRegion !== '' && submissionCategory !== '';
  };

  const regionOptions = Object.keys(MapRegions).map((key) => {
    const value = MapRegions[key];
    return { value: key, label: value.name };
  });

  const categoryOptions = Object.keys(MapCategories).map((key) => {
    const value = MapCategories[key];
    return { value: key, label: value.name };
  });

  const onClickConfirm = (closePopup) => () => {
    if (!isValid) return;

    onConfirm({
      name: submissionName,
      region: submissionRegion,
      category: submissionCategory,
      cluster: clusterMarkers,
      icon: {
        filter: 'none',
        base: {
          marker: true,
          key: 'none',
        },
        done: {
          marker: true,
          done: true,
          key: 'none',
        },
      },
    });
    closePopup();
  };

  // NOTE: className on popup gets overridden with <class>-content, -overlay, and -arrow.
  return (
    <Popup
      trigger={trigger}
      className={clsx('popup-submit-editor-data')}
      modal
      position="center center"
      closeOnEscape
    >
      {(closePopup) => (
        <div className={clsx('popup-submit-editor-data-container')}>
          <span className={clsx('popup-submit-editor-data-header')}>Submit Editor Data</span>
          <span className={clsx('popup-submit-editor-data-form-content')}>
            Fill in the following form, then click &quot;Confirm&quot; below to be redirected to
            GitHub.
            <div className={clsx('popup-submit-editor-data-field-container', 'margin-bottom')}>
              <span>Feature Name</span>
              <input
                type="text"
                value={submissionName}
                onChange={(event) => setSubmissionName(event.target.value)}
              />
            </div>
            <div className={clsx('popup-submit-editor-data-field-container')}>
              <span>Category</span>
              <Select
                className={clsx('popup-submit-editor-data-field-dropdown')}
                options={categoryOptions}
                value={submissionCategory}
                onChange={(value) => setSubmissionCategory(value)}
              />
            </div>
            <div className={clsx('popup-submit-editor-data-field-container')}>
              <span>Region</span>
              <Select
                className={clsx('popup-submit-editor-data-field-dropdown')}
                options={regionOptions}
                value={submissionRegion}
                onChange={(value) => setSubmissionRegion(value)}
              />
            </div>
            <span className={clsx('popup-submit-editor-data-field-subtitle', 'margin-bottom')}>
              A feature can only be in one category and one region.
            </span>
            <div className={clsx('popup-submit-editor-data-field-container')}>
              <span>Cluster Markers?</span>
              <ReactSwitch
                onChange={(value) => setClusterMarkers(value)}
                checked={clusterMarkers}
              />
            </div>
            <span className={clsx('popup-submit-editor-data-field-subtitle')}>
              Enable marker clustering for common features like Carrots, and disable for uncommon
              ones like Statues.
            </span>
          </span>
          <div className={clsx('popup-submit-editor-data-button-container')}>
            <div
              role="button"
              aria-label="Cancel Clear Data"
              tabIndex={0}
              onClick={closePopup}
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
              className={clsx(
                'popup-submit-editor-data-button',
                isValid()
                  ? 'popup-submit-editor-data-button-confirm-enabled'
                  : 'popup-submit-editor-data-button-confirm-disabled'
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
