/**
 * Provides the button which closes the Map controls.
 */

import { makeStyles, Box } from '@material-ui/core';
import { HighlightOff as HighlightOffIcon, FastRewind as FastRewindIcon } from '@material-ui/icons';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { useSmallScreen } from 'src/components/interface/MediaHooks';
import { AppDispatch } from 'src/components/redux';
import { selectOpen, setOpen } from 'src/components/redux/slices/ui';
import { AppState } from 'src/components/redux/types';

const useStyles = makeStyles((_theme) => ({
  fixedPosition: {
    position: 'fixed',
    marginTop: 64,
    marginLeft: -96,
    cursor: 'pointer',
    zIndex: -100,
  },
  foldButton: {
    backgroundColor: '#2E4051',
    borderRadius: '15%',
    color: '#CDB6AB',
    width: 48,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  foldBanner: {
    height: 0,
    border: '26px solid #2E4051',
    borderLeft: '8px solid transparent',
    color: '#CDB6AB',
    paddingLeft: 0,
    width: 96,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  foldIcon: {
    fontSize: 40,
  },
  foldHide: {
    opacity: 0,

    /* Set the speed of this animation. */
    '-webkit-transition': '0.5s',
    '-moz-transition': '0.5s',
    '-o-transition': '0.5s',
    transition: '0.5s',
  },
}));

interface ControlsFoldButtonBaseProps {
  button?: boolean;
  fixedPosition?: boolean;
}

const mapStateToProps = (state: AppState, _props: ControlsFoldButtonBaseProps) => ({
  open: selectOpen(state),
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setOpen: (open: boolean) => dispatch(setOpen(open)),
});
type ControlsFoldButtonStateProps = ReturnType<typeof mapStateToProps>;
type ControlsFoldButtonDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsFoldButtonStateProps,
  ControlsFoldButtonDispatchProps,
  ControlsFoldButtonBaseProps,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsFoldButtonProps = ConnectedProps<typeof connector> & ControlsFoldButtonBaseProps;

/**
 * The button next to the Map Controls.
 * Pressing it collapses or expands the Map Controls.
 */
const _ControlsFoldButton: FunctionComponent<ControlsFoldButtonProps> = ({
  open,
  setOpen,
  button = false,
  fixedPosition = true,
}) => {
  const classes = useStyles();
  // Toggle isOpen.
  const toggleOpen = () => setOpen(!open);

  const smallScreen = useSmallScreen();
  const hide = smallScreen && open && !button;

  return (
    <Box
      className={clsx(
        button ? classes.foldButton : classes.foldBanner,
        hide ? classes.foldHide : null,
        fixedPosition ? classes.fixedPosition : null
      )}
      onClick={toggleOpen}
    >
      {open ? (
        <HighlightOffIcon className={classes.foldIcon} />
      ) : (
        <FastRewindIcon className={classes.foldIcon} />
      )}
    </Box>
  );
};

const ControlsFoldButton = connector(_ControlsFoldButton);

export default ControlsFoldButton;
