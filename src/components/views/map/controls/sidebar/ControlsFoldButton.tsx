/**
 * Provides the button which closes the Map controls.
 */

import { Box } from '@material-ui/core';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { useSmallScreen } from 'src/components/interface/MediaHooks';
import { setOpen } from 'src/components/redux/slices/map/interface/Actions';
import { selectOpen } from 'src/components/redux/slices/map/interface/Selector';
import { AppState } from 'src/components/redux/Types';

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

const mapStateToProps = (state: AppState) => ({
  open: selectOpen(state),
});
const mapDispatchToProps = {
  setOpen,
};
type ControlsFoldButtonStateProps = ReturnType<typeof mapStateToProps>;
type ControlsFoldButtonDispatchProps = typeof mapDispatchToProps;
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
