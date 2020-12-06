import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display:flex;
  flex-direction: row;
`;
const ChatBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  padding: 10px;
  border-radius: 5px;
`;
const HoverDetails = styled.div`
  width: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Header = styled.header`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
`;
const Username = styled.h4`
  margin: 0;
  padding: 0;
`;

const Message = styled.p`

`;

const ChatMessage = ({ message, handleClick }) => {
  const [highlight, setHighlight] = useState(false);

  const toggleHighlight = () => {
    if (highlight) {
      setHighlight(false);
    } else {
      setHighlight(true);
    }
  }
  let style = {backgroundColor: (highlight) ? 'lightblue' : 'transparent'};
  let deetStyl = {backgroundColor: (highlight) ? 'lightgreen' : 'transparent'};
  return (
    <Container>
    <ChatBody onClick={() => { handleClick(message) }} onMouseOver={toggleHighlight} onMouseLeave={toggleHighlight} style={style}>
      <Message>{message.message}</Message>
    </ChatBody>
    {highlight ? <HoverDetails style={deetStyl}> {message.time}</HoverDetails> : null}

    </Container>
  );
};

export default ChatMessage;