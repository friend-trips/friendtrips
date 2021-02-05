import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { AuthProvider } from './components/providers/AuthenticationProvider.jsx'

import App from './components/App.jsx';
import store from './store/store.js';

// import { Calendar } from '@fullcalendar/core';
// import dayGridPlugin from '@fullcalendar/daygrid';

// document.addEventListener('DOMContentLoaded', function() {
//   var calendarEl = document.getElementById('calendar');

//   var calendar = new Calendar(calendarEl, {
//     plugins: [ dayGridPlugin ]
//   });

//   calendar.render();
// });


ReactDOM.render(
  <Provider store={store}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Provider>,
  document.getElementById('app'))