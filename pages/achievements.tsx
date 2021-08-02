import React, { FunctionComponent } from 'react';
import { getServerSideTranslations } from 'src/components/i18n/I18Next';
import AchievementPage from 'src/components/views/achievements/AchievementsPage';

const AchievementChecklistPage: FunctionComponent = () => {
  return <AchievementPage />;
};

export const getStaticProps = getServerSideTranslations;

export default AchievementChecklistPage;
