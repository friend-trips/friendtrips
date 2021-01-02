import { connect } from 'react-redux';
import FlightForm from '../FlightForm.jsx';
import {setLoading, searchForFlights} from '../actions/flightActions.js'

const mapDispatchToProps = (dispatch) => {
  return {
    searchForFlights: (query) => dispatch(searchForFlights(query))
  };
};

var FlightFormContainer = connect(null, mapDispatchToProps)(FlightForm);

export default FlightFormContainer;
