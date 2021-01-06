const initialState = {
  isLoading: false,
  selectedTrip: null,
  tripList: [],
  connectedUsers: []
}

var friendTripsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOADING_APP':
      console.log('SET LOADING')
      return Object.assign({}, state, { isLoading: action.isLoading });
    case 'SET_TRIP_LIST':
      console.log('SET_TRIP_LIST')
      return Object.assign({}, state, { tripList: action.tripList });
    case 'SET_CONNECTED_USERS':
      console.log('SET_CONNECTED_USERS')
      return Object.assign({}, state, { connectedUsers: action.connectedUsers });
    case 'SET_SELECTED_TRIP':
      console.log('SET_SELECTED_TRIP')
      return Object.assign({}, state, { selectedTrip: action.selectedTrip });
    default:
      return state;
  }
};

export default friendTripsReducer;