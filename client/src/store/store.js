import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import friendTripsReducer from '../FriendTrips/reducers/FriendTripsReducer.js'
import hotelReducer from '../Hotels/reducers/hotelReducer.js'
import flightReducer from '../Flights/reducers/flightReducer.js';
import chatReducer from '../GroupChat/reducers/chatReducer.js'
import poiReducer from '../PointsOfInterest/reducers/poiReducer.js'
import itineraryReducer from '../ItineraryBuilder/reducers/ItineraryReducer.js'


const rootReducer = combineReducers({
  app: friendTripsReducer,
  flights: flightReducer,
  hotels: hotelReducer,
  pois: poiReducer,
  chat: chatReducer,
  itinerary: itineraryReducer
});

const preloadedState = {
  app: {
    isLoading: false,
    selectedTrip: null,
    tripList: [],
    connectedUsers: []
  },
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
  pois: {
    isLoading: false,
    searchResults: [],
    savedResults: []
  },
  chat: {
    connectedUserCount: 0,
    chatFeed: [],
    messageInThread: null
  },
  itinerary: {
    savedEvents: []
  }
}

const store = createStore(rootReducer, preloadedState, applyMiddleware(thunk));

export default store;