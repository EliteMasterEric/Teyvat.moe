/**
 * Provides the view which displays the About > Help tab of the map controls.
 */

import React from 'react';
import { connect } from 'react-redux';

import { t } from '~/components/i18n/Localization';
import BorderBox from '~/components/interface/BorderBox';
import { SafeHTML } from '~/components/Util';

const _MapControlsHelp = ({ displayed }) => {
  return (
    <BorderBox displayed={displayed}>
      <SafeHTML>{t('map-about-help-content-a')}</SafeHTML>
      <SafeHTML>{t('map-about-help-content-b')}</SafeHTML>
      <SafeHTML>{t('map-about-help-content-c')}</SafeHTML>
      <SafeHTML>{t('map-about-help-content-d')}</SafeHTML>
      <SafeHTML>{t('map-about-help-content-e')}</SafeHTML>
      <SafeHTML>{t('map-about-help-content-f')}</SafeHTML>
    </BorderBox>
  );
};

const mapStateToProps = (state) => ({
  displayed: state.controlsTab === 'help' && !state.editorEnabled,
});
const mapDispatchToProps = (_dispatch) => ({});
const MapControlsHelp = connect(mapStateToProps, mapDispatchToProps)(React.memo(_MapControlsHelp));

export default MapControlsHelp;
