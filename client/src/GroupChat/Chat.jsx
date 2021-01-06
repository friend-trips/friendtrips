import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import groupMessages from '../lib/chatFeedParser.js'

import { AuthContext } from '../components/providers/AuthenticationProvider.jsx'
import { ApplicationContext } from '../components/providers/ApplicationProvider.jsx'

import MessageGroup from './MessageGroup.jsx'
import MessageThread from './MessageThread.jsx'
import Suggestion from './Suggestion.jsx'

import useSocket from '../components/hooks/useSocket.js'


const Container = styled.div`
  height: 99%;
  width: 100%;
  position: relative;
`;

const ChatFrame = styled.div`
  position: relative;
  height: 99%;
  display: flex;
  flex-direction: column;
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
  top: 0;
  left: 0;
  right: 0;
  position: absolute;
  // height: 8%;
  height: 60px;
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

const Chat = ({connectedUserCount, chatFeed, thread, setChatFeed, updateThread }) => {
  const [msg, setMsg] = useState('');

  const appContext = useContext(ApplicationContext);

  useEffect(() => {
    scrollToBottom();
  }, [])

  const replyToMsg = (comment) => {
    appContext.emitChange('comment', comment)
  }
  const updateThreadComments = () => {
    for (let i = chatFeed.length - 1; i >= 0; i--) {
      if (chatFeed[i].type === 'message') {
        for (let j = 0; j <= chatFeed[i].messages.length - 1; j++) {
          if (thread.message_id === chatFeed[i].messages[j].message_id) {
            updateThread(chatFeed[i].messages[j])
            return;
          }
        }
      }
    }
  }
  useEffect(() => {
    if (thread) {
      updateThreadComments();
    } else {
      scrollToBottom();
    }
  }, [chatFeed])

  const writeMsg = (message) => {
    let newMsg = msg + message;
    setMsg(newMsg);
  }
  const sendMsg = (e) => {
    e.preventDefault();
    appContext.emitChange('message', msg);
    setMsg('');
  }

  //use react ref to keep track of the 'bottom' of the chat list
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <Container>
      <ChatFrame>
        <ChatHeader>Chat!</ChatHeader>
        <ChatWindow >
          {(chatFeed) ? chatFeed.map((group, i) => {
            if (group.type !== 'message') {
              return <Suggestion data={group} />
            } else if (group.type === 'message') {
              return <MessageGroup group={group} showThread={updateThread}></MessageGroup>
            }
          }) : <h1>Loading...</h1>}
          <div ref={messagesEndRef} />
          {(thread !== null) ? <MessageThread main={thread} hideThread={updateThread} replyToMsg={replyToMsg} /> : null}
        </ChatWindow>
        <ChatForm onSubmit={sendMsg}>
          <Input value={msg} onChange={(e) => { setMsg(e.target.value) }}></Input>
          <Button type='submit'> &#8680; </Button>
        </ChatForm>
        <Info>
          Connected users: {connectedUserCount}
        </Info>
      </ChatFrame>
    </Container>
  );
};

export default Chat;