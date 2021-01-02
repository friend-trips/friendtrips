import axios from 'axios';
import amadeus from '../../lib/amadeus.js';
import parser from '../../lib/hotelResultParser.js'

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

//Thunks that do async stuff THEN update state (by calling above funcs)
const searchForHotels = (hotelQuery) => {
  return (dispatch) => {
    console.log('SEARCH FOR HOTELS ');
    dispatch(setLoading(true));
    amadeus.shopping.hotelOffers
      .get(hotelQuery)
      .then(function (response) {
        dispatch(setSearchResults(parser(response.data)));
        dispatch(setLoading(false));
      })
      .catch(function (response) {
        console.log('ERROR IN SERVER', response);
      });
  }
}
const getSavedHotels = () => {
  return (dispatch) => {
    axios.get(`http://morning-bayou-59969.herokuapp.com/hotels/?trip_id=1`)
      .then((result) => {
        dispatch(setSavedHotels(Object.values(result.data)));
      })
      .catch(console.log)
  }
}
const saveSearchResult = (hotel) => {
  console.log('SAVE SEARCH RESULT')
  return (dispatch) => {
    axios({
      method: 'post',
      url: 'http://morning-bayou-59969.herokuapp.com/hotels',
      data: hotel,
      header: { 'Access-Control-Allow-Origin': '*' }
    })
      .then((data) => {
        dispatch(getSavedHotels())
      })
      .catch(console.log)
  }
};

const voteOnSuggestion = (vote) => {
  return (dispatch) => {
    axios({
      method: 'post',
      url: 'http://morning-bayou-59969.herokuapp.com/api/votes',
      header: { 'Access-Control-Allow-Origin': '*' },
      data: vote
    })
      .then(() => {
        dispatch(getSavedHotels());
      })
      .catch(console.log)
  }
}



export { setLoading, searchForHotels, setSearchResults, setSavedHotels, saveSearchResult, getSavedHotels, voteOnSuggestion };
