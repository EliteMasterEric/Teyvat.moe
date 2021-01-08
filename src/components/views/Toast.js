import { Snackbar, IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import React from 'react';
import { connect } from 'react-redux';

import { setToast } from '~/redux/ducks/ui';

const _Toast = ({ toast, clearToast }) => {
  const [isOpen, setOpen] = React.useState(false);

  // Trigger the toast whenever the Redux state sets it.
  React.useEffect(() => {
    const shouldOpen = toast.message !== '';

    setOpen(shouldOpen);
  }, [toast]);

  const handleClose = (_event, reason) => {
    // reason is 'timeout' or 'clickaway' or 'closebutton'
    switch (reason) {
      case 'timeout':
      case 'closebutton':
        // Close the toast.
        clearToast();
        break;
      case 'clickaway':
      default:
        // Don't close.
        break;
    }
  };

  return (
    <Snackbar
      // Anchor to the bottom left always. We can make this an option later if desired.
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={isOpen}
      autoHideDuration={toast.duration}
      onClose={handleClose}
      message={toast.message}
      action={
        <>
          {toast.action}
          {toast.showClose ? (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={(event) => handleClose(event, 'closebutton')}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          ) : null}
        </>
      }
    />
  );
};

const mapStateToProps = (state) => ({
  toast: state.currentToast,
});
const mapDispatchToProps = (dispatch) => ({
  // Display an empty toast.
  clearToast: () => dispatch(setToast('', null, true, 6000)),
});

const Toast = connect(mapStateToProps, mapDispatchToProps)(_Toast);

export default Toast;
