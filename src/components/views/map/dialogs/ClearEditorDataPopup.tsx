/**
 * Provides the interface for the popup which displays
 * when clicking "Clear Editor Data" in the Editor tab of the map controls.
 */

import { Button, Dialog, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { cloneElement, useState, FunctionComponent, ReactElement, useCallback } from 'react';

import { t } from 'src/components/i18n/Localization';
import Theme from 'src/components/Theme';
import DialogTitle from 'src/components/views/map/dialogs/DialogTitle';

const useStyles = makeStyles({
  dialog: {
    backgroundColor: '#f0e9e2',
  },
  button: {
    marginBottom: Theme.spacing(1),
  },
});

interface ClearEditorDataPopupTriggerProps {
  className?: string;
  onClick: () => void;
}
interface ClearEditorDataPopupProps {
  trigger: ReactElement<ClearEditorDataPopupTriggerProps>;
  onConfirm: () => void;
}
const ClearEditorDataPopup: FunctionComponent<ClearEditorDataPopupProps> = ({
  trigger,
  onConfirm,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const classes = useStyles();

  const openDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const finishDialog = useCallback(() => {
    onConfirm();
    closeDialog();
  }, []);

  return (
    <>
      {cloneElement(trigger, {
        className: classes.button,
        onClick: openDialog,
      })}
      <Dialog PaperProps={{ className: classes.dialog }} open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle onClose={closeDialog}>{t('map-ui:clear-editor-data')}</DialogTitle>
        <DialogContent>
          <DialogContentText> {t('map-ui:clear-editor-data-content')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="large"
            aria-label={t('cancel')}
            tabIndex={0}
            onClick={closeDialog}
          >
            {t('cancel')}
          </Button>
          <Button
            variant="contained"
            size="large"
            color="primary"
            aria-label={t('confirm')}
            tabIndex={0}
            onClick={finishDialog}
            onKeyDown={finishDialog}
          >
            {t('confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClearEditorDataPopup;
