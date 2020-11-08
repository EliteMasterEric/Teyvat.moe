import React from 'react';
import { Helmet } from 'react-helmet';

import LeafletMap from '../map/LeafletMap';
import MapControls from '../controls/MapControls';
import { t } from '../Localization';

import './MainView.css';

const MainView = ({ mapPreferences, setMapPreferences }) => {
  return (
    <>
      <Helmet>
        <title>{t('page-title')}</title>
      </Helmet>
      <div className="map">
        <LeafletMap mapPreferences={mapPreferences} setMapPreferences={setMapPreferences} />
        <MapControls mapPreferences={mapPreferences} setMapPreferences={setMapPreferences} />
      </div>
    </>
  );
};

export default MainView;
