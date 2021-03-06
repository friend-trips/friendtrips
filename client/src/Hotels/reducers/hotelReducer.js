const initialState = {
  savedResults: [],
  searchResults: [],
  isLoading: false
}

var hotelReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOADING_HOTELS':
      console.log('SET LOADING')
      return Object.assign({}, state, { isLoading: action.isLoading });
    case 'SET_SEARCHED_HOTELS':
      console.log('SET SEARCHED HOTELS')
      return Object.assign({}, state, { searchResults: action.searchResults });
    case 'SET_SAVED_HOTELS':
      console.log('SET SAVED HOTELS')
      return Object.assign({}, state, { savedResults: action.savedResults });
      case 'ADD_SAVED_HOTEL':
      console.log('ADD SAVED HOTEL', state)
      return Object.assign({}, state, { savedResults: [...state.savedResults, action.hotel] });
    default:
      return state;
  }
};

export default hotelReducer;