import React from 'react';
import clsx from 'clsx';

import imgFoldOpenPNG from '../../images/controls/fold_open.png';
import imgFoldOpenWebP from '../../images/controls/fold_open.webp';
import imgFoldClosePNG from '../../images/controls/fold_close.png';
import imgFoldCloseWebP from '../../images/controls/fold_close.webp';

import { Image } from '../Image';

// CSS
import './MapControlFoldButton.css';

/**
 * The button next to the Map Controls.
 * Pressing it collapses or expands the Map Controls.
 * @param {*} isOpen The state of the Map Controls. True means they are open.
 * @param {*} setOpen The function to change the state of the Map Controls.
 */
const MapControlFoldButton = ({ isOpen, setOpen }) => {
  // Toggle isOpen.
  const toggleOpen = () => setOpen((old) => !old);

  return (
    <div
      onClick={toggleOpen}
      onKeyDown={toggleOpen}
      role="button"
      aria-label={isOpen ? 'Close Filter Window' : 'Open Filter Window'}
      tabIndex={0}
    >
      <Image
        srcPNG={isOpen ? imgFoldClosePNG : imgFoldOpenPNG}
        srcWebP={isOpen ? imgFoldCloseWebP : imgFoldOpenWebP}
        className={clsx('map-controls-fold')}
      />
    </div>
  );
};

export default MapControlFoldButton;
