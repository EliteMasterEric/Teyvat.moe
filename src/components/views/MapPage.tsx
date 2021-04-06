import Head from 'next/head';
import dynamic from 'next/dynamic';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import FullScreenLoading from 'src/components/views/loading/FullScreenLoading';
import PermalinkHandler from 'src/components/views/PermalinkHandler';
import { selectFullyLoaded } from '../redux/slices/ui';
import { AppState } from '../redux/types';
import { t } from '../i18n/Localization';

const Controls = dynamic(
  () =>
    import(
      /* webpackChunkName: "gm-controls" */
      /* webpackMode: "lazy" */
      'src/components/views/controls/Controls'
    )
);

const mapStateToProps = (state: AppState) => {
  return {
    fullyLoaded: selectFullyLoaded(state),
  };
};
const mapDispatchToProps = () => ({});
type MapPageStateProps = ReturnType<typeof mapStateToProps>;
type MapPageDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<MapPageStateProps, MapPageDispatchProps, {}, AppState>(
  mapStateToProps,
  mapDispatchToProps
);

type MapPageProps = ConnectedProps<typeof connector>;

const _MapPage: FunctionComponent<MapPageProps> = ({ fullyLoaded }) => {
  const LeafletMap = dynamic(
    () =>
      import(
        /* webpackChunkName: "gm-leaflet-map" */
        /* webpackMode: "lazy" */
        'src/components/views/map/LeafletMap'
      ),
    {
      /**
       * This prevents the LeafletMap from being rendered by the SSR engine.
       * Important because Node can't handle Leaflet.
       */
      ssr: false,
    }
  );

  return (
    <>
      <Head>
        {/* The title of the webpage as displayed in the tab name. */}
        <title>{t('page-title-full')}</title>
      </Head>
      <FullScreenLoading displayed={!fullyLoaded} />
      <LeafletMap />
      <Controls />
      <PermalinkHandler />
    </>
  );
};

const MapPage = connector(_MapPage);

export default MapPage;

/*
  import FullScreenLoading from 'src/components/views/loading/FullScreenLoading';
  <FullScreenLoading />
*/
