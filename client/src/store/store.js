import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import flightReducer from '../Flights/reducers/flightReducer.js';
import chatReducer from '../GroupChat/reducers/chatReducer.js'

import createSocketIoMiddleware from 'redux-socket.io';

import socket from '../lib/chatSocket.js'

var rootReducer = combineReducers({
  flights: flightReducer,
  chat: chatReducer,
});

const preloadedState = {
  flights: {
    isLoading: false,
    searchResults: [],
    savedResults: []
  },
  chat: {
    connectedUserCount: 0,
    chatFeed: [],
    messageInThread: null
  }
}

const store = createStore(rootReducer, preloadedState, applyMiddleware(thunk));

export default store;