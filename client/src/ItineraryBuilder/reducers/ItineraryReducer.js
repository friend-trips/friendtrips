const initialState = {
  savedEvents: []
}

var itineraryReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SAVED_EVENTS':
      console.log('SET SAVED EVENTS')
      return {savedEvents: [...action.savedEvents]};
    case 'ADD_SAVED_EVENT':
      console.log('ADD SAVED EVENTS')
      return {savedEvents: [...state.savedEvents, action.event]};
    case 'UPDATE_SAVED_EVENT':
      console.log('UPDATE SAVED EVENTS')
      return state.savedEvents.map((event) => event.event_id === action.event.event_id ? action.event : event);
    case 'DELETE_SAVED_EVENT':
      console.log('DELETE SAVED EVENTS')
      return state.savedEvents.filter((event) => event.id !== action.event_id)
    default:
      return state;
  }
};

export default itineraryReducer;