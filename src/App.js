import React from 'react';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';

import { ThemeProvider } from '@material-ui/core/styles';

import Theme from '~/components/Theme';

import MainView from '~/components/views/MainView';
import PageHeaders from '~/components/views/PageHeaders';

import store from './redux';

import './App.css';
import './NerdFonts.css';

const App = () => {
  // Uncomment this to clear local storage.
  // require('./components/preferences/Preferences').resetLocalStorage();

  return (
    <ThemeProvider theme={Theme}>
      <HelmetProvider>
        <Provider store={store}>
          <PageHeaders />
          <MainView />
        </Provider>
      </HelmetProvider>
    </ThemeProvider>
  );
};

export default App;
