/**
 * Provides the interface for the language selector
 * in the Options tab of the map controls.
 */

import { makeStyles, MenuItem, Select, Typography } from '@material-ui/core';
import { SelectInputProps } from '@material-ui/core/Select/SelectInput';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { getLanguageOptions } from 'src/components/i18n/FeatureLocalization';
import { getShortLocale, LanguageCode, t } from 'src/components/i18n/Localization';
import { getLanguageFlag } from 'src/components/i18n/Flags';
import BorderBox from 'src/components/interface/BorderBox';
import { AppDispatch } from 'src/components/redux';
import { selectOverrideLang, setOverrideLang } from 'src/components/redux/slices/options';
import { AppState } from 'src/components/redux/types';
import { Empty } from 'src/components/Types';

const useStyles = makeStyles((_theme) => ({
  label: {
    flexGrow: 1,
  },
  flag: {
    margin: '0 8px 0 0',
  },
}));

const mapStateToProps = (state: AppState) => ({
  overrideLang: selectOverrideLang(state),
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setOverrideLang: (lang: LanguageCode) => dispatch(setOverrideLang(lang)),
});
type ControlsOptionsLanguageStateProps = ReturnType<typeof mapStateToProps>;
type ControlsOptionsLanguageDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsOptionsLanguageStateProps,
  ControlsOptionsLanguageDispatchProps,
  Empty,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsOptionsLanguageProps = ConnectedProps<typeof connector>;

const _ControlsOptionsLanguage: FunctionComponent<ControlsOptionsLanguageProps> = ({
  overrideLang,
  setOverrideLang,
}) => {
  const classes = useStyles();

  const currentLangCode = overrideLang !== null ? overrideLang : getShortLocale();
  const langOptions = getLanguageOptions(currentLangCode);

  const onLangChange: SelectInputProps['onChange'] = (event) => {
    const distinguish = (value: any): value is LanguageCode => typeof value === 'string';
    const langCode = event.target.value;
    if (!distinguish(langCode)) return;

    setOverrideLang(langCode);
  };

  return (
    <BorderBox grow={false} direction="row" alignItems="center">
      <Typography className={classes.label}>{t('language')}</Typography>
      <Select value={currentLangCode} onChange={onLangChange}>
        {langOptions.map((lang) => (
          <MenuItem key={lang.value} value={lang.value}>
            <img src={getLanguageFlag(lang.value)} />
            {lang.label}
          </MenuItem>
        ))}
      </Select>
    </BorderBox>
  );
};

const ControlsOptionsLanguage = connector(_ControlsOptionsLanguage);

export default ControlsOptionsLanguage;
