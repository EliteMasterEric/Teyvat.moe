import React, { FunctionComponent } from 'react';

import Controls from '~/components/views/controls/Controls';
import LeafletMap from '~/components/views/map/LeafletMap';
import PermalinkHandler from '~/components/views/PermalinkHandler';

const MainView: FunctionComponent = () => {
  return (
    <>
      <div className="map">
        <LeafletMap />
        <Controls />
        <PermalinkHandler />
      </div>
    </>
  );
};

export default MainView;
