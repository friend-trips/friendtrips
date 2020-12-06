import React, { useState } from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';

import SuggestionList from './SuggestionList.jsx';
import Itinerary from './Itinerary.jsx';

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const App = () => {

  const [flights, setFlights] = useState([
    { id: 3, type: 'flight' },
    { id: 2, type: 'flight' },
    { id: 1, type: 'flight' }
  ])

  const [hotels, setHotels] = useState([
    { id: 4, type: 'hotel' },
    { id: 5, type: 'hotel' },
    { id: 6, type: 'hotel' },
    { id: 7, type: 'hotel' }
  ])


  const [selectedFlights, setSelectedFlights] = useState([]);
  const [selectedHotels, setSelectedHotels] = useState([]);

  const handleDragEnd = (dragEvent) => {
    let { destination, source } = dragEvent
    if (!destination) {
      //item wasn't dropped on a droppable area
      return
    }
    if (destination.index === source.index && destination.droppableId === source.droppableId) {
      //item didn't move
      return
    }
    //use destination.index and source.index to decide ordering
    if (source.droppableId === 'flightItems' && destination.droppableId === 'flights') {
      let currentSelections = selectedFlights;
      currentSelections.splice(destination.index, 0, flights[source.index])
      // currentSelections.push(flights[source.index])
      setSelectedFlights(currentSelections);

      let remainingFlightSuggestions = flights;
      remainingFlightSuggestions.splice(source.index, 1);
      setFlights(remainingFlightSuggestions);
    }

    if (source.droppableId === 'hotelItems' && destination.droppableId === 'hotels') {
      let currentSelections = selectedHotels;
      currentSelections.splice(destination.index, 0, hotels[source.index])
      // currentSelections.push(hotels[source.index])
      setSelectedHotels(currentSelections);

      let remainingHotelSuggestions = hotels;
      remainingHotelSuggestions.splice(source.index, 1);
      setHotels(remainingHotelSuggestions);
    }

    if (source.droppableId === destination.droppableId && source.index !== destination.index) {
      if (source.droppableId === 'hotels') {
        let itemYouAreHolding = selectedHotels[source.index];
        let hotelCopy = selectedHotels;
        hotelCopy.splice(source.index, 1);
        hotelCopy.splice(destination.index, 0, itemYouAreHolding);
        setSelectedHotels(hotelCopy);
      } else if (source.droppableId === 'flights') {
        let itemYouAreHolding = selectedFlights[source.index];
        let flightCopy = selectedFlights;
        flightCopy.splice(source.index, 1);
        flightCopy.splice(destination.index, 0, itemYouAreHolding);
        setSelectedFlights(flightCopy);
      }
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Container>
        <Itinerary flights={selectedFlights} hotels={selectedHotels}/>
        <SuggestionList flights={flights} hotels={hotels}/>
      </Container>
    </DragDropContext>
  )
}

export default App;
