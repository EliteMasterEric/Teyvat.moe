import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';

import { MapCategories } from '../../MapFeatures';
import { useImageExtension } from '../../Image';
import MapControlsCategoryButton from './MapControlsCategoryButton';
import { setControlsCategory, setControlsTab } from '../../../redux/ducks/ui';

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
