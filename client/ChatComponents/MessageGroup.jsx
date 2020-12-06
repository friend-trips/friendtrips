import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatMessage from './ChatMessage.jsx';

const ChatBlock = styled.div`
  padding: 5px;
  border: .5px solid black;
`;
const ChatBlockHeader = styled.header`

`;
const H3 = styled.h3`
  margin: 0;
`;

const MessageGroup = ({ group, showThread }) => {
  return (
    <ChatBlock>
      <ChatBlockHeader>
        <H3>{group[0].username}</H3>
      </ChatBlockHeader>
      {group.map((chatmsg) => (
        <ChatMessage handleClick={showThread} message={chatmsg} />
      ))}
    </ChatBlock>
  );
};

export default MessageGroup;