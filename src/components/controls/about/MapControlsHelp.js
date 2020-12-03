import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';

import { t } from '../../Localization';
import { SafeHTML } from '../../Util';
import { useImageExtension } from '../../Image';

import './MapControlsHelp.css';

const _MapControlsHelp = ({ displayed }) => {
  const ext = useImageExtension();
  const translatorAttribution = t('map-about-help-content-translator-attribution');

  return (
    <div
      className={clsx(
        'map-controls-about-help-container',
        `map-controls-about-help-container-${ext}`,
        displayed ? '' : 'display-none'
      )}
    >
      <SafeHTML className={clsx('map-control-about-help-content')}>
        {t('map-about-help-content-a')}
      </SafeHTML>
      <SafeHTML className={clsx('map-control-about-help-content')}>
        {t('map-about-help-content-b')}
      </SafeHTML>
      <SafeHTML className={clsx('map-control-about-help-content')}>
        {t('map-about-help-content-c')}
      </SafeHTML>
      <SafeHTML className={clsx('map-control-about-help-content')}>
        {t('map-about-help-content-d')}
      </SafeHTML>
      <SafeHTML className={clsx('map-control-about-help-content')}>
        {t('map-about-help-content-e')}
      </SafeHTML>
      <SafeHTML className={clsx('map-control-about-help-content')}>
        {t('map-about-help-content-f')}
      </SafeHTML>

      {translatorAttribution !== '' ? (
        <SafeHTML className={clsx('map-control-about-help-content')}>
          {translatorAttribution}
        </SafeHTML>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  displayed: state.controlsTab === 'help' && !state.editorEnabled,
});
const mapDispatchToProps = (_dispatch) => ({});
const MapControlsHelp = connect(mapStateToProps, mapDispatchToProps)(React.memo(_MapControlsHelp));

export default MapControlsHelp;
