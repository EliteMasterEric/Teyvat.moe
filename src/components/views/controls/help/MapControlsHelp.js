/**
 * Provides the view which displays the About > Help tab of the map controls.
 */

import React from 'react';
import { connect } from 'react-redux';
import { getMarkerCount, getRouteCount } from '~/components/data/MapFeatures';

import { t, f } from '~/components/i18n/Localization';
import BorderBox from '~/components/interface/BorderBox';
import { SafeHTML } from '~/components/Util';

const _MapControlsHelp = ({ displayed }) => {
  return (
    <BorderBox displayed={displayed} overflow="hidden auto">
      <SafeHTML gutterBottom>
        {f('map-about-help-content-a', { markers: getMarkerCount(), routes: getRouteCount() })}
      </SafeHTML>
      <SafeHTML gutterBottom>{t('map-about-help-content-b')}</SafeHTML>
      <SafeHTML gutterBottom>{t('map-about-help-content-c')}</SafeHTML>
      <SafeHTML gutterBottom>{t('map-about-help-content-d')}</SafeHTML>
      <SafeHTML gutterBottom>{t('map-about-help-content-e')}</SafeHTML>
      <SafeHTML>{t('map-about-help-content-f')}</SafeHTML>
    </BorderBox>
  );
};

const mapStateToProps = ({ controlsTab, editorEnabled, options: { overrideLang: lang } }) => ({
  displayed: controlsTab === 'help' && !editorEnabled,
  // Adding language to the props, even if it isn't used,
  // causes the component to re-render when the language changes.
  lang,
});
const mapDispatchToProps = (_dispatch) => ({});
const MapControlsHelp = connect(mapStateToProps, mapDispatchToProps)(React.memo(_MapControlsHelp));

export default MapControlsHelp;
