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
import DialogTitle from '~/components/views/popups/DialogTitle';

const useStyles = makeStyles({
  dialog: {
    backgroundColor: '#f0e9e2',
  },
});

const ClearMapDataPopup = ({ trigger, onConfirm }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const classes = useStyles();
  return (
    <div>
      {React.cloneElement(trigger, { onClick: () => setIsDialogOpen(true) })}
      <Dialog
        fullWidth
        maxWidth="lg"
        PaperProps={{ className: classes.dialog }}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      >
        <DialogTitle onClose={() => setIsDialogOpen(false)}>
          {t('popup-clear-map-data-title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{t('popup-clear-map-data-content')}</DialogContentText>
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
          >
            {t('popup-confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClearMapDataPopup;
