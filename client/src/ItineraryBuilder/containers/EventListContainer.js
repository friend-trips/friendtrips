import { connect } from 'react-redux';
import EventList from '../EventList.jsx';
import {getSavedHotels} from '../../Hotels/actions/hotelActions.js'
import {getSavedFlights} from '../../Flights/actions/flightActions.js'
import {getSavedPOIs} from '../../PointsOfInterest/actions/poiActions.js'
import {createItinerary, getItinsByTrip, updateSelectedItin} from '../actions/ItineraryBuilderActions.js'

const mapStateToProps = (state) => {
  return {
    hotelSuggestions: state.hotels.savedResults,
    flightSuggestions: state.flights.savedResults,
    poiSuggestions: state.pois.savedResults,
    selectedTrip: state.app.selectedTrip,
    itineraryList: state.itinerary.itineraryList,
    selectedItinerary: state.itinerary.selectedItinerary
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSavedHotels: (cb) => dispatch(getSavedHotels(cb)),
    getSavedFlights: (cb) => dispatch(getSavedFlights(cb)),
    getSavedPOIs: (cb) => dispatch(getSavedPOIs(cb)),
    createItinerary: (itin, cb) => dispatch(createItinerary(itin, cb)),
    getItinsByTrip: (trip_id, cb) => dispatch(getItinsByTrip(trip_id, cb)),
    updateSelectedItin: (itin_id) => dispatch(updateSelectedItin(itin_id))
  };
};

var EventListContainer = connect( mapStateToProps, mapDispatchToProps )(EventList);

export default EventListContainer;
