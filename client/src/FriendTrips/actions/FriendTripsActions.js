import axios from 'axios';

//Normal actions that update state
const setLoading = (loadingState) => ({
  type: 'SET_LOADING_APP',
  isLoading: loadingState
})
const setTripList = (tripList) => ({
  type: 'SET_TRIP_LIST',
  tripList: tripList
})
const setConnectedUsers = (userList) => ({
  type: 'SET_CONNECTED_USERS',
  connectedUsers: userList
})
const setSelectedTrip = (trip) => ({
  type: 'SET_SELECTED_TRIP',
  selectedTrip: trip
})

//Thunks that do async stuff THEN update state (by calling above funcs)
const getTripList = () => {
  return ((dispatch, getState) => {
    axios.get('https://morning-bayou-59969.herokuapp.com/trips')
      .then((result) => {
        const trips = result.data;
        let selectedTrip = getState().app.selectedTrip;
        if (!selectedTrip) {
          dispatch(setTripList(trips));
          dispatch(setSelectedTrip(result.data[0]));
          dispatch(setLoading(false));
        } else {
          dispatch(setTripList(trips));
        }
      })
      .catch((err) => {
        console.log('couldnt get trips from server', err)
      })
  })
}
const getTripData = (trip) => {
  //TODO: should re-fetch all data for a specific trip THEN populate/update store
  return (dispatch) => {
    //axios.get(`http://morning-bayou-59969.herokuapp.com/flights/?trip_id=1`)
      //.then((result) => {
        dispatch(setSelectedTrip(trip));
      //})
      //.catch(console.log)
  }
}



export { setLoading, setTripList, setConnectedUsers, setSelectedTrip, getTripList, getTripData };
