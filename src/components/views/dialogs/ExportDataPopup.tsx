/**
 * Provides the interface for the popup which displays
 * when clicking "Export Data" or "Export Legacy Data" in the Options tab of the map controls.
 */

import { Dialog, DialogContent, DialogContentText, makeStyles } from '@material-ui/core';
import React, { cloneElement, FunctionComponent, ReactElement, useState } from 'react';

import CopyTextArea from 'src/components/interface/CopyTextArea';
import DialogTitle from 'src/components/views/dialogs/DialogTitle';

const useStyles = makeStyles({
  dialog: {
    backgroundColor: '#f0e9e2',
  },
});

interface ExportDataPopupTriggerProps {
  className?: string;
  onClick: () => void;
}
interface ExportDataPopupProps {
  title: string;
  message: string;
  fetchData: () => string;
  trigger: ReactElement<ExportDataPopupTriggerProps>;
}
const ExportDataPopup: FunctionComponent<ExportDataPopupProps> = ({
  title,
  message,
  fetchData,
  trigger,
}) => {
  const [data, setData] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const classes = useStyles();

  // When the popup opens, update the contents.
  const onOpen = () => {
    setData(fetchData());
  };

  return (
    <div>
      {cloneElement(trigger, { onClick: () => setIsDialogOpen(true) })}
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
          <CopyTextArea text={data} rows={4} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExportDataPopup;
