import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatMessage from './ChatMessage.jsx';

const ChatBlock = styled.div`
  width: 100%;
  padding: 5px;
  border: .5px solid black;
  display: flex;
  flex-direction: row;
  // align-items: center;
  // justify-content: center;
`;
const ChatBlockHeader = styled.header`
  display: flex;
  flex-direction: column;
  // padding-left: 10%;
  width: 10%;
  justify-content: center;
  align-items: center;
`;
const H3 = styled.h3`
  margin: 0;
  font-weight: 300;
`;
const Messages = styled.div`
  width: 90%;
`;

const MessageGroup = ({ group, showThread }) => {
  console.log(group)
  return (
    <ChatBlock>
      <ChatBlockHeader>
        <H3>{group.username}</H3>
      </ChatBlockHeader>
      <Messages>
        {group.messages.map((chatmsg) => (
          <ChatMessage handleClick={showThread} message={chatmsg} />
        ))}
      </Messages>
    </ChatBlock>
  );
};

export default MessageGroup;