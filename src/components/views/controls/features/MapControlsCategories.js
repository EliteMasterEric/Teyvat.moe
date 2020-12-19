/**
 * Provides the interface for the Categories tabs
 * within the Features and Routes tabs of the Map controls.
 */

import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';

import { MapCategories } from '~/components/data/MapFeatures';
import { useImageExtension } from '~/components/interface/Image';
import MapControlsCategoryButton from '~/components/views/controls/features/MapControlsCategoryButton';
import { setControlsCategory, setControlsTab } from '~/redux/ducks/ui';

import './MapControlsCategories.css';

const _MapControlsCategories = ({ displayed }) => {
  const ext = useImageExtension();

  return (
    <div
      className={clsx(
        'map-controls-category-container',
        `map-controls-category-container-${ext}`,
        displayed ? '' : 'display-none'
      )}
    >
      {Object.keys(MapCategories).map((key) => {
        return <MapControlsCategoryButton key={key} categoryKey={key} />;
      })}
    </div>
  );
};

const mapStateToProps = (state) => ({
  displayed: ['features', 'routes'].includes(state.controlsTab),
});
const mapDispatchToProps = (dispatch) => ({
  setTab: (tab) => dispatch(setControlsTab(tab)),
  setCategory: (categoryKey) => dispatch(setControlsCategory(categoryKey)),
});
const MapControlsCategories = connect(mapStateToProps, mapDispatchToProps)(_MapControlsCategories);

export default MapControlsCategories;
