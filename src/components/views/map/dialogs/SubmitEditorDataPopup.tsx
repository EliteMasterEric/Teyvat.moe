/**
 * Provides the interface for the popup which displays
 * when clicking "Submit Editor Data" in the Editor tab of the map controls.
 */

import {
  MenuItem,
  Select,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  makeStyles,
  FormControl,
  InputLabel,
  Typography,
} from '@material-ui/core';
import _ from 'lodash';
import React, { useState, cloneElement, FunctionComponent, ReactElement } from 'react';

import { MSFFilterIcon, MSFSchemaVersion } from 'src/components/data/map/Element';
import {
  getMapCategory,
  MapCategoryKey,
  MapCategoryKeys,
} from 'src/components/data/map/MapCategories';
import { getMapRegion, MapRegionKey, MapRegionKeys } from 'src/components/data/map/MapRegions';
import { LocalizedSafeHTML, t } from 'src/components/i18n/Localization';
import BorderBox from 'src/components/interface/BorderBox';
import { InputTextArea, InputTextField } from 'src/components/interface/Input';
import { EditorFeatureSubmission } from 'src/components/preferences/map/EditorDataSchema';
import { SafeHTML } from 'src/components/util';
import DialogTitle from 'src/components/views/map/dialogs/DialogTitle';

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

interface SubmitEditorDataPopupTriggerProps {
  className?: string;
  onClick: () => void;
}
interface SubmitEditorDataPopupProps {
  trigger: ReactElement<SubmitEditorDataPopupTriggerProps>;
  onConfirm: (data: EditorFeatureSubmission) => void;
}
const SubmitEditorDataPopup: FunctionComponent<SubmitEditorDataPopupProps> = ({
  trigger,
  onConfirm,
}) => {
  const [submissionName, setSubmissionName] = useState<string>('');
  const [submissionDescription, setSubmissionDescription] = useState<string>('');
  const [submissionRegion, setSubmissionRegion] = useState<MapRegionKey>('mondstadt');
  const [submissionCategory, setSubmissionCategory] = useState<MapCategoryKey>('special');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const classes = useStyles();

  const isValid = () => {
    return submissionName !== '';
  };

  const regionOptions = _.map(MapRegionKeys, (key) => {
    const value = getMapRegion(key);
    return { value: key.toString(), label: t(value.nameKey) };
  });

  const categoryOptions = _.map(MapCategoryKeys, (key) => {
    const value = getMapCategory(key);
    return { value: key.toString(), label: t(value.nameKey) };
  });

  const onClickConfirm = () => {
    if (!isValid()) return;

    const formData: EditorFeatureSubmission = {
      format: 2 as MSFSchemaVersion,
      enabled: true,
      respawn: 'none',
      cluster: 'off',
      name: {
        en: submissionName,
      },
      description: {
        en: submissionDescription,
      },
      region: submissionRegion,
      category: submissionCategory,
      icons: {
        filter: 'none' as MSFFilterIcon,
        base: {
          marker: true,
        },
        done: {
          marker: true,
        },
      },
    };

    onConfirm(formData);
    setIsDialogOpen(false);
  };

  return (
    <>
      {cloneElement(trigger, { onClick: () => setIsDialogOpen(true) })}
      <Dialog
        PaperProps={{ className: classes.dialog }}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      >
        <DialogTitle onClose={() => setIsDialogOpen(false)}>
          {t('map-ui:submit-editor-data')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <LocalizedSafeHTML i18nKey="map-ui:submit-editor-data-content" />
          </DialogContentText>
          <BorderBox
            display="flex"
            direction="column"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="center"
          >
            <InputTextField
              value={submissionName}
              label={t('map-ui:feature-name')}
              onChange={setSubmissionName}
              className={classes.formField}
            />
            <InputTextArea
              rows={3}
              value={submissionDescription}
              label={t('map-ui:feature-description')}
              onChange={setSubmissionDescription}
              className={classes.formField}
            />
            <FormControl className={classes.formField}>
              <InputLabel>{t('category')}</InputLabel>
              <Select
                value={submissionCategory}
                onChange={(event) => setSubmissionCategory(event.target.value as MapCategoryKey)}
              >
                {_.map(categoryOptions, (category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formField}>
              <InputLabel>{t('region')}</InputLabel>
              <Select
                value={submissionRegion}
                onChange={(event) => setSubmissionRegion(event.target.value as MapRegionKey)}
              >
                {_.map(regionOptions, (region) => (
                  <MenuItem key={region.value} value={region.value}>
                    {region.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography className={classes.subtitle} gutterBottom>
              {t('map-ui:submit-editor-data-subtitle-category-region')}
            </Typography>
          </BorderBox>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="large"
            aria-label={t('cancel')}
            tabIndex={0}
            onClick={() => setIsDialogOpen(false)}
          >
            {t('cancel')}
          </Button>
          <Button
            variant="contained"
            size="large"
            aria-label={t('map-ui:submit-to-github')}
            tabIndex={0}
            color="primary"
            onClick={onClickConfirm}
            disabled={!isValid()}
          >
            {t('map-ui:submit-to-github')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubmitEditorDataPopup;
