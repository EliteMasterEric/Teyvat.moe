import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';

import { t } from '../../Localization';
import { SafeHTML } from '../../Util';
import { useImageExtension } from '../../Image';

import './MapControlsHelp.css';

const _MapControlsHelpEditor = ({ displayed }) => {
  const ext = useImageExtension();
  const translatorAttribution = t('about-translator-attribution');

  return (
    <div
      className={clsx(
        'map-controls-about-help-container',
        `map-controls-about-help-container-${ext}`,
        displayed ? '' : 'display-none'
      )}
    >
      <SafeHTML className={clsx('map-control-about-help-header')}>
        {t('about-editor-title')}
      </SafeHTML>
      <SafeHTML className={clsx('map-control-about-help-content')}>{t('about-editor-a')}</SafeHTML>

      <SafeHTML className={clsx('map-control-about-help-content')}>{t('about-editor-b')}</SafeHTML>

      <SafeHTML className={clsx('map-control-about-help-content')}>{t('about-editor-c')}</SafeHTML>

      <SafeHTML className={clsx('map-control-about-help-content')}>{t('about-editor-d')}</SafeHTML>

      <SafeHTML className={clsx('map-control-about-help-content')}>{t('about-editor-e')}</SafeHTML>

      {translatorAttribution !== '' ? (
        <SafeHTML className={clsx('map-control-about-help-content')}>
          {translatorAttribution}
        </SafeHTML>
      ) : null}
    </div>
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
