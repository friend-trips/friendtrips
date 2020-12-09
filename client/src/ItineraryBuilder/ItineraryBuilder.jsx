import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import SuggestionList from './SuggestionList.jsx';
import Itinerary from './Itinerary.jsx';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  height: 100%;
  width: 100%;
`;

const App = () => {
  //a list of flight suggestions
  const [flights, setFlights] = useState([])
  //a list of flight suggestions
  const [hotels, setHotels] = useState([])
  //list of items to display
  const [displayedItems, setDisplayedItems] = useState([]);

  // const [selectedFlights, setSelectedFlights] = useState([]);
  // const [selectedHotels, setSelectedHotels] = useState([]);

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
      .then(({ data }) => {
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

  //when drag ends, this function will be run with a dragEvent (referencing the item that you dragged)
  const handleDragEnd = (dragEvent) => {
    console.log('DRAG')
    let { destination, source } = dragEvent; //destructure the important information
    let itemWeDropped = null; //will contain the flight or suggestion we DnD'd
    if (!destination) {
      //item wasn't dropped on a droppable area
      return
    }
    if (destination.index === source.index && destination.droppableId === source.droppableId) {
      //item didn't move
      return
    }

    if (destination.droppableId === 'itinerary') {
      //remove the item you dragged from the list of suggestions...
      if (source.droppableId === 'flightItems') {
        let remainingFlightSuggestions = flights;
        itemWeDropped = remainingFlightSuggestions.splice(source.index, 1)[0];
        setFlights(remainingFlightSuggestions);
      }
      if (source.droppableId === 'hotelItems') {
        let remainingHotelSuggestions = hotels;
        itemWeDropped = remainingHotelSuggestions.splice(source.index, 1);
        setHotels(remainingHotelSuggestions);
      }
      //...then add the item to the list of selected/displayed items
      let currentDisplayedItems = displayedItems;
      currentDisplayedItems.splice(destination.index, 0, itemWeDropped)
      setDisplayedItems(currentDisplayedItems);
      console.log(currentDisplayedItems);
    }

    //handle reordering
    if (source.droppableId === destination.droppableId && source.index !== destination.index) {
      let itemYouAreHolding = displayedItems[source.index];
      let itemsToDisplay = displayedItems;
      itemsToDisplay.splice(source.index, 1);
      itemsToDisplay.splice(destination.index, 0, itemYouAreHolding);
      setDisplayedItems(itemsToDisplay);
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Container>
        <Itinerary itemsToDisplay={displayedItems} />
        <SuggestionList flights={flights} hotels={hotels} />
      </Container>
    </DragDropContext>
  )
}

export default App;
