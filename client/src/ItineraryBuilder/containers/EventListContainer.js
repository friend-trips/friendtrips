import { connect } from 'react-redux';
import EventList from '../EventList.jsx';
import {getSavedHotels} from '../../Hotels/actions/hotelActions.js'
import {getSavedFlights} from '../../Flights/actions/flightActions.js'
import {getSavedPOIs} from '../../PointsOfInterest/actions/poiActions.js'

const mapStateToProps = (state) => {
  return {
    hotelSuggestions: state.hotels.savedResults,
    flightSuggestions: state.flights.savedResults,
    poiSuggestions: state.pois.savedResults,
    selectedTrip: state.app.selectedTrip,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSavedHotels: (cb) => dispatch(getSavedHotels(cb)),
    getSavedFlights: (cb) => dispatch(getSavedFlights(cb)),
    getSavedPOIs: (cb) => dispatch(getSavedPOIs(cb))
  };
};

var EventListContainer = connect( mapStateToProps, mapDispatchToProps )(EventList);

export default EventListContainer;
