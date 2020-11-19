import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';

import imgFoldOpenPNG from '../../../images/controls/fold_open.png';
import imgFoldOpenWebP from '../../../images/controls/fold_open.webp';
import imgFoldClosePNG from '../../../images/controls/fold_close.png';
import imgFoldCloseWebP from '../../../images/controls/fold_close.webp';

import { Image } from '../../Image';

// CSS
import './MapControlsFoldButton.css';
import { setControlsOpen } from '../../../redux/ducks/ui';

/**
 * The button next to the Map Controls.
 * Pressing it collapses or expands the Map Controls.
 * @param {*} isOpen The state of the Map Controls. True means they are open.
 * @param {*} setOpen The function to change the state of the Map Controls.
 */
const _MapControlsFoldButton = ({ open, setOpen }) => {
  // Toggle isOpen.
  const toggleOpen = () => setOpen(!open);

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
        className={clsx('map-controls-fold')}
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
