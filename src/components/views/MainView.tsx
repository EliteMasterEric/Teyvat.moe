import React, { FunctionComponent } from 'react';

import Controls from 'src/components/views/controls/Controls';
import LeafletMap from 'src/components/views/map/LeafletMap';
import PermalinkHandler from 'src/components/views/PermalinkHandler';

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
