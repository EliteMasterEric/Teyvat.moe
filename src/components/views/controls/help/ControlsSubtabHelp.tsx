import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { f, t } from 'src/components/i18n/Localization';
import BorderBox from 'src/components/interface/BorderBox';
import { selectMapMarkerCount, selectMapRouteCount } from 'src/components/redux/slices/Interface';
import { selectOverrideLang } from 'src/components/redux/slices/Options';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';
import { SafeHTML } from 'src/components/util';

interface ControlsSubtabHelpBaseProps {
  displayed: boolean;
}

const mapStateToProps = (state: AppState) => ({
  lang: selectOverrideLang(state),
  markerCount: selectMapMarkerCount(state),
  routeCount: selectMapRouteCount(state),
});
type ControlsSubtabHelpStateProps = ReturnType<typeof mapStateToProps>;
const connector = connect<
  ControlsSubtabHelpStateProps,
  Empty,
  ControlsSubtabHelpBaseProps,
  AppState
>(mapStateToProps);

type ControlsSubtabHelpProps = ConnectedProps<typeof connector> & ControlsSubtabHelpBaseProps;

const _ControlsSubtabHelp: FunctionComponent<ControlsSubtabHelpProps> = ({
  displayed,
  markerCount,
  routeCount,
}) => {
  const counted = markerCount != null && routeCount != null;

  return (
    <BorderBox direction="column" displayed={displayed} overflow="hidden auto">
      <SafeHTML gutterBottom>
        {counted
          ? f('help-description', {
              markers: (markerCount ?? '#').toString(),
              routes: (routeCount ?? '#').toString(),
            })
          : null}
      </SafeHTML>
      <SafeHTML gutterBottom>{t('help-migrate')}</SafeHTML>
      <SafeHTML gutterBottom>{t('help-contribute')}</SafeHTML>

      <SafeHTML>{t('help-content')}</SafeHTML>
    </BorderBox>
  );
};

const ControlsSubtabHelp = connector(_ControlsSubtabHelp);

export default ControlsSubtabHelp;
