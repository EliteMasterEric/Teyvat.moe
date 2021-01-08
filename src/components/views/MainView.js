import React from 'react';
import { connect } from 'react-redux';

import PermalinkHandler from '~/components/views/PermalinkHandler';
import LeafletMap from '~/components/views/map/LeafletMap';
import MapControls from '~/components/views/controls/MapControls';
import Toast from '~/components/views/Toast';

const _MainView = () => {
  // Uncomment this to clear local storage.
  // require('./components/preferences/Preferences').resetLocalStorage();

  return (
    <>
      <div className="map">
        <LeafletMap />
        <MapControls />
        <Toast />
        <PermalinkHandler />
      </div>
    </>
  );
};

const mapStateToProps = (_state) => ({});
const mapDispatchToProps = (_dispatch) => ({});

const MainView = connect(mapStateToProps, mapDispatchToProps)(_MainView);

export default MainView;
