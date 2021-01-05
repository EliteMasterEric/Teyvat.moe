import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';

import Theme from '~/components/Theme';
import ErrorHandler from '~/components/views/error/ErrorHandler';
import FullPageErrorHandler from '~/components/views/error/FullPageErrorHandler';
import MainView from '~/components/views/MainView';
import PageHeaders from '~/components/views/PageHeaders';
import store from '~/redux';

import './NerdFonts.css';

const App = () => {
  return (
    <ThemeProvider theme={Theme}>
      <HelmetProvider>
        <CssBaseline>
          <ErrorHandler errorHandler={FullPageErrorHandler}>
            <Provider store={store}>
              <PageHeaders />
              <MainView />
            </Provider>
          </ErrorHandler>
        </CssBaseline>
      </HelmetProvider>
    </ThemeProvider>
  );
};

export default App;
