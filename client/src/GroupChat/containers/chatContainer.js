import { connect } from 'react-redux';
import Chat from '../Chat.jsx';
import {connectToChatServer, sendChat, displayChatThread, setChatFeed} from '../actions/chatActions.js'

const mapDispatchToProps = (dispatch) => {
  return {
    connectToChatServer: () => dispatch(connectToChatServer()),
    sendChat: (msg) => dispatch(sendChat(msg)),
    displayChatThread: (msg) => dispatch(displayChatThread),
    setChatFeed: (feed) => dispatch(setChatFeed(feed))
  };
};
const mapStateToProps = (state) => {
  return {
    threadState: state.showThread,
    thread: state.messageInThread,
    chatFeed: state.chatFeed
  }
}

var chatContainer = connect(null, mapDispatchToProps)(Chat);

export default chatContainer;
