import { Typography, Container, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import _ from 'lodash';
import Head from 'next/head';
import React, { FunctionComponent, useState } from 'react';
import {
  AchievementsTabOptions,
  AchievementsTabList,
  AchievementsTabCategories,
} from './AchievementsTabs';
import { AchievementCategoryId } from 'src/components/data/achievements/AchievementCategoryData';
import { f, t } from 'src/components/i18n/Localization';
import Header from 'src/components/interface/Header';
import { getApplicationVersion } from 'src/components/util';

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: theme.palette.primary.dark,
    minHeight: '100vh',
    color: '#FFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  pageBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  pageFooter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },
}));

const AchievementPage: FunctionComponent = () => {
  const classes = useStyles();

  const [selectedCategory, setSelectedCategory] = useState<null | AchievementCategoryId>(null);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const handleClickCard = (id: null | AchievementCategoryId) => {
    setSelectedCategory(id);
  };

  return (
    <>
      <Head>
        {/* The title of the webpage as displayed in the tab name. */}
        <title>{t('pages:page-title-achievements-full')}</title>
      </Head>
      <Container maxWidth={false} className={clsx(classes.background)}>
        <Header pageTitle={t('pages:page-achievements')} />

        <div className={classes.pageBody}>
          <AchievementsTabOptions
            displayed={showOptions}
            handleClickBack={() => setShowOptions(false)}
          />
          <AchievementsTabList
            displayed={!showOptions && selectedCategory != null}
            handleClickCard={handleClickCard}
            selectedCategory={selectedCategory}
            handleClickOptions={() => setShowOptions(true)}
          />
          <AchievementsTabCategories
            displayed={!showOptions && selectedCategory == null}
            handleClickCard={handleClickCard}
            selectedCategory={selectedCategory}
            handleClickOptions={() => setShowOptions(true)}
          />
        </div>

        <div className={classes.pageFooter}>
          <Typography className={classes.subtitle}>
            {f('version-format', { version: getApplicationVersion() })}
          </Typography>
        </div>
      </Container>
    </>
  );
};

export default AchievementPage;
