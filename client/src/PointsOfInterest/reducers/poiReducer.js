const initialState = {
  savedResults: [],
  searchResults: [],
  isLoading: false
}

var poiReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOADING_POIS':
      console.log('SET LOADING')
      return Object.assign({}, state, { isLoading: action.isLoading });
    case 'SET_SEARCHED_POIS':
      console.log('SET SEARCHED POIS')
      return Object.assign({}, state, { searchResults: action.searchResults });
    case 'SET_SAVED_POIS':
      console.log('SET SAVED POIS')
      return Object.assign({}, state, { savedResults: action.savedResults });
      case 'ADD_SAVED_POI':
      console.log('ADD SAVED POI', state)
      return Object.assign({}, state, { savedResults: [...state.savedResults, action.poi] });
    default:
      return state;
  }
};

export default poiReducer;