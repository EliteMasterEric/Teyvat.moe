/**
 * Provides the view which displays the Help > Changelog tab of the map controls.
 */

import { List, ListItem, Typography, ListItemText, Collapse, makeStyles } from '@material-ui/core';
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import React, { FunctionComponent, memo, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { getMarkerCount } from 'src/components/data/MapFeatures';
import { getRouteCount } from 'src/components/data/MapRoutes';
import { getChangelogData } from 'src/components/i18n/ChangelogLocalization';
import { t, f } from 'src/components/i18n/Localization';
import BorderBox from 'src/components/interface/BorderBox';
import { TabView } from 'src/components/interface/Tabs';
import { selectOverrideLang } from 'src/components/redux/slices/options';
import { AppState } from 'src/components/redux/types';
import { SafeHTML } from 'src/components/util';

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
});
const mapDispatchToProps = () => ({});
type ControlsSubtabChangelogStateProps = ReturnType<typeof mapStateToProps>;
type ControlsSubtabChangelogDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsSubtabChangelogStateProps,
  ControlsSubtabChangelogDispatchProps,
  ControlsSubtabChangelogBaseProps,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsSubtabChangelogProps = ConnectedProps<typeof connector> &
  ControlsSubtabChangelogBaseProps;

interface ControlsSubtabChangelogVersionProps {
  version: string;
  date: string;
  description: string[];
}

const ControlsSubtabChangelogVersion: FunctionComponent<ControlsSubtabChangelogVersionProps> = ({
  version,
  date,
  description,
}) => {
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
          {description.map((descriptionLine) => (
            <ListItem key={descriptionLine} disableGutters className={classes.subItem}>
              <ListItemText primary={descriptionLine} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
};

const _ControlsSubtabChangelog: FunctionComponent<ControlsSubtabChangelogProps> = ({
  displayed = false,
  lang,
}) => {
  const changelogData = getChangelogData(lang);

  const classes = useStyles();

  return (
    <TabView displayed={displayed}>
      <BorderBox overflow="hidden auto">
        <SafeHTML gutterBottom>
          {f('help-description', {
            markers: getMarkerCount().toString(),
            routes: getRouteCount().toString(),
          })}
        </SafeHTML>
        <SafeHTML gutterBottom>{t('help-migrate')}</SafeHTML>
        <SafeHTML gutterBottom>{t('help-contribute')}</SafeHTML>

        {/* Quit if data couldn't be retrieved. */}
        {changelogData != null ? (
          <>
            <Typography className={classes.header}>{t('changelog')}</Typography>
            <List dense disablePadding>
              {changelogData.map(({ version, date, description }) => (
                <ControlsSubtabChangelogVersion
                  key={version}
                  version={version}
                  date={date}
                  description={description}
                />
              ))}
            </List>
          </>
        ) : null}
      </BorderBox>
    </TabView>
  );
};

const ControlsSubtabChangelog = connector(memo(_ControlsSubtabChangelog));

export default ControlsSubtabChangelog;
