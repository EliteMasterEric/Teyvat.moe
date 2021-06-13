/**
 * Provides the interface for the language selector
 * in the Options tab of the map controls.
 */

import { MenuItem, Select, Typography } from '@material-ui/core';
import { SelectInputProps } from '@material-ui/core/Select/SelectInput';
import { makeStyles } from '@material-ui/styles';
import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { getLanguageFlag } from 'src/components/i18n/Flags';
import { getShortLocale, LanguageCode, t } from 'src/components/i18n/Localization';
import { getLanguageOptions } from 'src/components/i18n/map/FeatureLocalization';
import BorderBox from 'src/components/interface/BorderBox';
import { setOverrideLang } from 'src/components/redux/slices/map/options/Actions';
import { selectOverrideLang } from 'src/components/redux/slices/map/options/Selector';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';

const useStyles = makeStyles((_theme) => ({
  label: {
    flexGrow: 1,
  },
  flag: {
    width: 24,
    margin: '0 8px 0 0',
  },
}));

const mapStateToProps = (state: AppState) => ({
  overrideLang: selectOverrideLang(state),
});
const mapDispatchToProps = {
  setOverrideLang,
};
type ControlsOptionsLanguageStateProps = ReturnType<typeof mapStateToProps>;
type ControlsOptionsLanguageDispatchProps = typeof mapDispatchToProps;
const connector = connect<
  ControlsOptionsLanguageStateProps,
  ControlsOptionsLanguageDispatchProps,
  Empty,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsOptionsLanguageProps = ConnectedProps<typeof connector>;

const distinguishLanguageCode = (value: any): value is LanguageCode => _.isString(value);

const _ControlsOptionsLanguage: FunctionComponent<ControlsOptionsLanguageProps> = ({
  overrideLang,
  setOverrideLang,
}) => {
  const classes = useStyles();

  const currentLangCode = overrideLang !== null ? overrideLang : getShortLocale();
  const langOptions = getLanguageOptions(currentLangCode);

  const onLangChange: SelectInputProps['onChange'] = (event) => {
    const langCode = event.target.value;
    if (!distinguishLanguageCode(langCode)) return;

    setOverrideLang(langCode);
  };

  return (
    <BorderBox grow={false} direction="row" alignItems="center">
      <Typography className={classes.label}>{t('language')}</Typography>
      <Select value={currentLangCode} onChange={onLangChange}>
        {_.map(langOptions, (lang) => (
          <MenuItem key={lang.value} value={lang.value}>
            <img className={classes.flag} src={getLanguageFlag(lang.value)} />
            {lang.label}
          </MenuItem>
        ))}
      </Select>
    </BorderBox>
  );
};

const ControlsOptionsLanguage = connector(_ControlsOptionsLanguage);

export default ControlsOptionsLanguage;
