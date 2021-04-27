import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { LocalizedSafeHTML } from 'src/components/i18n/Localization';
import BorderBox from 'src/components/interface/BorderBox';
import {
  selectMapMarkerCount,
  selectMapRouteCount,
} from 'src/components/redux/slices/map/interface/Selector';
import { selectOverrideLang } from 'src/components/redux/slices/map/options/Selector';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';

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
  return (
    <BorderBox direction="column" displayed={displayed} overflow="hidden auto">
      <LocalizedSafeHTML
        gutterBottom
        i18nKey="map-ui:help-description"
        values={{
          markers: (markerCount ?? '#').toString(),
          routes: (routeCount ?? '#').toString(),
        }}
      />
      <LocalizedSafeHTML i18nKey="map-ui:help-migrate" gutterBottom />
      <LocalizedSafeHTML i18nKey="map-ui:help-contribute" gutterBottom />
      <LocalizedSafeHTML i18nKey="map-ui:help-content" />
    </BorderBox>
  );
};

const ControlsSubtabHelp = connector(_ControlsSubtabHelp);

export default ControlsSubtabHelp;
