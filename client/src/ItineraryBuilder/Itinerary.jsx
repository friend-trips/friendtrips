import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Suggestion from './Suggestion.jsx';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  width: 50%;
  min-height: 100%;
`;

const DropZone = styled.ul`
  min-height: 20%;
  width: 90%;
  background-color: lightblue;
  list-style: none;
`

const Itinerary = ({ flights, hotels }) => {
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
              {flights.map((el, i) => (
                <Suggestion data={el} index={i} />
              ))}
            </DropZone>
          )
        }}
      </Droppable>

      <h3>Hotels</h3>
      <Droppable droppableId={'hotels'}>
        {(provided) => {
          return (
            <DropZone
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {hotels.map((el, i) => (
                <Suggestion data={el} index={i} />
              ))}
              {provided.placeholder}
            </DropZone>
          )
        }}
      </Droppable>
    </Container>
  );
};

export default Itinerary;