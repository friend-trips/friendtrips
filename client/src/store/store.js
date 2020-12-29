import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import flightReducer from '../Flights/reducers/flightReducer.js';
import chatReducer from '../GroupChat/reducers/chatReducer.js'

import createSocketIoMiddleware from 'redux-socket.io';
// import io from 'socket.io-client';
import socket from '../lib/chatSocket.js'
let socketIoMiddleware = createSocketIoMiddleware(socket, '/socket.io');


// var rootReducer = combineReducers({flight: flightReducer, chat: chatReducer});

const initialState = {
  isLoading: false,
  searchResults: [],
  savedResults: [],
  connectedUserCount: 0,
  chatFeed: [],
  showThread: false,
  messageInThread: null
}
const store = createStore(chatReducer, initialState, applyMiddleware(socketIoMiddleware, thunk));

export default store;