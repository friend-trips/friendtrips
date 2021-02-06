import axios from 'axios';

//Normal actions that update state
const setLoading = (loadingState) => ({
  type: 'SET_LOADING_POIS',
  isLoading: loadingState
})
const setSearchResults = (poiResults) => ({
  type: 'SET_SEARCHED_POIS',
  searchResults: poiResults
})
const setSavedPOIs = (savedPOIs) => ({
  type: 'SET_SAVED_POIS',
  savedResults: savedPOIs
})
const addSavedPOI = (poi) => ({
  type: 'ADD_SAVED_POI',
  poi: poi
})

//Thunks that do async stuff THEN update state (by calling above funcs)
const searchForPOIs = (poiQuery) => {
  let {longitude, latitude} = poiQuery
  return (dispatch) => {
    dispatch(setLoading(true));
    axios.get(`https://morning-bayou-59969.herokuapp.com/api/amadeus/POI/?latitude=${latitude}&longitude=${longitude}`)
      .then((response) => {
        dispatch(setSearchResults(response.data));
        dispatch(setLoading(false));
      })
      .catch((response) => {
        console.log('ERROR IN SERVER', response);
      });
  }
}
const getSavedPOIs = (cb) => {
  //TODO: fix this function to only searchPOIs by a specific trip_ID
  return (dispatch) => {
    axios.get(`https://morning-bayou-59969.herokuapp.com/pois/`)
      .then((result) => {
        dispatch(setSavedPOIs(result.data));
        if (cb) {
          cb(null, result.data);
        }
      })
      .catch((err) => {
        console.log(err);
        if (cb) {
          cb(err, null);
        }
      })
  }
}
const saveSearchResult = (poi) => {
  console.log('SAVE SEARCH RESULT')
  return (dispatch) => {
    axios({
      method: 'post',
      url: 'https://morning-bayou-59969.herokuapp.com/pois',
      data: poi,
      header: { 'Access-Control-Allow-Origin': '*' }
    })
      .then((response) => {
        dispatch(addSavedPOI(response.data))
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
        dispatch(getSavedPOIs());
      })
      .catch(console.log)
  }
}



export { setLoading, searchForPOIs, setSearchResults, setSavedPOIs, addSavedPOI, saveSearchResult, getSavedPOIs, voteOnSuggestion };
