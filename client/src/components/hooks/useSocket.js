import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {setChatFeed} from '../../GroupChat/actions/chatActions.js'
import {setSavedHotels} from '../../Hotels/actions/hotelActions.js'
import {setSavedFlights} from '../../Flights/actions/flightActions.js'
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
    //set up event listeners on the socket to run dispatch-linked actions
    socket.on('connect', () => {
      //get all the stuff
      socket.emit('greeting');
    })
    // socket.on('connectedUsers', (newconnectedUserCount) => {
    //   setConnectedUserCount(newconnectedUserCount);
    // })
    socket.on('updatedMessages', (newMsgs) => {
      console.log('new messages received', newMsgs.length);
      dispatch(setChatFeed(groupMessages(newMsgs)));
    })
    socket.on('updatedFlights', (newFlights) => {
      console.log('new flights received', newFlights.length);
      dispatch(setSavedHotels(newFlights));
    })
    socket.on('updatedHotels', (newHotels) => {
      console.log('new hotels received', newHotels.length);
      dispatch(setSavedFlights(newHotels));
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