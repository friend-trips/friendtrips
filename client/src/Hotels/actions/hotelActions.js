import axios from 'axios';

//Normal actions that update state
const setLoading = (loadingState) => ({
  type: 'SET_LOADING_HOTELS',
  isLoading: loadingState
})
const setSearchResults = (hotelResults) => ({
  type: 'SET_SEARCHED_HOTELS',
  searchResults: hotelResults
})
const setSavedHotels = (savedHotels) => ({
  type: 'SET_SAVED_HOTELS',
  savedResults: savedHotels
})
const addSavedHotel = (hotel) => ({
  type: 'ADD_SAVED_HOTEL',
  hotel: hotel
})

//Thunks that do async stuff THEN update state (by calling above funcs)
const searchForHotels = (hotelQuery) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    axios({
      method: 'post',
      url: 'http://morning-bayou-59969.herokuapp.com/api/amadeus/hotels',
      header: { 'Access-Control-Allow-Origin': '*' },
      data: hotelQuery
    })
      .then(({data}) => {
        dispatch(setSearchResults(data));
        dispatch(setLoading(false));
      })
      .catch((response) => {
        console.log('ERROR IN SERVER', response);
      });
  }
}
const getSavedHotels = (cb) => {
  return (dispatch) => {
    axios.get(`https://morning-bayou-59969.herokuapp.com/hotels/?trip_id=1`)
      .then((result) => {
        dispatch(setSavedHotels(Object.values(result.data)));
        if (cb) {
          cb(Object.values(result.data));
        }
      })
      .catch(console.log)
  }
}
const saveSearchResult = (hotel) => {
  console.log('SAVE SEARCH RESULT')
  return (dispatch) => {
    axios({
      method: 'post',
      url: 'https://morning-bayou-59969.herokuapp.com/hotels',
      data: hotel,
      header: { 'Access-Control-Allow-Origin': '*' }
    })
      .then((response) => {
        console.log('hotel save search result', response.data.rows[0])
        dispatch(addSavedHotel(response.data.rows[0]))
      })
      .catch(console.log)
  }
};

const voteOnSuggestion = (vote) => {
  return (dispatch) => {
    axios({
      method: 'post',
      url: 'https://morning-bayou-59969.herokuapp.com/api/votes',
      header: { 'Access-Control-Allow-Origin': '*' },
      data: vote
    })
      .then(() => {
        dispatch(getSavedHotels());
      })
      .catch(console.log)
  }
}



export { setLoading, searchForHotels, setSearchResults, setSavedHotels, addSavedHotel, saveSearchResult, getSavedHotels, voteOnSuggestion };
