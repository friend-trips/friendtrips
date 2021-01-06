import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import SuggestionList from './SuggestionList.jsx';
import Itinerary from './Itinerary.jsx';
import axios from 'axios';
import { ApplicationContext } from '../components/providers/ApplicationProvider.jsx'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  width: 100%;
`;

const Section = styled.section`
  display: flex;
  flex-direction: row;
  position: absolute;
  height: 100%;
  width: 100%;
`;

const ItineraryBuilder = ({ flightSuggestions, hotelSuggestions, getSavedFlights, getSavedHotels, selectedTrip }) => {

  //a list of flight suggestions
  const [flights, setFlights] = useState(flightSuggestions)
  //a list of flight suggestions
  const [hotels, setHotels] = useState(hotelSuggestions)
  //list of items to display
  const [displayedItems, setDisplayedItems] = useState([]);

  const appContext = useContext(ApplicationContext)

  const getSavedItinerary = (e) => {
    console.log('searchedFor', e.target.value)
    e.preventDefault();
    axios.get(`http://morning-bayou-59969.herokuapp.com/api/itinerary/?itinerary_id=${e.target.value}&trip_id=${selectedTrip.trip_id}`)
      .then(({ data }) => {
        console.log('got saved itin', data)
        let { flights, hotels } = data;
        let itineraryToDisplay = flights.concat(hotels);
        setDisplayedItems(itineraryToDisplay);
      })
      .catch(console.log)
  }

  useEffect(() => {
    if (flightSuggestions.length === 0) {
      getSavedFlights((flights) => {
        setFlights(flights)
      });
    }
    if (hotelSuggestions.length === 0) {
      getSavedHotels((hotels) => {
        setHotels(hotels)
      })
    }
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
        itemWeDropped = remainingHotelSuggestions.splice(source.index, 1)[0];
        setHotels(remainingHotelSuggestions);
      }
      //...then add the item to the list of selected/displayed items
      let currentDisplayedItems = displayedItems;
      currentDisplayedItems.splice(destination.index, 0, itemWeDropped)
      setDisplayedItems(currentDisplayedItems);
    }

    //handle reordering
    if (source.droppableId === destination.droppableId && source.index !== destination.index) {
      let itemYouAreHolding = displayedItems[source.index];
      let itemsToDisplay = displayedItems;
      itemsToDisplay.splice(source.index, 1);
      itemsToDisplay.splice(destination.index, 0, itemYouAreHolding);
      itemsToDisplay = itemsToDisplay.filter((item) => item);
      setDisplayedItems(itemsToDisplay);
    }
  }

  const resetSelectedSuggestions = () => {
    let hotelSuggestions = hotels;
    let flightSuggestions = flights;
    for (let i = 0; i <= displayedItems.length - 1; i++) {
      if (displayedItems[i].meta) {
        flightSuggestions.push(displayedItems[i])
      } else {
        hotelSuggestions.push(displayedItems[i])
      }
    }
    setDisplayedItems([]);
    setHotels(hotelSuggestions);
    setFlights(flightSuggestions);
  }

  return (

    <Container>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Section>
          {/* <button onClick={()=>{console.log('click')}}>Save Itinerary</button> */}
          <Itinerary itemsToDisplay={displayedItems} resetSelectedSuggestions={resetSelectedSuggestions} />
          <SuggestionList selectedTrip={selectedTrip} flights={flights} hotels={hotels} getSavedItinerary={getSavedItinerary} />
        </Section>
      </DragDropContext>
    </Container>

  )
}

export default ItineraryBuilder;
