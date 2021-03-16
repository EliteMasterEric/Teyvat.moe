import React, { FunctionComponent } from 'react';

import { getMarkerCount } from '~/components/data/MapFeatures';
import { getRouteCount } from '~/components/data/MapRoutes';
import { f, t } from '~/components/i18n/Localization';
import BorderBox from '~/components/interface/BorderBox';
import { SafeHTML } from '~/components/util';

type ControlsSubtabHelpProps = {
  displayed: boolean;
};

const ControlsSubtabHelp: FunctionComponent<ControlsSubtabHelpProps> = ({ displayed }) => {
  return (
    <BorderBox displayed={displayed} overflow="hidden auto">
      <SafeHTML gutterBottom>
        {f('help-description', {
          markers: getMarkerCount().toString(),
          routes: getRouteCount().toString(),
        })}
      </SafeHTML>
      <SafeHTML gutterBottom>{t('help-migrate')}</SafeHTML>
      <SafeHTML gutterBottom>{t('help-contribute')}</SafeHTML>

      <SafeHTML>{t('help-content')}</SafeHTML>
    </BorderBox>
  );
};

export default ControlsSubtabHelp;
