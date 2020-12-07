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
  border: 1px solid black;
`;

const ChatWindow = styled.div`
  height: 90%;
  overflow-y: scroll;
  overflow-x: wrap;
  border: 1px solid black;
  padding-left: 10px;
`;

const ChatForm = styled.form`
  position: relative;
  height: 50px;
  padding: 0px;
  margin: 0px;
  width: 100%;
`;

const Input = styled.input`
  position: absolute;
  margin: 0px;
  padding: 0px;
  width: 89.5%;
  height: 90%;
`;

const Button = styled.button`
  position: absolute;
  height: 100%;
  width: 10%;
  right: 0;
  font-size: 18px;
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
      // let sorted = groupMessages(newMsgs)
      // setChatMessages(sorted);
      setChatMessages(groupMessages(newMsgs));
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
        {(chatMessages) ? chatMessages.map((group) => {
          if (group.type === 'flight') {
            return <div>aFlight</div>
          } else if (group.type === 'message') {
            return <MessageGroup group={group} showThread={showThread}></MessageGroup>
          }
        }) : <h1>Loading...</h1>}
        <div ref={messagesEndRef} />
        {(threadDisplay) ? <MessageThread main={thread} hideThread={hideThread} replyToMsg={replyToMsg} /> : null}
      </ChatWindow>
      <ChatForm onSubmit={sendMsg}>
        <Input value={msg} onChange={(e) => { setMsg(e.target.value) }}></Input>
        <Button type='submit'> &#8680; </Button>
      </ChatForm>
      Connected users: {connectedUserCount}
    </Container>
  );
};

export default Chat;