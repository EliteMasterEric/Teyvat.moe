/**
 * Rather than displaying a corrupted interface or completely unmounting the UI
 * in the event of a major crash, this component will replace the page with
 * an error handler with a "Submit Issue" button that redirects to GitHub.
 */

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
  Collapse,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import _ from 'lodash';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import { t } from 'src/components/i18n/Localization';
import { NextImage } from 'src/components/interface/Image';
import { applySourcemapToStackTrace, openURLInWindow } from 'src/components/util';
import { ErrorHandlerComponent } from 'src/components/views/error/ErrorHandler';
import { generateReportURL } from 'src/components/views/error/ErrorReport';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '32px 0',
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.primary.dark,
    color: '#FFF',
  },
  title: {
    fontSize: '3em',
    fontWeight: 400,
  },
  subtitle: {
    fontSize: '2em',
    fontWeight: 400,
  },
  instruction: {
    fontSize: '2em',
    fontWeight: 400,
  },
  codeBox: {
    padding: '8px',
    borderRadius: '4px',
    backgroundColor: '#eee',
    border: '1px solid #ddd',
    whiteSpace: 'pre-line',
    fontFamily: 'mono',
    margin: 0,
  },
  submitButton: {
    marginLeft: 'auto',
  },
}));

const FullPageErrorHandler: ErrorHandlerComponent = ({ error, errorInfo }) => {
  // Note: react-error-overlay will display over this in development.
  // Press 'ESC' to hide it.

  const classes = useStyles();

  const untranslatedStack = _.trim(errorInfo?.componentStack ?? '');

  const [componentStack, setComponentStack] = useState<string | null>(null);

  const [errorExpanded, setErrorExpanded] = useState<boolean>(false);
  const toggleErrorExpanded = () => setErrorExpanded((value) => !value);

  useEffect(() => {
    const translateStack = async () => {
      if (untranslatedStack !== '') {
        const stack = await applySourcemapToStackTrace(untranslatedStack);
        setComponentStack(stack);
      }
    };
    translateStack();
  }, [untranslatedStack]);

  const onSubmitError = () => {
    if (componentStack != null) {
      openURLInWindow(
        generateReportURL(error?.name ?? 'ERROR', error?.message ?? 'MESSAGE', componentStack)
      );
    }
  };

  return (
    <>
      <Head>
        {/* DISPLAY */}
        {/* The title of the webpage as displayed in the tab name. */}
        <title>{t('pages:page-title-map-full')}</title>
      </Head>
      <div className={classes.root}>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} alignContent="center">
              <Typography variant="h2" className={classes.subtitle}>
                {t('error:error-handler-message')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title={`${error?.name ?? 'ERROR'}: ${error?.message ?? 'MESSAGE'}`}
                  action={
                    <IconButton aria-label="settings" onClick={toggleErrorExpanded}>
                      {errorExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  }
                />
                {componentStack !== '' ? (
                  <CardContent>
                    <Collapse in={errorExpanded}>
                      <pre className={classes.codeBox}>{componentStack}</pre>
                    </Collapse>
                  </CardContent>
                ) : null}

                {/*
                <CardActions>
                  <Button
                    onClick={onSubmitError}
                    className={classes.submitButton}
                    color="secondary"
                    variant="contained"
                  >
                    {t('map-ui:submit-to-github')}
                  </Button>
                </CardActions>
                */}
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default FullPageErrorHandler;
