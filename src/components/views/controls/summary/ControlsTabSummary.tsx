/**
 * Provides the view which displays the About > Summary tab of the map controls.
 */

import { makeStyles, Typography } from '@material-ui/core';
import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { t } from '~/components/i18n/Localization';
import BorderBox from '~/components/interface/BorderBox';
import { selectDisplayedFeatures } from '~/components/redux/slices/displayed';
import { selectIsTabDisplayed } from '~/components/redux/slices/ui';
import { AppState } from '~/components/redux/types';
import ControlsSummaryFeature from '~/components/views/controls/summary/ControlsSummaryFeature';

const useStyles = makeStyles((_theme) => ({
  header: {
    fontSize: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
  },
}));

const mapStateToProps = (state: AppState) => ({
  displayedFeatures: selectDisplayedFeatures(state),
  displayed: selectIsTabDisplayed(state, 'summary'),
});
const mapDispatchToProps = () => ({});
const connector = connect(mapStateToProps, mapDispatchToProps);

type ControlsTabSummaryProps = ConnectedProps<typeof connector>;

/**
 * Displays features which are both:
 * A) Currently visible on the map, and
 * B) Have at least one feature marked as completed.
 */

const _ControlsTabSummary: FunctionComponent<ControlsTabSummaryProps> = ({
  displayed,
  displayedFeatures,
}) => {
  const classes = useStyles();

  return (
    <BorderBox displayed={displayed}>
      <Typography className={classes.header}>{t('summary')}</Typography>
      <Typography className={classes.subtitle}>{t('summary-subtitle')}</Typography>
      {displayedFeatures.map((featureKey) => (
        <ControlsSummaryFeature key={featureKey} featureKey={featureKey} />
      ))}
    </BorderBox>
  );
};

const ControlsTabSummary = connector(_ControlsTabSummary);

export default ControlsTabSummary;
