import axios from 'axios';

//Normal actions that update state
const setSavedEvents = (savedEvents) => ({
  type: 'SET_SAVED_EVENTS',
  savedEvents: savedEvents
})
const addSavedEvent = (event) => ({
  type: 'ADD_SAVED_EVENT',
  event: event
})
const updateSavedEvent = (event) => ({
  type: 'UPDATE_SAVED_EVENT',
  event: event
})
const deleteSavedEvent = (event_id) => ({
  type: 'DELETE_SAVED_EVENT',
  event_id: event_id
})

//Thunks that do async stuff THEN update state (by calling above funcs)

const getSavedEvents = (itinId, cb) => {
  return (dispatch) => {
    axios.get(`http://morning-bayou-59969.herokuapp.com/api/itinerary/${itinId}/events/`)
      .then((result) => {
        console.log('get savedEvents results', result);
        dispatch(setSavedEvents(result.data));
        if (cb) {
          cb(result.data);
        }
      })
      .catch(console.log)
  }
}
const saveEvent = (event, itinId) => {
  console.log('SAVE SEARCH RESULT', event, itinId)
  return (dispatch) => {
    axios({
      method: 'post',
      url: `http://morning-bayou-59969.herokuapp.com/api/itinerary/${itinId}/events`,
      data: event,
      header: { 'Access-Control-Allow-Origin': '*' }
    })
      .then((response) => {
        // console.log('event save search result', response.data)
        dispatch(addSavedEvent(response.data))
      })
      .catch(console.log)
  }
};

const updateEvent = (event, itinId) => {
  return (dispatch) => {
    axios({
      method: 'patch',
      url: `http://morning-bayou-59969.herokuapp.com/api/itinerary/${itinId}/events/${event.event_id}`,
      data: event,
      header: { 'Access-Control-Allow-Origin': '*' }
    })
      .then((response) => {
        // console.log('event update result', response.data)
        dispatch(updateSavedEvent(event))
      })
      .catch(console.log)
  }
}

const deleteEvent = (event_id, itinId) => {
  console.log('delete eventt', event_id, itinId)
  return (dispatch) => {
    axios({
      method: 'delete',
      url: `http://morning-bayou-59969.herokuapp.com/api/itinerary/${itinId}/events/${event_id}`,
      header: { 'Access-Control-Allow-Origin': '*' }
    })
      .then((response) => {
        // console.log('delete event result', response.data)
        dispatch(deleteSavedEvent(event_id))
      })
      .catch(console.log)
  }
}

const createItinerary = (itinerary, cb) => {
  return (dispatch) => {
    axios({
      method: 'post',
      url: `http://morning-bayou-59969.herokuapp.com/api/itinerary/`,
      data: itinerary,
      header: { 'Access-Control-Allow-Origin': '*' }
    })
      .then((response) => {
        console.log(response.data[0])
        if (cb) {
          console.log('callback response')
          cb(response.data[0])
        }
      })
      .catch(console.log)
  }
}




export { setSavedEvents, getSavedEvents, updateEvent, deleteEvent, saveEvent, createItinerary };
