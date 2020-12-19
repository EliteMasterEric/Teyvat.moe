/**
 * Provides the button which closes the Map controls.
 */

import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';

import { Image } from '~/components/interface/Image';
import { isSmallScreen } from '~/components/interface/MediaQuery';
import imgFoldOpenPNG from '~/images/controls/fold_open.png';
import imgFoldOpenWebP from '~/images/controls/fold_open.webp';
import imgFoldClosePNG from '~/images/controls/fold_close.png';
import imgFoldCloseWebP from '~/images/controls/fold_close.webp';
import { setControlsOpen } from '~/redux/ducks/ui';

import './MapControlsFoldButton.css';

/**
 * The button next to the Map Controls.
 * Pressing it collapses or expands the Map Controls.
 * @param {*} isOpen The state of the Map Controls. True means they are open.
 * @param {*} setOpen The function to change the state of the Map Controls.
 */
const _MapControlsFoldButton = ({ open, setOpen }) => {
  // Toggle isOpen.
  const toggleOpen = () => setOpen(!open);

  const smallScreen = isSmallScreen();
  const hide = smallScreen && open;

  return (
    <div
      onClick={toggleOpen}
      onKeyDown={() => {}}
      role="button"
      aria-label={open ? 'Close Filter Window' : 'Open Filter Window'}
      tabIndex={0}
    >
      <Image
        srcPNG={open ? imgFoldClosePNG : imgFoldOpenPNG}
        srcWebP={open ? imgFoldCloseWebP : imgFoldOpenWebP}
        className={clsx('map-controls-fold', hide ? 'map-control-fold-off' : '')}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  open: state.controlsOpen,
});
const mapDispatchToProps = (dispatch) => ({ setOpen: (open) => dispatch(setControlsOpen(open)) });
const MapControlsFoldButton = connect(mapStateToProps, mapDispatchToProps)(_MapControlsFoldButton);

export default MapControlsFoldButton;
