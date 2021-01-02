import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatMessage from './ChatMessage.jsx';

import HotelSuggestion from '../Hotels/OneSuggestion.jsx'
import FlightSuggestion from '../Flights/OneSuggestion.jsx'

const ChatBlock = styled.div`
  width: 98%;
  padding: 2%;
  border-bottom: .5px solid black;
  display: flex;
  flex-direction: row;
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

const Suggestion = ({ data }) => {
  return (
    <ChatBlock>
      <ChatBlockHeader>
        {(data.type === 'flight') ?
        <H3>{data.meta.username}</H3>
        : <H3>{data.username}</H3>
      }
      </ChatBlockHeader>
      <Messages>
      {(data.type === 'flight') ?
        <FlightSuggestion data={data}/>
        : <HotelSuggestion data={data}/>
      }

      </Messages>
    </ChatBlock>
  );
};

export default Suggestion;