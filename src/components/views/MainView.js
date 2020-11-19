import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import LeafletMap from '../map/LeafletMap';
import MapControls from '../controls/MapControls';
import { t } from '../Localization';

import './MainView.css';

const _MainView = () => {
  return (
    <>
      <Helmet>
        <title>{t('page-title')}</title>
      </Helmet>
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
