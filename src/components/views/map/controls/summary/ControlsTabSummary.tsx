/**
 * Provides the view which displays the About > Summary tab of the map controls.
 */

import { makeStyles } from '@material-ui/styles';
import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { LocalizedTypography } from 'src/components/i18n/Localization';
import BorderBox from 'src/components/interface/BorderBox';
import { selectDisplayedFeatures } from 'src/components/redux/slices/map/displayed/Selector';
import { selectIsTabDisplayed } from 'src/components/redux/slices/map/interface/Selector';
import { selectLoading } from 'src/components/redux/slices/map/loading/Selector';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';
import ControlsSummaryFeature from 'src/components/views/map/controls/summary/ControlsSummaryFeature';

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
  mapDataLoaded:
    selectLoading(state, 'loadMapFeatures') === true &&
    selectLoading(state, 'loadMapRoutes') === true,
  displayed: selectIsTabDisplayed(state, 'summary'),
});
type ControlsTabSummaryStateProps = ReturnType<typeof mapStateToProps>;
const connector = connect<ControlsTabSummaryStateProps, Empty, Empty, AppState>(mapStateToProps);

type ControlsTabSummaryProps = ConnectedProps<typeof connector>;

/**
 * Displays features which are both:
 * A) Currently visible on the map, and
 * B) Have at least one feature marked as completed.
 */

const _ControlsTabSummary: FunctionComponent<ControlsTabSummaryProps> = ({
  displayed,
  mapDataLoaded,
  displayedFeatures,
}) => {
  const classes = useStyles();

  return (
    <BorderBox direction="column" displayed={displayed}>
      <LocalizedTypography className={classes.header} i18nKey="summary" />
      <LocalizedTypography className={classes.subtitle} i18nKey="map-ui:summary-subtitle" />
      {mapDataLoaded &&
        _.map(displayedFeatures, (featureKey) => (
          <ControlsSummaryFeature key={featureKey} featureKey={featureKey} />
        ))}
    </BorderBox>
  );
};

const ControlsTabSummary = connector(_ControlsTabSummary);

export default ControlsTabSummary;
