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
    // console.log('mounting chat user', authContext.user, authContext.username)
    //actually connect to socket server
    socket.connect();
    socket.on('connect', () => {
      socket.emit('greeting');
    })
    socket.on('connectedUsers', (newconnectedUserCount) => {
      dispatch(setConnectedUserCount(newconnectedUserCount));
    })
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

  const emitChange = (type, data, cb) => {
    socket.emit(type, data);
    if (cb) {
      cb();
    }
  }

  return emitChange;
}

export default useSocket;