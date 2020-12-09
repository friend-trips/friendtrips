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

const App = () => {
  //a list of flight suggestions
  const [flights, setFlights] = useState([])
  //a list of flight suggestions
  const [hotels, setHotels] = useState([])
  //list of items to display
  const [displayedItems, setDisplayedItems] = useState([]);
  const [savedItems, setSavedItems] = useState([])
  // const [suggestedIds, setSuggestedIds] = useState({})

  const appContext = useContext(ApplicationContext)
  // const [selectedFlights, setSelectedFlights] = useState([]);
  // const [selectedHotels, setSelectedHotels] = useState([]);

  const getSavedFlightResults = async () => {
    await axios.get(`http://morning-bayou-59969.herokuapp.com/flights/?trip_id=${appContext.selectedTrip.trip_id}`)
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
    await axios.get(`http://morning-bayou-59969.herokuapp.com/hotels/?trip_id=${appContext.selectedTrip.trip_id}`)
      .then(({ data }) => {
        let savedArray = [];
        for (let keys in data) {
          savedArray.push(data[keys])
        }
        console.log(savedArray, "hotels saved array")
        setHotels(savedArray)
      })
      .catch(console.log)
  }

  const getSavedItinerary = async (e) => {
    console.log('searchedFor', e.target.value)
    e.preventDefault();
    await axios.get(`http://morning-bayou-59969.herokuapp.com/api/itinerary/?itinerary_id=${e.target.value}&trip_id=${appContext.selectedTrip.trip_id}`)
      .then(({ data }) => {
        let { flights, hotels } = data;
        let itineraryToDisplay = flights.concat(hotels);
        setDisplayedItems(itineraryToDisplay);
      })
      .catch(console.log)
  }

  useEffect(() => {
    getSavedFlightResults();
    getSavedHotelResults();
    getSavedItinerary();
    getSavedItineraryList()
  }, [])

  const postSavedItinerary = async () => {
    let itineraryObj = {};
    itineraryObj.itinerary_id = 3;
    if (displayedItems) {
      for (let i = 0; i < displayedItems.length; i++) {
        if (displayedItems[i].meta) {
          itineraryObj.suggestion_id = displayedItems[i].meta.suggestion_id
        } else {
          itineraryObj.suggestion_id = displayedItems[i].suggestion_id;
        }
      }
    }
    console.log(itineraryObj, "itineraryobj")
    // const itineraryData =  {...displayedItems};

    await axios.post(`http://morning-bayou-59969.herokuapp.com/api/itinerary`, itineraryObj)
      .then((response) => {
        console.log("saved in db", response)
      })
      .catch(console.log)
  }


  const getSavedItineraryList = async () => {
    await axios.get(`http://morning-bayou-59969.herokuapp.com/api/itinerary/?itinerary_id=${appContext.selectedTrip.itinerary_id}&trip_id=${appContext.selected.trip_id}`)
      .then(({ data }) => {
        setSavedItems(data)
      })
      .catch(console.log)
  }


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
      if (source.droppableId === 'hotelItems')  {
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

  return (

    <Container>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Section>
          {/* <button onClick={()=>{console.log('click')}}>Save Itinerary</button> */}
          <Itinerary itemsToDisplay={displayedItems} postSavedItinerary={postSavedItinerary}/>
          <SuggestionList flights={flights} hotels={hotels} getSavedItinerary={getSavedItinerary}/>
        </Section>
      </DragDropContext>
    </Container>

  )
}

export default App;
