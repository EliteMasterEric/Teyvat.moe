/**
 * Provides the view which displays the editor Help tab of the map controls.
 */

import React, { memo, FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { t } from 'src/components/i18n/Localization';
import BorderBox from 'src/components/interface/BorderBox';
import { selectEditorEnabled, selectIsTabDisplayed } from 'src/components/redux/slices/ui';
import { AppState } from 'src/components/redux/types';
import { Empty } from 'src/components/Types';
import { SafeHTML } from 'src/components/util';

const mapStateToProps = (state: AppState) => ({
  displayed: selectIsTabDisplayed(state, 'help') && selectEditorEnabled(state),
});
const mapDispatchToProps = () => ({});
type ControlsTabHelpEditorStateProps = ReturnType<typeof mapStateToProps>;
type ControlsTabHelpEditorDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsTabHelpEditorStateProps,
  ControlsTabHelpEditorDispatchProps,
  Empty,
  AppState
>(mapStateToProps, mapDispatchToProps);

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
