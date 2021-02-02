/**
 * Provides the view which displays the Help > Changelog tab of the map controls.
 */

import { List, ListItem, Typography, ListItemText, Collapse, makeStyles } from '@material-ui/core';
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import React from 'react';
import { connect } from 'react-redux';
import { getMarkerCount, getRouteCount } from '~/components/data/MapFeatures';
import { getChangelogData } from '~/components/i18n/ChangelogLocalization';

import { t, f } from '~/components/i18n/Localization';
import BorderBox from '~/components/interface/BorderBox';
import { TabView } from '~/components/interface/Tabs';
import { SafeHTML } from '~/components/Util';

const useStyles = makeStyles((theme) => ({
  subItem: {
    paddingLeft: theme.spacing(2),
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
  },
}));

const MapControlsChangelogVersion = ({ version, date, description }) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

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

const _MapControlsChangelog = ({ displayed, lang }) => {
  const changelogData = getChangelogData(lang);

  const classes = useStyles();

  return (
    <TabView displayed={displayed}>
      <BorderBox overflow="hidden auto">
        <SafeHTML gutterBottom>
          {f('map-about-help-content-a', { markers: getMarkerCount(), routes: getRouteCount() })}
        </SafeHTML>

        <SafeHTML gutterBottom>{t('map-about-help-content-b')}</SafeHTML>
        {/* Quit if data couldn't be retrieved. */}
        {changelogData != null ? (
          <>
            <Typography fontWeight="fontWeightBold" className={classes.header}>
              {t('map-controls-tab-changelog')}
            </Typography>
            <List dense disablePadding>
              {changelogData.map(({ version, date, description }) => (
                <MapControlsChangelogVersion
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
const mapDispatchToProps = (_dispatch) => ({});
const MapControlsChangelog = connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(_MapControlsChangelog));

export default MapControlsChangelog;
