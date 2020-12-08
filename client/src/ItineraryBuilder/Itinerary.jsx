import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import axios from 'axios';
import ItinerarySuggestion from './ItinerarySuggestion.jsx';
// import OneSuggestion from '../Flights/OneSuggestion.jsx'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

// min-height: 100%;

const DropZone = styled.ul`
  min-height: 20%;
  width: 90%;
  background-color: lightblue;
  list-style: none;
  height: 300px;
  overflow-y: scroll;
  align-items: center;
`

const Itinerary = ({ flights, hotels}) => {
  return (
    <Container>
      Itinerary
      <h3>Flights</h3>
      <Droppable droppableId={'flights'}>
        {(provided) => {
          return (
            <DropZone
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {flights.map((data, index) => (
                <ItinerarySuggestion data={data} index={index} />
              ))}
              {/* {flights.map((el, i) => (
                <Suggestion data={el} index={i} />
              ))} */}
            </DropZone>
          )
        }}
      </Droppable>

      <h3>Hotels</h3>
      {/* <Droppable droppableId={'hotels'}>
        {(provided) => {
          return (
            <DropZone
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {hotels.map((el, i) => (
                <ItinerarySuggestion data={el} index={i} />
              ))}
              {provided.placeholder}
            </DropZone>
          )
        }}
      </Droppable> */}
    </Container>
  );
};

export default Itinerary;