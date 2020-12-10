import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';

import { t } from '../../../Localization';
import { SafeHTML } from '../../../Util';
import { useImageExtension } from '../../../Image';
import MapControlSummaryProgressBar from '../summary/MapControlsSummaryProgressBar';

const _MapControlsHelp = ({ displayed }) => {
  const ext = useImageExtension();

  const [progress, setProgress] = React.useState(-1);

  return (
    <div
      className={clsx(
        'map-controls-about-help-container',
        `map-controls-about-help-container-${ext}`,
        displayed ? '' : 'display-none'
      )}
    >
      <SafeHTML className={clsx('map-control-about-help-content')}>
        {t('map-about-smart-route-content')}
      </SafeHTML>
      <MapControlSummaryProgressBar width={12} percentage={progress} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  displayed: state.controlsTab === 'help' && !state.editorEnabled,
});
const mapDispatchToProps = (_dispatch) => ({});
const MapControlsHelp = connect(mapStateToProps, mapDispatchToProps)(React.memo(_MapControlsHelp));

export default MapControlsHelp;
