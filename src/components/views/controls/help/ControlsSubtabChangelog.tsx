/**
 * Provides the view which displays the Help > Changelog tab of the map controls.
 */

import { List, ListItem, Typography, ListItemText, Collapse, makeStyles } from '@material-ui/core';
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import React, { memo, useState } from 'react';
import { connect } from 'react-redux';

import { getMarkerCount } from '~/components/data/MapFeatures';
import { getRouteCount } from '~/components/data/MapRoutes';
import { getChangelogData } from '~/components/i18n/ChangelogLocalization';
import { t, f } from '~/components/i18n/Localization';
import BorderBox from '~/components/interface/BorderBox';
import { TabView } from '~/components/interface/Tabs';
import { SafeHTML } from '~/components/util';

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

const ControlsSubtabChangelogVersion = ({ version, date, description }) => {
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

const _ControlsSubtabChangelog = ({ displayed, lang }) => {
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

const mapStateToProps = ({ options: { overrideLang: lang } }) => ({
  lang,
});
const mapDispatchToProps = () => ({});
const ControlsSubtabChangelog = connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(_ControlsSubtabChangelog));

export default ControlsSubtabChangelog;
