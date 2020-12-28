import groupMessages from '../../lib/chatFeedParser.js'
import io from 'socket.io-client';

const setChatFeed = (feed) => ({
  type: 'SET_CHAT_FEED',
  chatFeed: feed
})
const setConnectedUserCount = (count) => ({
  type: 'UPDATE_USER_COUNT',
  connectedUserCount: count
})
const setThreadMessage = (message) => ({
  type: 'SET_THREAD',
  messageInThread: message
})
const toggleThreadDisplay = (dispState) => ({
  type: 'TOGGLE_THREAD_DISPLAY',
  showThread: dispState
})
const sendGreeting = () => ({
  type: 'message',
  data: 'some text for test message'
})

const sendChat = (msg) => ({
  type: 'chat/newChat',
  message: msg
})

//Thunks that do async stuff THEN update state (by calling above funcs)
const connectToChatServer = (socket) => {
  console.log('connecting', socket)
  return (dispatch) => {
    // socket.connect();
    dispatch(sendGreeting())
    socket.on('connect', () => {
      socket.emit('greeting');
      dispatch(sendGreeting())
    })
    socket.on('connectedUsers', (newCount) => {
      dispatch(setConnectedUserCount(newCount));
    })
    socket.on('updatedMessages', (newMsgs) => {
      console.log('new messages received');
      dispatch(setChatFeed(groupMessages(Object.values(newMsgs))));
    })
  }
}

// const sendChat = (chatMsg) => {
//   return (dispatch) => {
//     dispatch(socket.emit('message', chatMsg));
//   }
// }

const displayChatThread = (chatMsg) => {
  return (dispatch, getState) => {
    dispatch(setThreadMessage(chatMsg));
    dispatch(toggleThreadDisplay(true));
  }
}

export {setChatFeed, setConnectedUserCount, setThreadMessage, toggleThreadDisplay, connectToChatServer, sendChat, displayChatThread}