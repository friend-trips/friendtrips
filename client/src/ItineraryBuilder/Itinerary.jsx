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
  position: relative;
`;

const Header = styled.header`
  min-height: 10%;
  border-bottom: 1px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const H3 = styled.h3`
  margin: 0;
  padding: 0;
`;

const DropZone = styled.ul`
  position: relative;
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
      <Header>
        <H3>Itinerary Builder</H3>
      </Header>
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