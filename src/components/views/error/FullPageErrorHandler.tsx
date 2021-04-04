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
  makeStyles,
  Collapse,
  IconButton,
} from '@material-ui/core';
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';

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

  const untranslatedStack = (errorInfo?.componentStack ?? '').trim();

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
        <title>{t('meta-page-title-full')}</title>
      </Head>
      <div className={classes.root}>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} alignContent="center">
              <NextImage
                src="/images/brainjuice.png"
                layout="intrinsic"
                width={335}
                height={302}
                priority
              />
              <Typography variant="h1" className={classes.title}>
                {t('error-handler-flavor')}
              </Typography>
              <Typography variant="h2" className={classes.subtitle}>
                {t('error-handler-message')}
              </Typography>
              <Typography variant="h3" className={classes.instruction}>
                {t('error-handler-instruction')}
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
                ) : (
                  <CardContent>
                    <Collapse in={errorExpanded}>
                      <pre className={classes.codeBox}>{componentStack}</pre>
                    </Collapse>
                  </CardContent>
                )}

                <CardActions>
                  <Button
                    onClick={onSubmitError}
                    className={classes.submitButton}
                    color="secondary"
                    variant="contained"
                  >
                    {t('error-handler-submit')}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>
    </>
  );
};

export default FullPageErrorHandler;
