/**
 * Provides the view which displays the Help > Changelog tab of the map controls.
 */

import { List, ListItem, Typography, ListItemText, Collapse, makeStyles } from '@material-ui/core';
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import React, { FunctionComponent, memo, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ChangelogData } from 'src/components/data/ChangelogSchema';

import { getChangelogData } from 'src/components/i18n/ChangelogLocalization';
import { t, f, LanguageCode } from 'src/components/i18n/Localization';
import BorderBox from 'src/components/interface/BorderBox';
import { TabView } from 'src/components/interface/Tabs';
import { selectOverrideLang } from 'src/components/redux/slices/options';
import { selectMapMarkerCount, selectMapRouteCount } from 'src/components/redux/slices/ui';
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
  markerCount: selectMapMarkerCount(state),
  routeCount: selectMapRouteCount(state),
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
  markerCount,
  routeCount,
}) => {
  const [changelogData, setChangelogData] = useState<ChangelogData | null>(null);

  // Perform an asynchronous operation to fetch the changelog data,
  // for the appropriate language.
  useEffect(() => {
    const loadChangelogData = async (langCode: LanguageCode | null) => {
      const data = await getChangelogData(langCode);
      setChangelogData(data);
    };
    loadChangelogData(lang);
  }, [lang]);

  const classes = useStyles();

  return (
    <BorderBox overflow="hidden auto" displayed={displayed}>
      <SafeHTML gutterBottom>
        {f('help-description', {
          markers: (markerCount ?? '#').toString(),
          routes: (routeCount ?? '#').toString(),
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
      ) : (
        <Typography className={classes.header}>{t('no-changelog-data-for-locale')}</Typography>
      )}
    </BorderBox>
  );
};

const ControlsSubtabChangelog = connector(memo(_ControlsSubtabChangelog));

export default ControlsSubtabChangelog;
