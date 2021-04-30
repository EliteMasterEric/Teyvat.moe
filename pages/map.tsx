import React, { FunctionComponent } from 'react';
import { getServerSideTranslations } from 'src/components/i18n/I18Next';
import MapPageComponent from 'src/components/views/map/MapPage';

const MapPage: FunctionComponent = () => {
  return <MapPageComponent />;
};

export const getStaticProps = getServerSideTranslations;

export default MapPage;
