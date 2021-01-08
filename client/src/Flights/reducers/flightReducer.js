const initialState = {
  isLoading: false,
  searchResults: [],
  savedResults: []
}

var flightReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOADING_FLIGHTS':
      console.log('SET LOADING')
      return Object.assign({}, state, { isLoading: action.isLoading });
    case 'SET_SEARCHED_FLIGHTS':
      console.log('SET SEARCHED FLIGHTS')
      return Object.assign({}, state, { searchResults: action.searchResults });
    case 'SET_SAVED_FLIGHTS':
      console.log('SET SAVED FLIGHTS')
      return Object.assign({}, state, { savedResults: action.savedResults });
    case 'Add_SAVED_FLIGHT':
      console.log('Add SAVED FLIGHT')
      return Object.assign({}, state, { savedResults: [...state.savedResults, action.flight] });
    default:
      return state;
  }
};

export default flightReducer;