import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import ItineraryFlightSuggestion from './ItineraryFlightSuggestion.jsx';
import ItineraryHotelSuggestion from './ItineraryHotelSuggestion.jsx';

const Container = styled.div`
  display: flex;
  height: 100%;
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
  border-bottom: 1px solid black;
`;
const Select = styled.select`
  margin:0;
  padding: 0;
  width: 100%;
`;
const FlightContainer = styled.div`
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  margin-top: 3%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid black;
  border-right: 1px solid black;
  border-top: 1px solid black;
  width: 94%;
  overflow-y: scroll;
  height: 50%;
  align-items: center;
  margin-right: 2%;
  padding: 2%;
`;
const HotelContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid black;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  width: 94%;
  overflow-y: scroll;
  height: 50%;
  align-items: center;
  margin-bottom: 3%;
  margin-right: 2%;
  padding: 2%;
  align-items: center;
  border-bottom-right-radius: 15px;
  border-bottom-left-radius: 15px;
`;
const List = styled.ul`
  margin: 0;
  list-style: none;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
`;

const SuggestionList = ({ flights, hotels, getSavedItinerary, selectedTrip }) => {
  const [selectedItin, setSelectedItin] = useState("Jorge's Itinerary");
  return (
    <Container>
      <Header>
        <H3>Group Suggestions</H3>
      </Header>
      <Subheader>
          <Select onChange={(e) => { getSavedItinerary(e) }} value={selectedTrip.trip_id}>
            <option value={1}> All Itineraries </option>
            <option value={2}> Harrison's Itinerary </option>
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