/**
 * Provides the interface for the popup which displays
 * when clicking "Clear Editor Data" in the Editor tab of the map controls.
 */

import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  makeStyles,
} from '@material-ui/core';
import React, { useState } from 'react';

import { t } from '~/components/i18n/Localization';
import Theme from '~/components/Theme';
import DialogTitle from '~/components/views/popups/DialogTitle';

const useStyles = makeStyles({
  dialog: {
    backgroundColor: '#f0e9e2',
  },
  button: {
    marginBottom: Theme.spacing(1),
  },
});

const ClearEditorDataPopup = ({ trigger, onConfirm }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const classes = useStyles();
  return (
    <>
      {React.cloneElement(trigger, {
        className: classes.button,
        onClick: () => setIsDialogOpen(true),
      })}
      <Dialog
        PaperProps={{ className: classes.dialog }}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      >
        <DialogTitle onClose={() => setIsDialogOpen(false)}>
          {t('popup-clear-editor-data-title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText> {t('popup-clear-editor-data-content')}</DialogContentText>
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
            color="primary"
            aria-label={t('popup-confirm')}
            tabIndex={0}
            onClick={() => {
              onConfirm();
              setIsDialogOpen(false);
            }}
            onKeyDown={() => {
              onConfirm();
              setIsDialogOpen(false);
            }}
          >
            {t('popup-confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClearEditorDataPopup;
