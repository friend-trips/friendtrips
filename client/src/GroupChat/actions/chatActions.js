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

// const sendChat = (msg) => ({
//   type: 'chat/newChat',
//   message: msg
// })

//Thunks that do async stuff THEN update state (by calling above funcs)
// const sendChat = (msg) => {
//   console.log('sendchat', msg)
//   return (dispatch) => {
//     dispatch({
//       type: 'chat/newChat',
//       data: msg,
//       message: msg
//     });
//   }
// }
const updateThread = (chatMsg) => {
  return (dispatch) => {
    console.log(chatMsg)
    if (chatMsg) {
      dispatch(setThreadMessage(chatMsg));
      // dispatch(toggleThreadDisplay(true));
    } else {
      dispatch(setThreadMessage(null));
      // dispatch(toggleThreadDisplay(false))
    }
  }
}


export { setChatFeed, setConnectedUserCount, setThreadMessage, toggleThreadDisplay, updateThread }