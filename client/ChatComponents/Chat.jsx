import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';

import MessageGroup from './MessageGroup.jsx'
import MessageThread from './MessageThread.jsx'


const Container = styled.div`
  height: 100%;
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
const socket = io({
  path: '/socket.io',
  auth: {
    token: ''
  },
  autoConnect: false
});

const Chat = ({ authUser }) => {
  const [connectedUserCount, setConnectedUserCount] = useState(0);
  const [msg, setMsg] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [user, setUser] = useState(authUser);
  const [threadDisplay, setThreadDisplay] = useState(false)
  const [thread, setThread] = useState(null)

  useEffect(() => {
    //set username as 'token' in auth socket auth object
    socket.auth.token = user;
    console.log('mounting chat user', user)
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
      let sorted = groupMessages(newMsgs)
      setChatMessages(sorted);
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
      setThread(chatMessages[thread.id])
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
    // console.log(msg, comment);
    socket.emit('comment', msg, comment);
  }

  //use react ref to keep track of the 'bottom' of the chat list
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  const groupMessages = (messages) => {
    if (messages.length === 0) return;
    let groupedMessages = [];
    let currentGroup = [];
    let last = messages[0];
    for (let i = 0; i <= messages.length - 1; i++) {
      if (messages[i].username === last.username) {
        currentGroup.push(messages[i]);
      } else {
        groupedMessages.push(currentGroup);
        currentGroup = [messages[i]];
      }
      last = messages[i]
      if (i === messages.length - 1 && currentGroup.length > 0) {
        groupedMessages.push(currentGroup);
      }
    }
    return groupedMessages;
  }

  return (
    <Container>
      <ChatWindow>
        {(chatMessages) ? chatMessages.map((group) => (
          <MessageGroup group={group} showThread={showThread}></MessageGroup>
        )) : <h1>Loading...</h1>}
        <div ref={messagesEndRef} />
        {(threadDisplay) ? <MessageThread main={thread} hideThread={hideThread} replyToMsg={replyToMsg} /> : null}
      </ChatWindow>
      <ChatForm onSubmit={sendMsg}>
        <Input value={msg} onChange={(e) => { setMsg(e.target.value) }}></Input>
        <Button type='submit'> &#8680; </Button>
      </ChatForm>
      <p>Connected users: {connectedUserCount}</p>
    </Container>
  );
};

export default Chat;