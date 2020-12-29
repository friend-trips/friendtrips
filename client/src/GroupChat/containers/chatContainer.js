import { connect } from 'react-redux';
import Chat from '../Chat.jsx';
import {connectToChatServer, sendChat, updateThread, setChatFeed} from '../actions/chatActions.js'

const mapDispatchToProps = (dispatch) => {
  return {
    updateThread: (msg) => dispatch(updateThread(msg)),
    setChatFeed: (feed) => dispatch(setChatFeed(feed))
  };
};
const mapStateToProps = (state) => {
  return {
    thread: state.messageInThread,
    chatFeed: state.chatFeed
  }
}

var chatContainer = connect(mapStateToProps, mapDispatchToProps)(Chat);

export default chatContainer;
