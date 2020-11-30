import React from 'react';
import { connect } from 'react-redux';

import LeafletMap from '../map/LeafletMap';
import MapControls from '../controls/MapControls';

import './MainView.css';

const _MainView = () => {
  return (
    <>
      <div className="map">
        <LeafletMap />
        <MapControls />
      </div>
    </>
  );
};

const mapStateToProps = (_state) => ({});
const mapDispatchToProps = (_dispatch) => ({});

const MainView = connect(mapStateToProps, mapDispatchToProps)(_MainView);

export default MainView;
