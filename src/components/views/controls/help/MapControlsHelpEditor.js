/**
 * Provides the view which displays the editor Help tab of the map controls.
 */

import React from 'react';
import { connect } from 'react-redux';

import { t } from '~/components/i18n/Localization';
import BorderBox from '~/components/interface/BorderBox';
import { SafeHTML } from '~/components/Util';

const _MapControlsHelpEditor = ({ displayed }) => {
  return (
    <BorderBox displayed={displayed} overflow="hidden auto">
      <SafeHTML>{t('help-editor-content')}</SafeHTML>
    </BorderBox>
  );
};

const mapStateToProps = (state) => ({
  displayed: state.controlsTab === 'help' && state.editorEnabled,
});
const mapDispatchToProps = (_dispatch) => ({});
const MapControlsHelpEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(_MapControlsHelpEditor));

export default MapControlsHelpEditor;
