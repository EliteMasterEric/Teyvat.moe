import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { AppProps } from 'next/app';
import React, { FunctionComponent } from 'react';
import { Provider as StoreProvider } from 'react-redux';

import { store } from 'src/components/redux';
import Theme from 'src/components/Theme';
import ErrorHandler from 'src/components/views/error/ErrorHandler';
import FullPageErrorHandler from 'src/components/views/error/FullPageErrorHandler';
import { NotificationProvider } from 'src/components/views/NotificationProvider';

// Global styles.
// Already imported by react-leaflet-cluster.
// import 'leaflet.markercluster/dist/MarkerCluster.css';
// import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const MyApp: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles != null && jssStyles.parentElement != null) {
      console.log('MATERIAL-UI: Remove server-side injected CSS.');
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      {/* Make the app be the exact page height. */}
      <div style={{ height: '100vh', width: '100vw' }}>
        {/* StoreProvider allows hooks and components to access the Redux store. */}
        <StoreProvider store={store}>
          {/* ThemeProvider allows for child components to access the Material UI theme. */}
          <ThemeProvider theme={Theme}>
            {/* CSSBaseline injects a basic cascading style sheet for use by Material UI styling. */}
            <CssBaseline />
            {/* NotificationProvider handles the Notistack.
              Must be a child of StoreProvider since Redux handles notifications. */}
            <NotificationProvider>
              {/* ErrorHandler provides a fallback interface to use if the web page crashes. */}
              <ErrorHandler errorHandler={FullPageErrorHandler}>
                {/* Component provides the actual map content. */}
                <Component {...pageProps} />
              </ErrorHandler>
            </NotificationProvider>
          </ThemeProvider>
        </StoreProvider>
      </div>
    </>
  );
};

export default MyApp;
