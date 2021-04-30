import React, { FunctionComponent } from 'react';
import { getServerSideTranslations } from 'src/components/i18n/I18Next';
import HomePage from 'src/components/views/home/HomePage';

const IndexPage: FunctionComponent = () => {
  return <HomePage />;
};

export const getStaticProps = getServerSideTranslations;

export default IndexPage;
