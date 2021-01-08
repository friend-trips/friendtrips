import axios from 'axios';
import amadeus from '../../lib/amadeus.js';
import parser from '../../lib/flightResultParser.js'

//Normal actions that update state
const setLoading = (loadingState) => ({
  type: 'SET_LOADING_FLIGHTS',
  isLoading: loadingState
})
const setSearchResults = (flightResults) => ({
  type: 'SET_SEARCHED_FLIGHTS',
  searchResults: flightResults
})
const setSavedFlights = (savedFlights) => ({
  type: 'SET_SAVED_FLIGHTS',
  savedResults: savedFlights
})

//Thunks that do async stuff THEN update state (by calling above funcs)
const searchForFlights = (flightQuery) => {
  return (dispatch) => {
    console.log('SEARCH FOR FLIGHTS ');
    dispatch(setLoading(true));
    amadeus.shopping.flightOffersSearch
      .get(flightQuery)
      .then(function (response) {
        console.log(
          'RESPONSE FROM SERVER', response.data
        )
        dispatch(setSearchResults(parser(response.data)));
        dispatch(setLoading(false));
      })
      .catch(function (response) {
        console.log('ERROR IN SERVER', response);
      });
  }
}
const getSavedFlights = (cb) => {
  return (dispatch) => {
    axios.get(`http://morning-bayou-59969.herokuapp.com/flights/?trip_id=1`)
      .then((result) => {
        dispatch(setSavedFlights(Object.values(result.data)));
        if (cb) {
          cb(Object.values(result.data))
        }
      })
      .catch(console.log)
  }
}
const saveSearchResult = (flight) => {
  console.log('SAVE SEARCH RESULT')
  return (dispatch) => {
    axios({
      method: 'post',
      url: 'http://morning-bayou-59969.herokuapp.com/flights',
      data: flight,
      header: { 'Access-Control-Allow-Origin': '*' }
    })
      .then((data) => {
        dispatch(getSavedFlights())
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
        dispatch(getSavedFlights());
      })
      .catch(console.log)
  }
}



export { setLoading, searchForFlights, setSearchResults, setSavedFlights, saveSearchResult, getSavedFlights, voteOnSuggestion };
