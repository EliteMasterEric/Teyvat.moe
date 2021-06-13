/**
 * Provides the view which displays the Help > Changelog tab of the map controls.
 */

import { List, ListItem, Typography, ListItemText, Collapse, makeStyles } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import _ from 'lodash';
import React, { FunctionComponent, memo, useMemo, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { t, isI18nLoaded, LocalizedSafeHTML } from 'src/components/i18n/Localization';
import { getChangelogData } from 'src/components/i18n/map/ChangelogLocalization';
import BorderBox from 'src/components/interface/BorderBox';
import {
  selectMapMarkerCount,
  selectMapRouteCount,
} from 'src/components/redux/slices/map/interface/Selector';
import { selectOverrideLang } from 'src/components/redux/slices/map/options/Selector';

import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';

const useStyles = makeStyles((theme) => ({
  subItem: {
    paddingLeft: theme.spacing(2),
  },
  header: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
  },
}));

interface ControlsSubtabChangelogBaseProps {
  displayed?: boolean;
}
const mapStateToProps = (state: AppState) => ({
  lang: selectOverrideLang(state),
  markerCount: selectMapMarkerCount(state),
  routeCount: selectMapRouteCount(state),
});
type ControlsSubtabChangelogStateProps = ReturnType<typeof mapStateToProps>;
const connector = connect<
  ControlsSubtabChangelogStateProps,
  Empty,
  ControlsSubtabChangelogBaseProps,
  AppState
>(mapStateToProps);

type ControlsSubtabChangelogProps = ConnectedProps<typeof connector> &
  ControlsSubtabChangelogBaseProps;

interface ControlsSubtabChangelogVersionProps {
  version: string;
  date: string;
  description: string[];
}

const ControlsSubtabChangelogVersion: FunctionComponent<ControlsSubtabChangelogVersionProps> = memo(
  ({ version, date, description }) => {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const toggleOpen = () => setOpen((value) => !value);

    return (
      <>
        <ListItem disableGutters button onClick={toggleOpen}>
          <ListItemText primary={version} secondary={date} />
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse in={open}>
          <List dense disablePadding>
            {_.map(description, (descriptionLine, index) => (
              <ListItem
                key={`${index}/${descriptionLine}`}
                disableGutters
                className={classes.subItem}
              >
                <ListItemText primary={descriptionLine} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </>
    );
  }
);

const _ControlsSubtabChangelog: FunctionComponent<ControlsSubtabChangelogProps> = ({
  displayed = false,
  markerCount,
  routeCount,
}) => {
  const changelogData = useMemo(() => getChangelogData(), [isI18nLoaded()]);

  const classes = useStyles();

  return (
    <BorderBox direction="column" overflow="hidden auto" displayed={displayed}>
      <LocalizedSafeHTML
        gutterBottom
        i18nKey="map-ui:help-description"
        values={{
          markers: (markerCount ?? '#').toString(),
          routes: (routeCount ?? '#').toString(),
        }}
      />
      <LocalizedSafeHTML i18nKey="map-ui:help-migrate" gutterBottom />
      <LocalizedSafeHTML i18nKey="map-ui:help-contribute" gutterBottom />

      {/* Quit if data couldn't be retrieved. */}
      {changelogData != null ? (
        <>
          <Typography className={classes.header}>{t('changelog')}</Typography>
          <List dense disablePadding>
            {_.map(changelogData, ({ version, date, description }) => (
              <ControlsSubtabChangelogVersion
                key={version}
                version={version}
                date={date}
                description={description}
              />
            ))}
          </List>
        </>
      ) : (
        <Typography className={classes.header}>
          {t('map-ui:no-changelog-data-for-locale')}
        </Typography>
      )}
    </BorderBox>
  );
};

const ControlsSubtabChangelog = connector(memo(_ControlsSubtabChangelog));

export default ControlsSubtabChangelog;
