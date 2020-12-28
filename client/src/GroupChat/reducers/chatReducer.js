const initialState = {
  connectedUserCount: 0,
  chatFeed: [],
  showThread: false,
  messageInThread: null
}

var chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_USER_COUNT':
      console.log('UPDATE_USER_COUNT')
      return Object.assign({}, state, { connectedUserCount: action.connectedUserCount });
    case 'SET_THREAD':
      console.log('SET_THREAD')
      return Object.assign({}, state, { messageInThread: action.messageInThread });
    case 'TOGGLE_THREAD_DISPLAY':
      console.log('TOGGLE_THREAD_DISPLAY')
      return Object.assign({}, state, { showThread: action.showThread });
    case 'SET_CHAT_FEED':
      console.log('SET_CHAT_FEED', action.chatFeed, action.chatFeed.length)
      return Object.assign({}, state, { chatFeed: action.chatFeed });
    case 'chat/newChat':
      console.log('message received in chatReducer with action.type', action.type)
      console.log('message: ', action.message);
      return state;
    default:
      return state;
  }
};

export default chatReducer;