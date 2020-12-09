import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';

import axios from 'axios';
import ItineraryFlightSuggestion from './ItineraryFlightSuggestion.jsx';
import ItineraryHotelSuggestion from './ItineraryHotelSuggestion.jsx';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 70%;
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
const Subheader = styled.div`
  width: 100%;
  min-height: 2.5%;
  border-bottom: 1px solid black;
`
const Button = styled.button`
  margin: 0;
  padding: 0;
`;

const ClearSelections = styled.button`
  position: absolute;
  right: 2%;
  top: 2%;
  margin: 0;
  padding: 4px;
  border: 1px solid black;
  border-radius: 5px;
`;
const Save = styled.button`
  position: absolute;
  left: 2%;
  top: 2%;
  margin: 0;
  padding: 4px;
  border: 1px solid black;
  border-radius: 5px;
`;

const H3 = styled.h3`
  margin: 0;
  padding: 0;
`;

const DropZone = styled.ul`
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 20%;
  width: 90%;
  margin-left: 2%;
  // background-color: lightblue;
  border: 1px solid black;
  border-radius: 15px;
  list-style: none;
  height: 100%;
  overflow-y: scroll;
  align-items: center;
`

const Itinerary = ({ itemsToDisplay, resetSelectedSuggestions }) => {

  return (
    <Container>
      <Header>
        <H3>Itinerary Builder</H3>
      </Header>
      <Subheader><Button onClick={() => { console.log('click') }}>Save Itinerary</Button></Subheader>
      <Droppable droppableId={'itinerary'}>
        {(provided) => {
          return (
            <DropZone
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <ClearSelections onPress={resetSelectedSuggestions}>Save</ClearSelections>
              {itemsToDisplay ? itemsToDisplay.map((data, index) => {
                if (data) {
                  if (data.meta) {
                    return (<ItineraryFlightSuggestion data={data} index={index} />)
                  } else {
                    return (<ItineraryHotelSuggestion data={data} index={index} />)
                  }
                }
              }) : null}
              <ClearSelections onPress={resetSelectedSuggestions}>Clear Selections</ClearSelections>
            </DropZone>
          )
        }}
      </Droppable>
    </Container>
  );
};

export default Itinerary;