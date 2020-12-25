import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import flightReducer from '../Flights/reducers/flightReducer.js';

const initialState = {
  isLoading: false,
  searchResults: [],
  savedResults: []
}
const store = createStore(flightReducer, initialState, applyMiddleware(thunk));

export default store;