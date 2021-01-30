import { connect } from 'react-redux';
import EventList from '../EventList.jsx';

const mapStateToProps = (state) => {
  return {
    hotelSuggestions: state.hotels.savedResults,
    flightSuggestions: state.flights.savedResults,
    poiSuggestions: state.pois.savedResults,
    selectedTrip: state.app.selectedTrip,
  };
};



var EventListContainer = connect( mapStateToProps, null )(EventList);

export default EventListContainer;
