/**
 * Provides the view which displays the Help > Changelog tab of the map controls.
 */

import { List, ListItem, Typography, ListItemText, Collapse, makeStyles } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import _ from 'lodash';
import React, { FunctionComponent, memo, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ChangelogData } from 'src/components/data/ChangelogSchema';

import { getChangelogData } from 'src/components/i18n/ChangelogLocalization';
import { t, f, LanguageCode } from 'src/components/i18n/Localization';
import BorderBox from 'src/components/interface/BorderBox';
import { selectMapMarkerCount, selectMapRouteCount } from 'src/components/redux/slices/Interface';
import { selectOverrideLang } from 'src/components/redux/slices/Options';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';
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
          {_.map(description, (descriptionLine) => (
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
        <Typography className={classes.header}>{t('no-changelog-data-for-locale')}</Typography>
      )}
    </BorderBox>
  );
};

const ControlsSubtabChangelog = connector(memo(_ControlsSubtabChangelog));

export default ControlsSubtabChangelog;
