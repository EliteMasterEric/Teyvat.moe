import React from 'react';
import { Provider } from 'react-redux';

import MainView from './components/views/MainView';

import store from './redux';

import './App.css';
import './NerdFonts.css';

const App = () => {
  return (
    <Provider store={store}>
      <MainView />
    </Provider>
  );
};

export default App;
