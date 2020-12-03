import React from 'react';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';

import MainView from './components/views/MainView';

import store from './redux';

import './App.css';
import './NerdFonts.css';
import PageHeaders from './components/views/PageHeaders';

const App = () => {
  // require('./components/preferences/Preferences').resetLocalStorage();

  return (
    <HelmetProvider>
      <Provider store={store}>
        <PageHeaders />
        <MainView />
      </Provider>
    </HelmetProvider>
  );
};

export default App;
