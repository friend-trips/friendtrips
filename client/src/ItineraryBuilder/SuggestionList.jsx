import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Suggestion from './Suggestion.jsx'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  width: 50%;
  height: 100%;
`;

const List = styled.ul`
  margin: 0;
  padding: 10px;
  list-style: none;
  width: 100%;
  height: 30%;
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
                style={{ height: '100px', width: '100px', backgroundColor: 'transparent', border: '1px solid black' }}
                className={'droppable-col'}
              >
                {flights.map((row, ind) => (
                  <Suggestion data={row} key={`flight-${ind}`} index={ind}></Suggestion>
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
                  <Suggestion data={row} key={`flight-${ind}`} index={ind}></Suggestion>
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