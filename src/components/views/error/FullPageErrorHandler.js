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
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { t } from '~/components/i18n/Localization';
import { Image } from '~/components/interface/Image';
import { applySourcemapToStackTrace, openURLInWindow } from '~/components/Util';
import { generateReportURL } from '~/components/views/error/ErrorReport';

const iconPNG = require('../../../images/brainjuice.png').default;
const iconWEBP = require('../../../images/brainjuice.webp').default;

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '32px 0',
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.primary.dark,
    color: '#FFF',
  },
  icon: {
    height: '30vh',
    width: 'auto',
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

const FullPageErrorHandler = ({ error, errorInfo }) => {
  // Note: react-error-overlay will display over this in development.
  // Press 'ESC' to hide it.

  const classes = useStyles();

  const untranslatedStack = (errorInfo?.componentStack ?? '').trim();

  const [componentStack, setComponentStack] = React.useState(null);

  const [errorExpanded, setErrorExpanded] = React.useState(false);
  const toggleErrorExpanded = () => setErrorExpanded((value) => !value);

  React.useEffect(async () => {
    if (untranslatedStack !== '') {
      const stack = await applySourcemapToStackTrace(untranslatedStack);
      setComponentStack(stack);
    }
  }, [untranslatedStack]);

  const onSubmitError = () => {
    if (componentStack != null) {
      openURLInWindow(generateReportURL(error.name, error.message, componentStack));
    }
  };

  return (
    <>
      <Helmet>
        {/* DISPLAY */}
        {/* The title of the webpage as displayed in the tab name. */}
        <title>{t('meta-page-title-full')}</title>
      </Helmet>
      <div className={classes.root}>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} align="center">
              <Image srcPNG={iconPNG} srcWebP={iconWEBP} className={classes.icon} />
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
                  title={`${error.name}: ${error.message}`}
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
