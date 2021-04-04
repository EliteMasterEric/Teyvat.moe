import dynamic from 'next/dynamic';
import React, { FunctionComponent } from 'react';

import FullScreenLoading from 'src/components/views/loading/FullScreenLoading';
import PermalinkHandler from 'src/components/views/PermalinkHandler';

const Controls = dynamic(
  () =>
    import(
      /* webpackChunkName: "gm-controls" */
      /* webpackMode: "lazy" */
      'src/components/views/controls/Controls'
    )
);

const MainView: FunctionComponent = () => {
  const LeafletMap = dynamic(
    () =>
      import(
        /* webpackChunkName: "gm-leaflet-map" */
        /* webpackMode: "lazy" */
        'src/components/views/map/LeafletMap'
      ),
    {
      loading: () => <FullScreenLoading />,
      /**
       * This prevents the LeafletMap from being rendered by the SSR engine.
       * Important because Node can't handle Leaflet.
       */
      ssr: false,
    }
  );

  return (
    <>
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
