import { connect } from 'react-redux';
import { connectToChatServer, sendChat, updateThread, setChatFeed } from '../actions/chatActions.js'
import Chat from '../Chat.jsx';

const mapDispatchToProps = (dispatch) => {
  return {
    updateThread: (msg) => dispatch(updateThread(msg)),
    setChatFeed: (feed) => dispatch(setChatFeed(feed))
  };
};
const mapStateToProps = (state) => {
  return {
    thread: state.chat.messageInThread,
    chatFeed: state.chat.chatFeed
  }
}

var chatContainer = connect(mapStateToProps, mapDispatchToProps)(Chat);

export default chatContainer;
