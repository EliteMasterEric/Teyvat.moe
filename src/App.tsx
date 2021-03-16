import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import React, { FunctionComponent } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as StoreProvider } from 'react-redux';

import { store } from '~/components/redux';
import Theme from '~/components/Theme';
import ErrorHandler from '~/components/views/error/ErrorHandler';
import FullPageErrorHandler from '~/components/views/error/FullPageErrorHandler';
import MainView from '~/components/views/MainView';
import { NotificationProvider } from '~/components/views/NotificationProvider';
import PageHeaders from '~/components/views/PageHeaders';

const App: FunctionComponent = () => {
  return (
    <>
      {/* StoreProvider allows hooks and components to access the Redux store. */}
      <StoreProvider store={store}>
        {/* ThemeProvider allows for child components to access the Material UI theme. */}
        <ThemeProvider theme={Theme}>
          {/* HelmetProvider allows components to use the <Head> element to add head tag such as page title. */}
          <HelmetProvider>
            {/* CSSBaseline injects a basic cascading style sheet for use by Material UI styling. */}
            <CssBaseline>
              {/* ErrorHandler provides a fallback interface to use if the web page crashes. */}
              <ErrorHandler errorHandler={FullPageErrorHandler}>
                {/* NotificationProvider handles the Notistack.
                    Must be a child of StoreProvider since Redux handles notifications. */}
                <NotificationProvider>
                  {/* PageHeaders uses the HelmetProvider to inject page title, among other attributes. */}
                  <PageHeaders />
                  {/* MainView provides the actual map content. */}
                  <MainView />
                </NotificationProvider>
              </ErrorHandler>
            </CssBaseline>
          </HelmetProvider>
        </ThemeProvider>
      </StoreProvider>
    </>
  );
};

export default App;
