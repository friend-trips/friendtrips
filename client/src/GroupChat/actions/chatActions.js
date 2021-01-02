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

const updateThread = (chatMsg) => {
  return (dispatch) => {
    console.log(chatMsg)
    if (chatMsg) {
      dispatch(setThreadMessage(chatMsg));
    } else {
      dispatch(setThreadMessage(null));
    }
  }
}


export { setChatFeed, setConnectedUserCount, setThreadMessage, toggleThreadDisplay, updateThread }