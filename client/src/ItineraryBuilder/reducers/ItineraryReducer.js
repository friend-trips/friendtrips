const initialState = {
  savedEvents: [],
  selectedItinerary: null
}

var itineraryReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SAVED_EVENTS':
      console.log('SET SAVED EVENTS')
      return {...state, savedEvents: [...action.savedEvents]};
    case 'ADD_SAVED_EVENT':
      console.log('ADD SAVED EVENTS', state)
      return {...state, savedEvents: [...state.savedEvents, action.event]};
    case 'UPDATE_SAVED_EVENT':
      console.log('UPDATE SAVED EVENTS', state)
      return {...state, savedEvents: state.savedEvents.map((event) => event.event_id === action.event.event_id ? action.event : event)};
    case 'DELETE_SAVED_EVENT':
      console.log('DELETE SAVED EVENTS', state)
      return {...state, savedEvents: state.savedEvents.filter((event) => event.event_id !== action.event_id)}
    case 'SET_SELECTED_ITIN':
      console.log('SET SELECTED ITIN', state)
      return {...state, selectedItinerary: action.selectedItinerary}
    default:
      return state;
  }
};
//TODO: figure out why delete events are being called multiple times (And with different ids)
export default itineraryReducer;