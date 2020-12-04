import React from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import { connect } from 'react-redux';

import imgFoldOpenPNG from '../../../images/controls/fold_open_small.png';
import imgFoldOpenWebP from '../../../images/controls/fold_open_small.webp';
import imgFoldClosePNG from '../../../images/controls/fold_close_small.png';
import imgFoldCloseWebP from '../../../images/controls/fold_close_small.webp';

import { Image } from '../../Image';

// CSS
import './MapControlsNavigationSmall.css';
import { setControlsOpen } from '../../../redux/ducks/ui';
import { MapRegions } from '../../MapFeatures';
import MapControlsRegionButton from './MapControlsRegionButton';

/**
 * The button next to the Map Controls.
 * Pressing it collapses or expands the Map Controls.
 * @param {*} isOpen The state of the Map Controls. True means they are open.
 * @param {*} setOpen The function to change the state of the Map Controls.
 */
const _MapControlsNavigationSmall = ({ displayRegions, open, setOpen }) => {
  // Toggle isOpen.
  const toggleOpen = () => setOpen(!open);

  return (
    <div className={clsx('map-controls-navigation-small-container')}>
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
          className={clsx('map-controls-fold-small')}
        />
      </div>
      {displayRegions
        ? _.keys(MapRegions).map((key) =>
            MapRegions[key]?.enabled ? (
              <MapControlsRegionButton key={key} regionKey={key} small />
            ) : null
          )
        : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  open: state.controlsOpen,
  displayRegions: state.controlsOpen && ['features', 'routes'].includes(state.controlsTab),
});
const mapDispatchToProps = (dispatch) => ({ setOpen: (open) => dispatch(setControlsOpen(open)) });
const MapControlsNavigationSmall = connect(
  mapStateToProps,
  mapDispatchToProps
)(_MapControlsNavigationSmall);

export default MapControlsNavigationSmall;
