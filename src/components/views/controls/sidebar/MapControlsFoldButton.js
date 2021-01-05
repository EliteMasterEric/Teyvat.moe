/**
 * Provides the button which closes the Map controls.
 */

import { makeStyles, Box } from '@material-ui/core';
import { HighlightOff as HighlightOffIcon, FastRewind as FastRewindIcon } from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';

import { isSmallScreen } from '~/components/interface/MediaQuery';
import { setControlsOpen } from '~/redux/ducks/ui';

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

/**
 * The button next to the Map Controls.
 * Pressing it collapses or expands the Map Controls.
 * @param {*} isOpen The state of the Map Controls. True means they are open.
 * @param {*} setOpen The function to change the state of the Map Controls.
 */
const _MapControlsFoldButton = ({ open, setOpen, button = false, fixedPosition = true }) => {
  const classes = useStyles();
  // Toggle isOpen.
  const toggleOpen = () => setOpen(!open);

  const smallScreen = isSmallScreen();
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

const mapStateToProps = (state) => ({
  open: state.controlsOpen,
});
const mapDispatchToProps = (dispatch) => ({ setOpen: (open) => dispatch(setControlsOpen(open)) });
const MapControlsFoldButton = connect(mapStateToProps, mapDispatchToProps)(_MapControlsFoldButton);

export default MapControlsFoldButton;
