import { Button, Dialog, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { cloneElement, FunctionComponent, useState, ReactElement, useCallback } from 'react';

import { t } from 'src/components/i18n/Localization';
import DialogTitle from 'src/components/views/map/dialogs/DialogTitle';

const useStyles = makeStyles({
  dialog: {
    backgroundColor: '#f0e9e2',
  },
});

interface ClearMapDataPopupTriggerProps {
  className?: string;
  onClick: () => void;
}
interface ClearMapDataPopupProps {
  trigger: ReactElement<ClearMapDataPopupTriggerProps>;
  onConfirm: () => void;
}
const ClearMapDataPopup: FunctionComponent<ClearMapDataPopupProps> = ({ trigger, onConfirm }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const classes = useStyles();

  const closeDialog = useCallback(() => setIsDialogOpen(false), []);
  const finishDialog = useCallback(() => {
    onConfirm();
    closeDialog();
  }, []);

  return (
    <div>
      {cloneElement(trigger, { onClick: () => setIsDialogOpen(true) })}
      <Dialog
        fullWidth
        maxWidth="lg"
        PaperProps={{ className: classes.dialog }}
        open={isDialogOpen}
        onClose={closeDialog}
      >
        <DialogTitle onClose={closeDialog}>{t('map-ui:clear-map-data')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('map-ui:clear-map-data-content')}</DialogContentText>
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
          >
            {t('confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClearMapDataPopup;
