import React, { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';

import { AuthContext } from '../components/providers/AuthenticationProvider.jsx'
import MessageGroup from './MessageGroup.jsx'
import MessageThread from './MessageThread.jsx'


const Container = styled.div`
  height: 99%;
  width: 100%;
  position: relative;
`;

const ChatWindow = styled.div`
  position: relative;
  height: 90%;
  overflow-y: scroll;
  overflow-x: wrap;
  border-bottom: 1px solid black;
  // padding-left: 10px;
`;

const ChatHeader = styled.header`
  margin: 0;
  padding-left: 2%;
  top: 1%;
  left: 22.75%;
  right: 1%;
  position: fixed;
  height: 8%;
  border-bottom: 1px solid black;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
`;

const ChatForm = styled.form`
  position: relative;
  height: 5%;
  padding: 1%;
  margin: 0px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const TextArea = styled.textarea`
  position: relative;
  width: 88%;
  height: 60%;
  padding: 0;
  padding-top: .5%;
  padding-bottom: .5%;
  margin: 0;
`;

const Button = styled.button`
  position: relative;
  height: 100%;
  width: 5%;
  font-size: 18px;
`;

const Info = styled.div`
  position: relative;
  margin-left: 1%;
`;


//set up socket outside of react component, we don't want to socket to reload/refresh connection every time the component refreshes
const socket = io('http://localhost:4000', {
  path: '/socket.io',
  auth: {
    token: ''
  },
  autoConnect: false
});

// const socket = io('http://localhost:4000', {
//   path: '/chat/socket.io',
//   auth: {
//     token: ''
//   },
//   autoConnect: false
// });

const Chat = () => {
  const [connectedUserCount, setConnectedUserCount] = useState(0);
  const [msg, setMsg] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [threadDisplay, setThreadDisplay] = useState(false)
  const [thread, setThread] = useState(null)

  const authContext = useContext(AuthContext);

  useEffect(() => {
    //set username as 'token' in auth socket auth object
    socket.auth.user_id = authContext.user;
    socket.auth.username = authContext.username;
    console.log('mounting chat user', authContext.user)
    //actually connect to socket server
    socket.connect();
    //set up event listeners on the socket
    socket.on('connect', () => {
      socket.emit('greeting');
    })
    socket.on('connectedUsers', (newconnectedUserCount) => {
      setConnectedUserCount(newconnectedUserCount);
    })
    socket.on('updatedMessages', (newMsgs) => {
      console.log('new messages received');
      setChatMessages(groupMessages(Object.values(newMsgs)));
    })

    //clean up socket connection when the component unmounts
    return () => {
      socket.disconnect();
    }
  }, [])

  useEffect(() => {
    if (threadDisplay) {
      updateThread();
    } else {
      scrollToBottom();
    }
  }, [chatMessages])

  const updateThread = () => {
    if (threadDisplay) {
      setThread(chatMessages[thread.message_id])
    }
  }
  const writeMsg = (message) => {
    let newMsg = msg + message;
    setMsg(newMsg);
  }
  const sendMsg = (e) => {
    e.preventDefault();
    socket.emit('message', msg)
    setMsg('');
  }
  const enterUsername = (letter) => {
    let newMsg = msg + letter;
    setUsername(newMsg);
  }
  const showThread = (msg) => {
    setThreadDisplay(true);
    setThread(msg)
  }
  const hideThread = () => {
    setThreadDisplay(false);
    setThread(null);
  }
  const replyToMsg = (msg, comment) => {
    console.log(msg, comment);
    //TODO: get trip_id from context
    socket.emit('comment', msg, comment);
  }

  //use react ref to keep track of the 'bottom' of the chat list
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  const groupMessages = (messages) => {
    if (!messages) return null;
    let results = [];
    let currentGroup = {
      isFlight: false,
      messages: [],
      username: ''
    };
    let last = messages[0];
    for (let i = 0; i <= messages.length - 1; i++) {
      let current = messages[i];
      if (messages[i].type === 'message') {
        if (messages[i].username === last.username) {
          currentGroup.messages.push(messages[i]);
        } else {
          currentGroup.username = last.username;
          currentGroup.type = 'message';
          results.push(currentGroup);
          currentGroup = {
            isFlight: false,
            messages: [messages[i]],
            username: ''
          }
        }
        last = messages[i];
        if (i === messages.length - 1 && currentGroup.messages.length > 0) {
          currentGroup.type = 'message';
          results.push(currentGroup);
        }
      } else {
        current.isFlight = true;
        results.push(current);
      }
    }
    console.log('we turned', messages.length, 'messages')
    console.log('into', results.length, 'groups');
    return results;
  }
  return (
    <Container>
      <ChatWindow>
        <ChatHeader>Chat!</ChatHeader>
        {(chatMessages) ? chatMessages.map((group, i) => {
          console.log(group.type, i)
          if (group.type === 'flight') {
            return <div>aFlight</div>
          } else if (group.type === 'message') {
            return <MessageGroup group={group} ></MessageGroup>
          }
        }) : <h1>Loading...</h1>}
        <div ref={messagesEndRef} />
        {(threadDisplay) ? <MessageThread main={thread} hideThread={hideThread} replyToMsg={replyToMsg} /> : null}
      </ChatWindow>
      <ChatForm onSubmit={sendMsg}>
        <TextArea value={msg} onChange={(e) => { setMsg(e.target.value) }}></TextArea>
        <Button type='submit'> &#8680; </Button>
      </ChatForm>
      <Info>
        Connected users: {connectedUserCount}
      </Info>
    </Container>
  );
};

export default Chat;