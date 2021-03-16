/**
 * Provides the view which displays the editor Help tab of the map controls.
 */

import React, { memo, FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { t } from '~/components/i18n/Localization';
import BorderBox from '~/components/interface/BorderBox';
import { AppDispatch } from '~/components/redux';
import { selectEditorEnabled, selectIsTabDisplayed } from '~/components/redux/slices/ui';
import { AppState } from '~/components/redux/types';
import { SafeHTML } from '~/components/util';

const mapStateToProps = (state: AppState) => ({
  displayed: selectIsTabDisplayed(state, 'help') && selectEditorEnabled(state),
});
const mapDispatchToProps = () => ({});
const connector = connect(mapStateToProps, mapDispatchToProps);

type ControlsTabHelpEditorProps = ConnectedProps<typeof connector>;

const _ControlsTabHelpEditor: FunctionComponent<ControlsTabHelpEditorProps> = ({ displayed }) => {
  return (
    <BorderBox displayed={displayed} overflow="hidden auto">
      <SafeHTML>{t('help-editor-content')}</SafeHTML>
    </BorderBox>
  );
};

const ControlsTabHelpEditor = connector(memo(_ControlsTabHelpEditor));

export default ControlsTabHelpEditor;
