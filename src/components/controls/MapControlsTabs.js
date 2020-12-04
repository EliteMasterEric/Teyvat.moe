import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';

import { t } from '../Localization';
import { setControlsTab } from '../../redux/ducks/ui';

const _MapControlsTabs = ({ editorEnabled, tab, setTab, displayed }) => {
  return (
    <div className={clsx('map-controls-tab-container', displayed ? '' : 'display-none')}>
      <div
        onClick={() => setTab('help')}
        onKeyDown={() => setTab('help')}
        role="button"
        aria-label={t('map-controls-tab-about')}
        tabIndex={0}
        className={clsx(
          'map-controls-tab',
          tab === 'help' || tab === 'summary' ? 'map-controls-tab-active' : '',
          'noselect',
          !editorEnabled ? '' : 'display-none'
        )}
      >
        {t('map-controls-tab-about')}
      </div>
      <div
        onClick={() => setTab('help')}
        onKeyDown={() => setTab('help')}
        role="button"
        aria-label={t('map-controls-tab-editor-help')}
        tabIndex={0}
        className={clsx(
          'map-controls-tab',
          tab === 'help' ? 'map-controls-tab-active' : '',
          'noselect',
          editorEnabled ? '' : 'display-none'
        )}
      >
        {t('map-controls-tab-editor-help')}
      </div>
      <div
        onClick={() => setTab('features')}
        onKeyDown={() => setTab('features')}
        role="button"
        aria-label={t('map-controls-tab-features')}
        tabIndex={0}
        className={clsx(
          'map-controls-tab',
          tab === 'features' ? 'map-controls-tab-active' : '',
          'noselect',
          editorEnabled ? 'display-none' : ''
        )}
      >
        {t('map-controls-tab-features')}
      </div>
      <div
        onClick={() => setTab('routes')}
        onKeyDown={() => setTab('routes')}
        role="button"
        aria-label={t('map-controls-tab-routes')}
        tabIndex={0}
        className={clsx(
          'map-controls-tab',
          tab === 'routes' ? 'map-controls-tab-active' : '',
          'noselect',
          editorEnabled ? 'display-none' : ''
        )}
      >
        {t('map-controls-tab-routes')}
      </div>
      <div
        onClick={() => setTab('elements')}
        onKeyDown={() => setTab('elements')}
        role="button"
        aria-label={t('map-controls-tab-editor-elements')}
        tabIndex={0}
        className={clsx(
          'map-controls-tab',
          tab === 'elements' ? 'map-controls-tab-active' : '',
          'noselect',
          editorEnabled ? '' : 'display-none'
        )}
      >
        {t('map-controls-tab-editor-elements')}
      </div>
      <div
        onClick={() => setTab('options')}
        onKeyDown={() => setTab('options')}
        role="button"
        aria-label={t('map-controls-tab-options')}
        tabIndex={0}
        className={clsx(
          'map-controls-tab',
          tab === 'options' ? 'map-controls-tab-active' : '',
          'noselect'
        )}
      >
        {t('map-controls-tab-options')}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  displayed: true,
  editorEnabled: state.editorEnabled,
  tab: state.controlsTab,
});
const mapDispatchToProps = (dispatch) => ({
  setTab: (tab) => dispatch(setControlsTab(tab)),
});
const MapControlsTabs = connect(mapStateToProps, mapDispatchToProps)(_MapControlsTabs);

export default MapControlsTabs;
