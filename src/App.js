import React from 'react';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import MainView from './components/views/MainView';

import store from './redux';

import './App.css';
import './NerdFonts.css';
import PageHeaders from './components/views/PageHeaders';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#607d8b',
    },
  },
});

const App = () => {
  // require('./components/preferences/Preferences').resetLocalStorage();

  return (
    <ThemeProvider theme={theme}>
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
