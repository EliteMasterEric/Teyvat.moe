import { Typography, CardContent, Card, Grid, Container, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import Head from 'next/head';
import Link from 'next/link';
import React, { FunctionComponent } from 'react';
import { f, t } from 'src/components/i18n/Localization';
import { NextImage } from 'src/components/interface/Image';
import { getApplicationVersion } from 'src/components/util';

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: theme.palette.primary.dark,
    height: '100vh',
    color: '#FFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  homeHeader: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeFooter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
  },

  logo: {
    margin: '0 8px 0 0',
  },

  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },

  pageButtonText: {
    textAlign: 'center',
  },

  pageButtonLink: {
    cursor: 'pointer',
  },
}));

const HomePage: FunctionComponent = () => {
  const classes = useStyles();

  return (
    <>
      <Head>
        {/* The title of the webpage as displayed in the tab name. */}
        <title>{t('pages:page-title')}</title>
      </Head>
      <Container maxWidth={false} className={clsx(classes.background)}>
        <div className={classes.homeHeader}>
          {/* Use a bare PNG image. No weird WEBP handling should prevent rendering this. */}
          <NextImage
            priority
            src={'/images/logo.png'}
            width={80}
            height={80}
            className={classes.logo}
            alt={t('pages:page-title')}
          />
          <Typography variant="h3">{t('pages:page-title')}</Typography>
        </div>
        <div className={classes.homeBody}>
          <Grid container justify="center" spacing={2}>
            <Grid item xs={4} style={{ display: 'none' }}>
              <Link href="/achievements">
                <Card className={classes.pageButtonLink}>
                  <CardContent>
                    <Typography variant="h2" className={classes.pageButtonText}>
                      {t('pages:page-achievements')}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
            <Grid item xs={4}>
              <Link href="/map">
                <Card className={classes.pageButtonLink}>
                  <CardContent>
                    <Typography variant="h2" className={classes.pageButtonText}>
                      {t('pages:page-map')}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          </Grid>
        </div>
        <div className={classes.homeFooter}>
          <Typography className={classes.subtitle}>
            {f('version-format', { version: getApplicationVersion() })}
          </Typography>
        </div>
      </Container>
    </>
  );
};

export default HomePage;
