import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import ItineraryFlightSuggestion from './ItineraryFlightSuggestion.jsx';
import ItineraryHotelSuggestion from './ItineraryHotelSuggestion.jsx';
import { ApplicationContext } from '../components/providers/ApplicationProvider.jsx'

const Container = styled.div`
  display: flex;
  height: 90%;
  flex-direction: column;
  position: relative;
  width: 34%;
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
const Subheader = styled.div`
  width: 100%;
  min-height: 2.5%;
`;
const Select = styled.select`
  margin:0;
  padding: 0;
  width: 100%;
`

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

const SuggestionList = ({ flights, hotels, getSavedItinerary }) => {
  const appContext = useContext(ApplicationContext);
  return (
    <Container>
      <Header>
        <H3>Group Suggestions</H3>
      </Header>
      <Subheader>
          <Select onChange={(e) => { console.log('clik'); getSavedItinerary(e) }} value={appContext.selectedTrip.trip_id}>
            <option value={1}> 1 </option>
            <option value={2}> 2 </option>
            <option value={3}> 3 </option>
          </Select>

      </Subheader>
      <FlightContainer>
        <h3>Flights</h3>
        <Droppable droppableId={'flightItems'}>
          {(provided) => {
            return (
              <List
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ backgroundColor: 'transparent', border: '1px solid black' }}
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
                style={{ backgroundColor: 'transparent', border: '1px solid black' }}
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