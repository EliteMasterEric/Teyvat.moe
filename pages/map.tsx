import { SSRConfig } from 'next-i18next';
import React, { FunctionComponent } from 'react';

import { getServerSideTranslations } from 'src/components/i18n/I18Next';
import MapPageComponent from 'src/components/views/map/MapPage';

const MapPage: FunctionComponent = () => {
  return <MapPageComponent />;
};

type GetStaticPropsType = ({ locale }: { locale: string }) => Promise<{ props: SSRConfig }>;
export const getStaticProps: GetStaticPropsType = getServerSideTranslations;

export default MapPage;
