/**
 * Provides the interface for the popup which displays
 * when clicking "Submit Editor Data" in the Editor tab of the map controls.
 */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { Switch } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import Popup from 'reactjs-popup';
import Select from 'react-select-oss';

import { MapCategories, MapRegions } from '~/components/data/MapFeatures';
import { useImageExtension } from '~/components/interface/Image';
import { t } from '~/components/i18n/Localization';
import { SafeHTML } from '~/components/Util';

import './SubmitEditorDataPopup.css';

const SubmitEditorDataPopup = ({ trigger, onConfirm }) => {
  const [submissionName, setSubmissionName] = React.useState('');
  const [submissionRegion, setSubmissionRegion] = React.useState(null);
  const [submissionCategory, setSubmissionCategory] = React.useState(null);
  const [clusterMarkers, setClusterMarkers] = React.useState(false);

  const isValid = () => {
    return submissionName !== '' && submissionRegion !== '' && submissionCategory !== '';
  };

  const regionOptions = Object.keys(MapRegions).map((key) => {
    const value = MapRegions[key];
    return { value: key, label: t(value.nameKey) };
  });

  const categoryOptions = Object.keys(MapCategories).map((key) => {
    const value = MapCategories[key];
    return { value: key, label: t(value.nameKey) };
  });

  const onClickConfirm = (closePopup) => () => {
    if (!isValid) return;

    onConfirm({
      name: {
        en: submissionName,
      },
      region: submissionRegion.value,
      category: submissionCategory.value,
      cluster: clusterMarkers,
      icons: {
        filter: 'none',
        base: {
          marker: true,
        },
        done: {
          marker: true,
        },
      },
    });
    closePopup();
  };

  const ext = useImageExtension();

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
          <span className={clsx('popup-submit-editor-data-header')}>
            {t('popup-submit-editor-data-title')}
          </span>
          <SafeHTML>{t('popup-submit-editor-data-content')}</SafeHTML>
          <span
            className={clsx(
              'popup-submit-editor-data-form-content',
              `popup-submit-editor-data-form-content-${ext}`
            )}
          >
            <div className={clsx('popup-submit-editor-data-field-container', 'margin-bottom')}>
              <span>{t('popup-submit-editor-data-feature-name')}</span>
              <input
                type="text"
                value={submissionName}
                onChange={(event) => setSubmissionName(event.target.value)}
              />
            </div>
            <div className={clsx('popup-submit-editor-data-field-container')}>
              <span>{t('popup-submit-editor-data-category')}</span>
              <Select
                className={clsx('popup-submit-editor-data-field-dropdown')}
                options={categoryOptions}
                value={submissionCategory}
                onChange={(value) => setSubmissionCategory(value)}
              />
            </div>
            <div className={clsx('popup-submit-editor-data-field-container')}>
              <span>{t('popup-submit-editor-data-region')}</span>
              <Select
                className={clsx('popup-submit-editor-data-field-dropdown')}
                options={regionOptions}
                value={submissionRegion}
                onChange={(value) => setSubmissionRegion(value)}
              />
            </div>
            <span className={clsx('popup-submit-editor-data-field-subtitle', 'margin-bottom')}>
              {t('popup-submit-editor-data-subtitle-a')}
            </span>
            <div className={clsx('popup-submit-editor-data-field-container')}>
              <span>{t('popup-submit-editor-data-cluster-markers')}</span>
              <Switch
                size="small"
                onChange={(value) => setClusterMarkers(value)}
                checked={clusterMarkers}
              />
            </div>
            <span className={clsx('popup-submit-editor-data-field-subtitle')}>
              {t('popup-submit-editor-data-subtitle-b')}
            </span>
          </span>
          <div className={clsx('popup-submit-editor-data-button-container')}>
            <div
              role="button"
              aria-label={t('popup-cancel')}
              tabIndex={0}
              onClick={closePopup}
              className={clsx(
                'popup-submit-editor-data-button',
                'popup-submit-editor-data-button-cancel'
              )}
            >
              {t('popup-cancel')}
            </div>
            <div
              role="button"
              aria-label={t('popup-confirm')}
              tabIndex={0}
              onClick={onClickConfirm(closePopup)}
              className={clsx(
                'popup-submit-editor-data-button',
                isValid()
                  ? 'popup-submit-editor-data-button-confirm-enabled'
                  : 'popup-submit-editor-data-button-confirm-disabled'
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

export default SubmitEditorDataPopup;
