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
  width: 100%;
  margin-left: 1%;
  margin-right: 1%;
  // background-color: lightblue;
  border: 1px solid black;
  list-style: none;
  height: 50%;
  overflow-y: scroll;
  align-items: center;
`

const Itinerary = ({itemsToDisplay}) => {
  return (
    <Container>
      <Header>
        <H3>Itinerary Builder</H3>
      </Header>

      <Droppable droppableId={'itinerary'}>
        {(provided) => {
          return (
            <DropZone
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {itemsToDisplay ? itemsToDisplay.map((data, index) => {
                if (data.username) {
                  return (<ItineraryHotelSuggestion data={data} index={index} />)
                  // // meta) {
                  // return (<ItineraryFlightSuggestion data={data} index={index} />)
                } if (data.meta) {
                  return (<ItineraryFlightSuggestion data={data} index={index} />)

                  // return (<ItineraryHotelSuggestion data={data} index={index} />)
                }
              }) : null}
            </DropZone>
          )
        }}
      </Droppable>
    </Container>
  );
};

export default Itinerary;