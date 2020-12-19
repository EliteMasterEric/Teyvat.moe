/**
 * Powers the tab view in the About tab of the Map controls.
 */

import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';

import { t } from '~/components/i18n/Localization';
import { useImageExtension } from '~/components/interface/Image';
import { setControlsTab } from '~/redux/ducks/ui';

import './MapControlsAboutTabs.css';

const _MapControlsAboutTabs = ({ tab, displayed, setTab }) => {
  const ext = useImageExtension();

  return (
    <div
      className={clsx(
        'map-controls-about-tab-container',
        `map-controls-about-tab-container-${ext}`,
        displayed ? '' : 'display-none'
      )}
    >
      <div
        onClick={() => setTab('help')}
        onKeyDown={() => setTab('help')}
        role="button"
        aria-label={t('map-controls-tab-help')}
        tabIndex={0}
        className={clsx(
          'map-controls-about-tab',
          tab === 'help' ? 'map-controls-about-tab-active' : '',
          'noselect'
        )}
      >
        {t('map-controls-tab-help')}
      </div>
      <div
        onClick={() => setTab('summary')}
        onKeyDown={() => setTab('summary')}
        role="button"
        aria-label={t('map-controls-tab-summary')}
        tabIndex={0}
        className={clsx(
          'map-controls-about-tab',
          tab === 'summary' ? 'map-controls-about-tab-active' : '',
          'noselect'
        )}
      >
        {t('map-controls-tab-summary')}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  tab: state.controlsTab,
  displayed:
    (state.controlsTab === 'help' || state.controlsTab === 'summary') && !state.editorEnabled,
});
const mapDispatchToProps = (dispatch) => ({ setTab: (tab) => dispatch(setControlsTab(tab)) });
const MapControlsAboutTabs = connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(_MapControlsAboutTabs));

export default MapControlsAboutTabs;
