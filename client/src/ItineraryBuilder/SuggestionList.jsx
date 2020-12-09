import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import ItineraryFlightSuggestion from './ItineraryFlightSuggestion.jsx';
import ItineraryHotelSuggestion from './ItineraryHotelSuggestion.jsx';

const Container = styled.div`
  display: flex;
  flex-direction: column;
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

const FlightContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  width: 100%;
  overflow-y: scroll;
  height: 600px;
  align-items: center;
`;

const HotelContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  width: 100%;
  overflow-y: scroll;
  height: 600px;
  align-items: center;
`;

const List = styled.ul`
  margin: 0;
  list-style: none;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
`;

const SuggestionList = ({ flights, hotels }) => {
  return (
    <Container>
      <Header>
        <H3>Group Suggestions</H3>
      </Header>

      <FlightContainer>
        <h3>Flights</h3>
        <Droppable droppableId={'flightItems'}>
          {(provided) => {
            return (
              <List
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{border: '1px solid black' }}
                className={'droppable-col'}
              >
                {flights.map((row, ind) => (
                  <ItineraryFlightSuggestion data={row} key={`flight-${ind}`} index={ind}></ItineraryFlightSuggestion>
                ))}
                {/* {provided.placeholder} */}
              </List>
            )
          }}
        </Droppable>
      </FlightContainer>
      <HotelContainer>
        <h3>Hotels</h3>
        <Droppable droppableId={'hotelItems'}>
          {(provided) => {
            return (
              <List
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{border: '1px solid black' }}
                className={'droppable-col'}
              >
                {hotels.map((row, ind) => (
                  <ItineraryHotelSuggestion data={row} key={`hotel-${ind}`} index={ind}></ItineraryHotelSuggestion>
                ))}
                {/* {provided.placeholder} */}
              </List>
            )
          }}
        </Droppable>
      </HotelContainer>

    </Container>
  );
};

export default SuggestionList;