import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  makeStyles,
} from '@material-ui/core';
import React, { cloneElement, FunctionComponent, useState, ReactElement } from 'react';

import { t } from 'src/components/i18n/Localization';
import DialogTitle from 'src/components/views/dialogs/DialogTitle';

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
  return (
    <div>
      {cloneElement(trigger, { onClick: () => setIsDialogOpen(true) })}
      <Dialog
        fullWidth
        maxWidth="lg"
        PaperProps={{ className: classes.dialog }}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      >
        <DialogTitle onClose={() => setIsDialogOpen(false)}>{t('clear-map-data')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('clear-map-data-content')}</DialogContentText>
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
            color="primary"
            aria-label={t('confirm')}
            tabIndex={0}
            onClick={() => {
              onConfirm();
              setIsDialogOpen(false);
            }}
          >
            {t('confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClearMapDataPopup;
