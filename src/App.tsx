import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { FunctionComponent } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as StoreProvider } from 'react-redux';

import { store } from 'src/components/redux';
import Theme from 'src/components/Theme';
import ErrorHandler from 'src/components/views/error/ErrorHandler';
import FullPageErrorHandler from 'src/components/views/error/FullPageErrorHandler';
import MainView from 'src/components/views/MainView';
import { NotificationProvider } from 'src/components/views/NotificationProvider';
import PageHeaders from 'src/components/views/PageHeaders';

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
              {/* NotificationProvider handles the Notistack.
                  Must be a child of StoreProvider since Redux handles notifications. */}
              <NotificationProvider>
                {/* ErrorHandler provides a fallback interface to use if the web page crashes. */}
                <ErrorHandler errorHandler={FullPageErrorHandler}>
                  {/* PageHeaders uses the HelmetProvider to inject page title, among other attributes. */}
                  <PageHeaders />
                  {/* MainView provides the actual map content. */}
                  <MainView />
                </ErrorHandler>
              </NotificationProvider>
            </CssBaseline>
          </HelmetProvider>
        </ThemeProvider>
      </StoreProvider>
    </>
  );
};

export default App;
