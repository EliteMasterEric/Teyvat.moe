/**
 * Title which displays at the top of all dialogs, which includes an intuitive Close button.
 */

import {
  DialogTitle as MuiDialogTitle,
  makeStyles,
  Typography,
  IconButton,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import React, { ReactNode, FunctionComponent } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

type DialogTitleProps = {
  children: ReactNode;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
} & React.HTMLAttributes<HTMLDivElement>;
const DialogTitle: FunctionComponent<DialogTitleProps> = ({ children, onClose, ...other }) => {
  const classes = useStyles();

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

export default DialogTitle;
