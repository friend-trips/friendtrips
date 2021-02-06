import axios from 'axios';

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
const addSavedFlight = (flight) => ({
  type: 'ADD_SAVED_FLIGHT',
  flight: flight
})

//Thunks that do async stuff THEN update state (by calling above funcs)
const searchForFlights = (flightQuery) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    axios({
      method: 'post',
      url: 'http://morning-bayou-59969.herokuapp.com/api/amadeus/flights',
      header: { 'Access-Control-Allow-Origin': '*' },
      data: flightQuery
    })
      .then(function (response) {
        dispatch(setSearchResults(response.data));
        dispatch(setLoading(false));
      })
      .catch(function (response) {
        console.log('ERROR IN SERVER', response);
      });
  }
}
const getSavedFlights = (cb) => {
  return (dispatch) => {
    axios.get(`https://morning-bayou-59969.herokuapp.com/flights/?trip_id=1`)
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
      url: 'https://morning-bayou-59969.herokuapp.com/flights',
      data: flight,
      header: { 'Access-Control-Allow-Origin': '*' }
    })
      .then((data) => {
        dispatch(addSavedFlights())
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
        dispatch(getSavedFlights());
      })
      .catch(console.log)
  }
}



export { setLoading, searchForFlights, setSearchResults, setSavedFlights, addSavedFlight, saveSearchResult, getSavedFlights, voteOnSuggestion };
