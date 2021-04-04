/**
 * Provides the interface for the language selector
 * in the Options tab of the map controls.
 */

import { makeStyles, MenuItem, Select, Typography } from '@material-ui/core';
import { SelectInputProps } from '@material-ui/core/Select/SelectInput';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import Flag from 'react-world-flags';

import { getLanguageOptions } from 'src/components/i18n/FeatureLocalization';
import { getShortLocale, t } from 'src/components/i18n/Localization';
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

/**
 * Renders the current value of the Language.
 * @param {*} value The locale code.
 * @param {*} label The locale name.
 * @param {*} context 'menu' or 'value'
 * @param {*} inputValue
 * @param {*} selectValue
 */
const FormatFlag = ({ value }: { value: string }) => {
  const classes = useStyles();

  // Flag overrides.
  let flagCode = value;
  switch (flagCode) {
    case 'en':
      // 'en' should display the United States flag.
      flagCode = 'us';
      break;
    case 'ko':
      // 'ko' should display the South Korean flag.
      flagCode = 'kr';
      break;
    case 'zh':
      // 'zh' should display the Chinese flag.
      flagCode = 'cn';
      break;
    default:
      // No override.
      break;
  }

  return <Flag code={flagCode} height={16} width={30} className={classes.flag} />;
};

const mapStateToProps = (state: AppState) => ({
  overrideLang: selectOverrideLang(state),
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  setOverrideLang: (lang: string) => dispatch(setOverrideLang(lang)),
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

  const langOptions = getLanguageOptions();
  const currentLangCode = overrideLang !== null ? overrideLang : getShortLocale();

  const onLangChange: SelectInputProps['onChange'] = (event) => {
    if (typeof event.target.value === 'string') setOverrideLang(event.target.value);
  };

  return (
    <BorderBox grow={false} direction="row" alignItems="center">
      <Typography className={classes.label}>{t('language')}</Typography>
      <Select value={currentLangCode} onChange={onLangChange}>
        {langOptions.map((lang) => (
          <MenuItem key={lang.value} value={lang.value}>
            <FormatFlag value={lang.value} />
            {lang.label}
          </MenuItem>
        ))}
      </Select>
    </BorderBox>
  );
};

const ControlsOptionsLanguage = connector(_ControlsOptionsLanguage);

export default ControlsOptionsLanguage;
