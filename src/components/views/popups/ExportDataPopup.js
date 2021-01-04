/**
 * Provides the interface for the popup which displays
 * when clicking "Export Data" or "Export Legacy Data" in the Options tab of the map controls.
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogContentText, makeStyles } from '@material-ui/core';

import CopyTextArea from '~/components/interface/CopyTextArea';
import DialogTitle from '~/components/views/popups/DialogTitle';

const useStyles = makeStyles({
  dialog: {
    backgroundColor: '#f0e9e2',
  },
});

const ExportDataPopup = ({ title, message, fetchData, trigger }) => {
  const [data, setData] = React.useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const classes = useStyles();

  // When the popup opens, update the contents.
  const onOpen = () => {
    setData(fetchData());
  };

  return (
    <div>
      {React.cloneElement(trigger, { onClick: () => setIsDialogOpen(true) })}
      <Dialog
        PaperProps={{ className: classes.dialog }}
        open={isDialogOpen}
        onEntering={onOpen}
        fullWidth
        maxWidth="lg"
        onClose={() => setIsDialogOpen(false)}
      >
        <DialogTitle onClose={() => setIsDialogOpen(false)}>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
          <CopyTextArea text={data} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExportDataPopup;
