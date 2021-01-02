import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import hotelReducer from '../Hotels/reducers/hotelReducer.js'
import flightReducer from '../Flights/reducers/flightReducer.js';
import chatReducer from '../GroupChat/reducers/chatReducer.js'


const rootReducer = combineReducers({
  flights: flightReducer,
  hotels: hotelReducer,
  chat: chatReducer,
});

const preloadedState = {
  flights: {
    isLoading: false,
    searchResults: [],
    savedResults: []
  },
  hotels: {
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