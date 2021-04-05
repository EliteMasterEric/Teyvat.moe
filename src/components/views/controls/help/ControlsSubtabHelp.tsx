import { connect, ConnectedProps } from 'react-redux';
import React, { FunctionComponent } from 'react';

import { f, t } from 'src/components/i18n/Localization';
import BorderBox from 'src/components/interface/BorderBox';
import { selectOverrideLang } from 'src/components/redux/slices/options';
import { selectMapMarkerCount, selectMapRouteCount } from 'src/components/redux/slices/ui';
import { AppState } from 'src/components/redux/types';
import { SafeHTML } from 'src/components/util';

interface ControlsSubtabHelpBaseProps {
  displayed: boolean;
}

const mapStateToProps = (state: AppState, props: ControlsSubtabHelpBaseProps) => ({
  lang: selectOverrideLang(state),
  markerCount: selectMapMarkerCount(state),
  routeCount: selectMapRouteCount(state),
});
const mapDispatchToProps = () => ({});
type ControlsSubtabHelpStateProps = ReturnType<typeof mapStateToProps>;
type ControlsSubtabHelpDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ControlsSubtabHelpStateProps,
  ControlsSubtabHelpDispatchProps,
  ControlsSubtabHelpBaseProps,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ControlsSubtabHelpProps = ConnectedProps<typeof connector> & ControlsSubtabHelpBaseProps;

const _ControlsSubtabHelp: FunctionComponent<ControlsSubtabHelpProps> = ({
  displayed,
  markerCount,
  routeCount,
}) => {
  return (
    <BorderBox displayed={displayed} overflow="hidden auto">
      <SafeHTML gutterBottom>
        {f('help-description', {
          markers: (markerCount ?? '#').toString(),
          routes: (routeCount ?? '#').toString(),
        })}
      </SafeHTML>
      <SafeHTML gutterBottom>{t('help-migrate')}</SafeHTML>
      <SafeHTML gutterBottom>{t('help-contribute')}</SafeHTML>

      <SafeHTML>{t('help-content')}</SafeHTML>
    </BorderBox>
  );
};

const ControlsSubtabHelp = connector(_ControlsSubtabHelp);

export default ControlsSubtabHelp;
