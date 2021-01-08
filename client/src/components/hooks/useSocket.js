import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {setChatFeed, setConnectedUserCount} from '../../GroupChat/actions/chatActions.js'
import {addSavedHotel} from '../../Hotels/actions/hotelActions.js'
import {addSavedFlight} from '../../Flights/actions/flightActions.js'
import groupMessages from '../../lib/chatFeedParser.js'
import socket from '../../lib/chatSocket.js'

const useSocket = (user_id, username) => {
  const dispatch = useDispatch();
  useEffect(() => {
    socket.auth.user_id = user_id;
    socket.auth.username = username;
    socket.connect();
    socket.on('connect', () => {
      socket.emit('greeting');
    })
    socket.on('connectedUsers', (newconnectedUserCount) => {
      dispatch(setConnectedUserCount(newconnectedUserCount));
    })
    //listen for updates from the server and dispatch actions accordingly
    socket.on('updatedMessages', (newMsgs) => {
      console.log('new messages received', newMsgs.length);
      dispatch(setChatFeed(groupMessages(newMsgs)));
    })
    socket.on('updatedFlights', (flight) => {
      console.log('new flight received from server');
      dispatch(addSavedFlight(flight));
    })
    socket.on('updatedHotels', (hotel) => {
      console.log('new hotel received from server', hotel);
      dispatch(addSavedHotel(hotel));
    })
    //clean up socket connection when the component unmounts
    return () => {
      socket.disconnect();
    }
  }, [])

  /*
  emitChange parameters:
    type: a string describing the change to send to the server (either 'addHotel', 'addFlight', 'message', or 'comment')
    data: an object containing the data you wish to send to the server
    [callback]: an optional function which can be run on the server (requires your own setup in the server)
  */
  const emitChange = (type, data, cb) => {
    console.log('emitChange', type, data)
    socket.emit(type, data, cb);
  }

  return emitChange;
}

export default useSocket;