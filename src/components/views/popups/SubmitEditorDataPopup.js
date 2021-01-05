/**
 * Provides the interface for the popup which displays
 * when clicking "Submit Editor Data" in the Editor tab of the map controls.
 */

import {
  MenuItem,
  Select,
  Switch,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  makeStyles,
  FormControl,
  InputLabel,
  Typography,
  Box,
} from '@material-ui/core';
import React, { useState } from 'react';

import MapCategories from '~/components/data/MapCategories';
import MapRegions from '~/components/data/MapRegions';
import { t } from '~/components/i18n/Localization';
import { SafeHTML } from '~/components/Util';
import BorderBox from '~/components/interface/BorderBox';
import { InputTextField } from '~/components/interface/Input';
import DialogTitle from '~/components/views/popups/DialogTitle';

const useStyles = makeStyles({
  dialog: {
    backgroundColor: '#f0e9e2',
  },
  formField: {
    width: '90%',
    maxWidth: 300,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 10,
    fontStyle: 'italic',
  },
});

const SubmitEditorDataPopup = ({ trigger, onConfirm }) => {
  const [submissionName, setSubmissionName] = React.useState('');
  const [submissionRegion, setSubmissionRegion] = React.useState('');
  const [submissionCategory, setSubmissionCategory] = React.useState('');
  const [clusterMarkers, setClusterMarkers] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const classes = useStyles();

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

  const onClickConfirm = () => {
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
    setIsDialogOpen(false);
  };

  return (
    <>
      {React.cloneElement(trigger, { onClick: () => setIsDialogOpen(true) })}
      <Dialog
        PaperProps={{ className: classes.dialog }}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      >
        <DialogTitle onClose={() => setIsDialogOpen(false)}>
          {t('popup-submit-editor-data-title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <SafeHTML>{t('popup-submit-editor-data-content')}</SafeHTML>
          </DialogContentText>
          <BorderBox
            display="flex"
            flexDirection="column"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="center"
          >
            <InputTextField
              value={submissionName}
              label={t('popup-submit-editor-data-feature-name')}
              onChange={setSubmissionName}
              className={classes.formField}
            />
            <FormControl className={classes.formField}>
              <InputLabel>{t('popup-submit-editor-data-category')}</InputLabel>
              <Select
                value={submissionCategory}
                onChange={(event) => setSubmissionCategory(event.target.value)}
              >
                {categoryOptions.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formField}>
              <InputLabel>{t('popup-submit-editor-data-region')}</InputLabel>
              <Select
                value={submissionRegion}
                onChange={(event) => setSubmissionRegion(event.target.value)}
              >
                {regionOptions.map((region) => (
                  <MenuItem key={region.value} value={region.value}>
                    {region.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography className={classes.subtitle} gutterBottom>
              {t('popup-submit-editor-data-subtitle-a')}
            </Typography>
            <Box
              className={classes.formField}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography className={classes.label} flexGrow={1}>
                {t('popup-submit-editor-data-cluster-markers')}
              </Typography>
              <Switch
                size="small"
                color="primary"
                onChange={(event) => setClusterMarkers(event.target.checked)}
                checked={clusterMarkers}
              />
            </Box>
            <Typography className={classes.subtitle} gutterBottom>
              {t('popup-submit-editor-data-subtitle-b')}
            </Typography>
          </BorderBox>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="large"
            aria-label={t('popup-cancel')}
            tabIndex={0}
            onClick={() => setIsDialogOpen(false)}
          >
            {t('popup-cancel')}
          </Button>
          <Button
            variant="contained"
            size="large"
            aria-label={t('popup-confirm')}
            tabIndex={0}
            color="primary"
            onClick={onClickConfirm}
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
