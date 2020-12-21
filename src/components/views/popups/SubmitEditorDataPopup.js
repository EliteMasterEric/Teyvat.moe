/**
 * Provides the interface for the popup which displays
 * when clicking "Submit Editor Data" in the Editor tab of the map controls.
 */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import clsx from 'clsx';

import React, { useState } from 'react';

import {
  MenuItem,
  Select,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { MapCategories, MapRegions } from '~/components/data/MapFeatures';
import { useImageExtension } from '~/components/interface/Image';
import { t } from '~/components/i18n/Localization';
import { SafeHTML } from '~/components/Util';

import './SubmitEditorDataPopup.css';

const useStyles = makeStyles({
  dialog: {
    backgroundColor: '#f0e9e2',
  },
});

const SubmitEditorDataPopup = ({ trigger, onConfirm }) => {
  const [submissionName, setSubmissionName] = React.useState('');
  const [submissionRegion, setSubmissionRegion] = React.useState('');
  const [submissionCategory, setSubmissionCategory] = React.useState('');
  const [clusterMarkers, setClusterMarkers] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const classes = useStyles();

  const closePopup = () => {
    setIsDialogOpen(false);
  };
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

  const onClickConfirm = (closePopupCB) => () => {
    if (!isValid()) return;

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
    closePopupCB();
  };

  const ext = useImageExtension();

  // NOTE: className on popup gets overridden with <class>-content, -overlay, and -arrow.
  return (
    <>
      {React.cloneElement(trigger, { onClick: () => setIsDialogOpen(true) })}
      <Dialog
        PaperProps={{ className: classes.dialog }}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      >
        <DialogTitle>{t('popup-submit-editor-data-title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <SafeHTML>{t('popup-submit-editor-data-content')}</SafeHTML>
          </DialogContentText>
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
                value={submissionCategory}
                onChange={(event) => setSubmissionCategory(event.target.value)}
              >
                {categoryOptions.map((category) => (
                  <MenuItem value={category.value}>{category.label}</MenuItem>
                ))}
              </Select>
            </div>
            <div className={clsx('popup-submit-editor-data-field-container')}>
              <span>{t('popup-submit-editor-data-region')}</span>
              <Select
                value={submissionRegion}
                onChange={(event) => setSubmissionRegion(event.target.value)}
              >
                {regionOptions.map((region) => (
                  <MenuItem value={region.value}>{region.label}</MenuItem>
                ))}
              </Select>
            </div>
            <span className={clsx('popup-submit-editor-data-field-subtitle', 'margin-bottom')}>
              {t('popup-submit-editor-data-subtitle-a')}
            </span>
            <div className={clsx('popup-submit-editor-data-field-container')}>
              <span>{t('popup-submit-editor-data-cluster-markers')}</span>
              <Switch
                size="small"
                onChange={(value) => setClusterMarkers(value.target.checked)}
                checked={clusterMarkers}
              />
            </div>
            <span className={clsx('popup-submit-editor-data-field-subtitle')}>
              {t('popup-submit-editor-data-subtitle-b')}
            </span>
          </span>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="large"
            aria-label={t('popup-cancel')}
            tabIndex={0}
            onClick={closePopup}
          >
            {t('popup-cancel')}
          </Button>
          <Button
            variant="contained"
            size="large"
            aria-label={t('popup-confirm')}
            tabIndex={0}
            color="primary"
            onClick={onClickConfirm(closePopup)}
            disabled={!isValid()}
          >
            {t('popup-confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubmitEditorDataPopup;
