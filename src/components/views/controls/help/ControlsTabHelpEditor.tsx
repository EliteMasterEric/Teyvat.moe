/**
 * Provides the view which displays the editor Help tab of the map controls.
 */

import React, { memo, FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { t } from 'src/components/i18n/Localization';
import BorderBox from 'src/components/interface/BorderBox';
import { selectEditorEnabled, selectIsTabDisplayed } from 'src/components/redux/slices/Interface';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';
import { SafeHTML } from 'src/components/util';

const mapStateToProps = (state: AppState) => ({
  displayed: selectIsTabDisplayed(state, 'help') && selectEditorEnabled(state),
});
type ControlsTabHelpEditorStateProps = ReturnType<typeof mapStateToProps>;
const connector = connect<ControlsTabHelpEditorStateProps, Empty, Empty, AppState>(mapStateToProps);

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
