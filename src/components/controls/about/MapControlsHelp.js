import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';

import { t } from '../../Localization';
import { SafeHTML } from '../../Util';
import { useImageExtension } from '../../Image';

import './MapControlsHelp.css';

const _MapControlsHelp = ({ displayed }) => {
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
      <SafeHTML className={clsx('map-control-about-help-header')}>{t('short-title')}</SafeHTML>
      <SafeHTML className={clsx('map-control-about-help-content')}>{t('about-a')}</SafeHTML>

      <SafeHTML className={clsx('map-control-about-help-content')}>{t('about-b')}</SafeHTML>

      <SafeHTML className={clsx('map-control-about-help-content')}>{t('about-c')}</SafeHTML>

      <SafeHTML className={clsx('map-control-about-help-content')}>{t('about-d')}</SafeHTML>

      <SafeHTML className={clsx('map-control-about-help-content')}>{t('about-e')}</SafeHTML>

      <SafeHTML className={clsx('map-control-about-help-content')}>{t('about-f')}</SafeHTML>

      {translatorAttribution !== '' ? (
        <SafeHTML className={clsx('map-control-about-help-content')}>
          {translatorAttribution}
        </SafeHTML>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => ({ displayed: state.controlsTab === 'help' });
const mapDispatchToProps = (_dispatch) => ({});
const MapControlsHelp = connect(mapStateToProps, mapDispatchToProps)(_MapControlsHelp);

export default MapControlsHelp;
