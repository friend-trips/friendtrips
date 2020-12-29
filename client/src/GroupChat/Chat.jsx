import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import socket from '../lib/chatSocket.js'

import { AuthContext } from '../components/providers/AuthenticationProvider.jsx'
import MessageGroup from './MessageGroup.jsx'
import MessageThread from './MessageThread.jsx'
import Suggestion from './Suggestion.jsx'

import groupMessages from '../lib/chatFeedParser.js'

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
  z-index: 1;
  margin: 0;
  padding-left: 2%;
  top: 1%;
  left: 22.7%;
  right: 1%;
  position: fixed;
  height: 8%;
  border-bottom: .5px solid black;
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

const Input = styled.input`
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

const Chat = ({chatFeed, thread, setChatFeed, updateThread}) => {
  const [connectedUserCount, setConnectedUserCount] = useState(0);
  const [msg, setMsg] = useState('');

  const authContext = useContext(AuthContext);
  console.log('CHATLOADED', chatFeed, thread)
  useEffect(() => {
    //set username as 'token' in auth socket auth object
    socket.auth.user_id = authContext.user;
    socket.auth.username = authContext.username;
    console.log('mounting chat user', authContext.user, authContext.username)
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
      setChatFeed(groupMessages(Object.values(newMsgs)));
    })
    socket.on('action', (someAction) => {
      console.log('socketACTION,', someAction)
    })

    //clean up socket connection when the component unmounts
    return () => {
      socket.disconnect();
    }
  }, [])

  useEffect(() => {
    // if (threadState) {
      // updateThread();
    // } else {
      scrollToBottom();
    // }
  }, [chatFeed])

  const writeMsg = (message) => {
    let newMsg = msg + message;
    setMsg(newMsg);
  }
  const sendMsg = (e) => {
    e.preventDefault();
    // sendChat(msg)
    socket.emit('message', msg);
    setMsg('');
  }

  //use react ref to keep track of the 'bottom' of the chat list
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }


  return (
    <Container>
      <ChatWindow>
        <ChatHeader>Chat!</ChatHeader>
        {(chatFeed) ? chatFeed.map((group, i) => {
          if (group.type !== 'message') {
            return <Suggestion data={group}/>
          } else if (group.type === 'message') {
            return <MessageGroup group={group} showThread={updateThread}></MessageGroup>
          }
        }) : <h1>Loading...</h1>}
        <div ref={messagesEndRef} />
        {(thread) ? <MessageThread main={thread} /> : null}
      </ChatWindow>
      <ChatForm onSubmit={sendMsg}>
        <Input value={msg} onChange={(e) => { setMsg(e.target.value) }}></Input>
        <Button type='submit'> &#8680; </Button>
      </ChatForm>
      <Info>
        Connected users: {connectedUserCount}
      </Info>
    </Container>
  );
};

export default Chat;