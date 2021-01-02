import { connect } from 'react-redux';
import Flights from '../Flights.jsx';
import {getSavedFlights} from '../actions/flightActions.js'

const mapDispatchToProps = (dispatch) => {
  return {
    getSavedFlights: () => dispatch(getSavedFlights())
  };
};

var FlightsContainer = connect(null, mapDispatchToProps)(Flights);

export default FlightsContainer;
