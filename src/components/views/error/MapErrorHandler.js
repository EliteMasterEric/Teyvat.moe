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
const MapErrorHandler = ({ error, errorInfo }) => {
  // Note: react-error-overlay will display over this in development.
  // Press 'ESC' to hide it.

  return <>Error</>;
};

export default MapErrorHandler;
