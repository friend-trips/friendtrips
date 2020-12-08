import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import SuggestionList from './SuggestionList.jsx';
import Itinerary from './Itinerary.jsx';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const App = () => {

  const [flights, setFlights] = useState([])
  const [hotels, setHotels] = useState([])
  const [selectedFlights, setSelectedFlights] = useState([]);
  const [selectedHotels, setSelectedHotels] = useState([]);

  const getSavedFlightResults = async () => {
    await axios.get("http://morning-bayou-59969.herokuapp.com/flights/?trip_id=1")
      .then((data) => {
        console.log(data)
        let savedArray = [];
        for (let keys in data.data) {
          savedArray.push(data.data[keys])
        }
        console.log(savedArray, "flights saved array")
        setFlights(savedArray)
      })
      .catch(console.log)
   }

  const getSavedHotelResults = async () => {
    await axios.get("http://morning-bayou-59969.herokuapp.com/hotels/?trip_id=1")
      .then(({data}) => {
        let savedArray = [];
        console.log("data ", data)
        for (let keys in data) {
          savedArray.push(data[keys])
        }
        console.log(savedArray, "hotels saved array")
        setHotels(savedArray)
      })
      .catch(console.log)
  }

   useEffect(() => {
    getSavedFlightResults();
    getSavedHotelResults()
   }, [])

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

  console.log(flights, "FLIGHTS")
  console.log(hotels, "HOTELS")
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
