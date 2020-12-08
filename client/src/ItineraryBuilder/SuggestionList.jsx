import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import ItinerarySuggestion from './ItinerarySuggestion.jsx'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  width: 50%;
  overflow-y: scroll;
`;

const List = styled.ul`
  margin: 0;
  list-style: none;
  height: 50%;
  width: 100%;
  overflow-y: scroll;
`;

const SuggestionList = ({ flights, hotels }) => {
  return (
    <Container>
      Suggestions
      <h3>Flights</h3>
        <Droppable droppableId={'flightItems'}>
          {(provided) => {
            return (
              <List
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{backgroundColor: 'transparent', border: '1px solid black' }}
                className={'droppable-col'}
              >
                {flights.map((row, ind) => (
                  <ItinerarySuggestion data={row} key={`flight-${ind}`} index={ind}></ItinerarySuggestion>
                ))}
                {provided.placeholder}
              </List>
            )
          }}
        </Droppable>

      <h3>Hotels</h3>
        <Droppable droppableId={'hotelItems'}>
          {(provided) => {
            return (
              <List
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ height: '100px', width: '100px', backgroundColor: 'transparent', border: '1px solid black' }}
                className={'droppable-col'}
              >
                {hotels.map((row, ind) => (
                  <ItinerarySuggestion data={row} key={`flight-${ind}`} index={ind}></ItinerarySuggestion>
                ))}
                {provided.placeholder}
              </List>
            )
          }}
        </Droppable>

    </Container>
  );
};

export default SuggestionList;