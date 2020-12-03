import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';

import { t } from '../../Localization';
import { SafeHTML } from '../../Util';
import { useImageExtension } from '../../Image';

import './MapControlsHelp.css';

const _MapControlsHelpEditor = ({ displayed }) => {
  const ext = useImageExtension();

  return (
    <div
      className={clsx(
        'map-controls-about-help-container',
        `map-controls-about-help-container-${ext}`,
        displayed ? '' : 'display-none'
      )}
    >
      <SafeHTML className={clsx('map-control-about-help-content')}>
        {t('map-editor-help-content-a')}
      </SafeHTML>

      <SafeHTML className={clsx('map-control-about-help-content')}>
        {t('map-editor-help-content-b')}
      </SafeHTML>

      <SafeHTML className={clsx('map-control-about-help-content')}>
        {t('map-editor-help-content-c')}
      </SafeHTML>

      <SafeHTML className={clsx('map-control-about-help-content')}>
        {t('map-editor-help-content-d')}
      </SafeHTML>

      <SafeHTML className={clsx('map-control-about-help-content')}>
        {t('map-editor-help-content-e')}
      </SafeHTML>

      <SafeHTML className={clsx('map-control-about-help-content')}>
        {t('map-editor-help-content-f')}
      </SafeHTML>
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
