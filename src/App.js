import React from 'react';
import { Provider } from 'react-redux';

import MainView from './components/views/MainView';

import store from './redux';

import './App.css';
import './NerdFonts.css';
import PageHeaders from './components/views/PageHeaders';

const App = () => {
  return (
    <Provider store={store}>
      <PageHeaders />
      <MainView />
    </Provider>
  );
};

export default App;
