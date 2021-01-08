import { connect } from 'react-redux';
import ItineraryBuilder from '../ItineraryBuilder.jsx';
import {getSavedHotels} from '../../Hotels/actions/hotelActions.js'
import {getSavedFlights} from '../../Flights/actions/flightActions.js'

const mapStateToProps = (state) => {
  return {
    hotelSuggestions: state.hotels.savedResults,
    flightSuggestions: state.flights.savedResults,
    selectedTrip: state.app.selectedTrip,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSavedHotels: (cb) => dispatch(getSavedHotels(cb)),
    getSavedFlights: (cb) => dispatch(getSavedFlights(cb))
  };
};


var ItineraryBuilderContainer = connect( mapStateToProps, mapDispatchToProps )(ItineraryBuilder);

export default ItineraryBuilderContainer;
