/**
 * Rather than crashing the full page, this component will cause
 * only the Editor view to break, while still including an error reporter.
 */

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  makeStyles,
  Collapse,
  IconButton,
} from '@material-ui/core';
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import React from 'react';
import { f, t } from '~/components/i18n/Localization';
import { Image } from '~/components/interface/Image';
import { applySourcemapToStackTrace, openURLInWindow } from '~/components/Util';
import { generateReportURL } from '~/components/views/error/ErrorReport';

const iconPNG = require('../../../images/brainjuice.png').default;
const iconWEBP = require('../../../images/brainjuice.webp').default;

const useStyles = makeStyles((_theme) => ({
  icon: {
    width: '100%',
    height: 'auto',
  },
  title: {
    fontSize: '1.5em',
    fontWeight: 400,
  },
  subtitle: {
    fontSize: '1.25em',
    fontWeight: 400,
  },
  instruction: {
    fontSize: '1.25em',
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

/**
 * Rather than crashing the whole page, we can gracefully display a crash reporter for only part of it.
 *
 * @param {*} componentKey The localization key of the component that broke.
 */
const ComponentErrorHandler = (componentKey) => ({ error, errorInfo }) => {
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
      <Grid container spacing={3} padding={2}>
        <Grid item xs={3} align="center">
          <Image srcPNG={iconPNG} srcWebP={iconWEBP} className={classes.icon} />
        </Grid>
        <Grid item xs={9} alignItems="center" style={{ display: 'flex' }}>
          <Typography variant="h1" className={classes.title}>
            {t('error-handler-flavor')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className={classes.subtitle}>
            {f('error-handler-component-message', { component: t(componentKey) })}
          </Typography>
          <Typography className={classes.instruction}>{t('error-handler-instruction')}</Typography>
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
    </>
  );
};

export default ComponentErrorHandler;
