import dynamic from 'next/dynamic';
import React, { FunctionComponent } from 'react';

import Controls from 'src/components/views/controls/Controls';
import FullScreenLoading from 'src/components/views/loading/FullScreenLoading';
import PermalinkHandler from 'src/components/views/PermalinkHandler';

const MainView: FunctionComponent = () => {
  /**
   * This prevents the LeafletMap from being rendered by the SSR engine.
   * Important because Node can't handle Leaflet.
   */

  const LeafletMap = dynamic(() => import('src/components/views/map/LeafletMap'), {
    loading: () => <FullScreenLoading />,
    ssr: false,
  });
  return (
    <>
      {/*
       */}
      <LeafletMap />
      <Controls />
      <PermalinkHandler />
    </>
  );
};

export default MainView;

/*
  import FullScreenLoading from 'src/components/views/loading/FullScreenLoading';
  <FullScreenLoading />
*/
