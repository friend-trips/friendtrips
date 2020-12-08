import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import axios from 'axios';
import ItineraryFlightSuggestion from './ItineraryFlightSuggestion.jsx';
import ItineraryHotelSuggestion from './ItineraryHotelSuggestion.jsx';

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
  height: 50%;
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
                <ItineraryFlightSuggestion data={data} index={index} />
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
              {hotels.map((data, index) => (
                <ItineraryHotelSuggestion data={data} index={index} />
              ))}
            </DropZone>
          )
        }}
      </Droppable>
    </Container>
  );
};

export default Itinerary;