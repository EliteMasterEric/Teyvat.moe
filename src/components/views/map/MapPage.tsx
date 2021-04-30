import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { FunctionComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { t } from 'src/components/i18n/Localization';
import { selectFullyLoaded } from 'src/components/redux/slices/map/loading/Selector';
import { AppState } from 'src/components/redux/Types';
import { Empty } from 'src/components/Types';
import FullScreenLoading from 'src/components/views/loading/FullScreenLoading';
import PermalinkHandler from 'src/components/views/map/PermalinkHandler';

const Controls = dynamic(
  () =>
    import(
      /* webpackChunkName: "gm-controls" */
      /* webpackMode: "lazy" */
      'src/components/views/map/controls/Controls'
    )
);

const mapStateToProps = (state: AppState) => {
  return {
    fullyLoaded: selectFullyLoaded(state),
  };
};
type MapPageStateProps = ReturnType<typeof mapStateToProps>;
const connector = connect<MapPageStateProps, Empty, Empty, AppState>(mapStateToProps);

type MapPageProps = ConnectedProps<typeof connector>;

const LeafletMap = dynamic(
  () =>
    import(
      /* webpackChunkName: "gm-leaflet-map" */
      /* webpackMode: "lazy" */
      'src/components/views/map/leaflet/LeafletMap'
    ),
  {
    /**
     * This prevents the LeafletMap from being rendered by the SSR engine.
     * Important because Node can't handle Leaflet.
     */
    ssr: false,
    loading: () => <div>Loading LeafletMap...</div>,
  }
);

const _MapPage: FunctionComponent<MapPageProps> = ({ fullyLoaded }) => {
  return (
    <>
      <Head>
        {/* The title of the webpage as displayed in the tab name. */}
        <title>{t('pages:page-title-map-full')}</title>
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
