import { connect } from 'react-redux';
import ItineraryBuilder from '../Calendar.jsx';
import {getSavedHotels} from '../../Hotels/actions/hotelActions.js'
import {getSavedFlights} from '../../Flights/actions/flightActions.js'
import {getSavedPOIs} from '../../PointsOfInterest/actions/poiActions.js'
import {getSavedEvents, saveEvent, updateEvent, deleteEvent} from '../actions/ItineraryBuilderActions.js'

const mapStateToProps = (state) => {
  return {
    savedEvents: state.itinerary.savedEvents
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSavedEvents: (itinerary_id, cb) => dispatch(getSavedEvents(itinerary_id, cb)),
    saveEvent: (event, itinId) => dispatch(saveEvent(event, itinId)),
    updateEvent: (event, itinId) => dispatch(updateEvent(event, itinId)),
    deleteEvent: (eventId, itinId) => dispatch(deleteEvent(eventId, itinId)),
  };
};


var ItineraryBuilderContainer = connect( mapStateToProps, mapDispatchToProps )(ItineraryBuilder);

export default ItineraryBuilderContainer;
