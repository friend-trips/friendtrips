import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import store from './store/store.js';
import { Provider } from 'react-redux';
import { AuthProvider, AuthContext } from './components/providers/AuthenticationProvider.jsx'

ReactDOM.render(
  <Provider store={store}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Provider>, document.getElementById('app'))