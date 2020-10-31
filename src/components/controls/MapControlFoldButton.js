import React from 'react';

import imgFoldOpen from '../../images/controls/fold_open.png';
import imgFoldClose from '../../images/controls/fold_close.png';

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
      <img className="map-controls-fold" alt="" src={isOpen ? imgFoldClose : imgFoldOpen} />
    </div>
  );
};

export default MapControlFoldButton;
