import React, { useState, useEffect, useRef } from 'react';
import { Draggable } from '@fullcalendar/interaction'
import styled from 'styled-components';
import moment from 'moment'

const Container = styled.div`
  position: relative;
  width: 15%;
  max-height: 90vh;
  margin-left: 1rem;
  overflow-y: scroll;
`;

const UL = styled.ul`
  display: ${props => props.show ? 'block' : 'none'};
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LI = styled.li`
  position: relative;
  border: 1px solid black;
  border-radius: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const H4 = styled.h4`
  cursor: pointer;
`;


const Event = styled.div`
  margin-left: 2px;
  margin-right: 2px;
  // margin: 2px;
`;

const Title = styled.div`

`;

const Expansion = styled.section`
  transition: height .5s ease-out;
  display: ${props => props.expanded ? 'flex' : 'none'};
  flex-direction: column;
  width: 100%;
`;

const ExpansionHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-around;
  `;
const Price = styled.div`
  width: 100%;
  padding: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid black;
`;

const StartEnd = styled.div`
  display: flex;
  font-size: .8em;
  flex-direction: column;
`;

const ExpansionBody = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: .5rem;
  padding-right: .5rem;
`;

const ExpansionRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;



const EventList = ({ hotelSuggestions, flightSuggestions, poiSuggestions, showCalendared, getSavedFlights, getSavedHotels, getSavedPOIs }) => {

  const [hotels, setHotels] = useState([])
  const [flights, setFlights] = useState([])
  const [pois, setPOIs] = useState([])
  const [expansionID, setExpansionID] = useState(null)
  const [expandedList, setExpandedList] = useState('all')

  useEffect(() => {
    if (hotelSuggestions.length === 0) {
      getSavedHotels();
    }
    if (flightSuggestions.length === 0) {
      getSavedFlights();
    }
    if (poiSuggestions.length === 0) {
      getSavedPOIs();
    }
  }, [])

  useEffect(() => {
    setHotels(hotelSuggestions
      // .filter((hotel) => new Date(hotel.check_in_date) >= new Date())
      .map((hotel) => ({
        title: hotel.hotel_name,
        start: hotel.check_in_date,
        end: hotel.check_out_date,
        username: hotel.username,
        num_of_nights: hotel.num_of_nights,
        price: hotel.price,
        room_type: hotel.room_type,
        type: 'hotel',
        suggestion_id: hotel.offer_id
      }))
      .sort((a, b) => new Date(a.start) - new Date(b.start))
    );
  }, [hotelSuggestions])

  useEffect(() => {
    console.log('FLIGHT SUGGESTIONS', flightSuggestions)
    setFlights(flightSuggestions.filter((flight) => new Date(flight.outgoing.departure_date) > new Date()).map((flight) => ({
      title: flight.outgoing.arrival_airport + ' ⇄ ' + flight.returning.arrival_airport,
      start: flight.outgoing.departure_date,
      end: flight.returning.departure_date,
      username: flight.meta.username,
      price: flight.meta.total_price,
      type: 'flight',
      suggestion_id: flight.meta.suggestion_id,
      groupId: flight.meta.suggestion_id
    })))
  }, [flightSuggestions])

  //OLD FLIGHTSUGGESTIONS HOOK
  // useEffect(() => {
  //   console.log('FLIGHT SUGGESTIONS', flightSuggestions)
  //   setFlights(flightSuggestions.map((flight) => ({
  //     title: 'Flight from ' + flight.outgoing.departure_airport + ' to ' + flight.outgoing.arrival_airport,
  //     start: flight.outgoing.departure_date,
  //     end: flight.outgoing.departure_date,
  //     username: flight.meta.username,
  //     type: 'flight',
  //     suggestion_id: flight.meta.suggestion_id,
  //     groupId: flight.meta.suggestion_id
  //   })))
  // }, [flightSuggestions])

  useEffect(() => {
    // console.log('POI SUGGESTIONS', p oiSuggestions)
    setPOIs(poiSuggestions.map((poi) => ({
      title: poi.name,
      username: poi.user_id,
      suggestion_id: poi.poi_id,
      type: 'poi',
      category: poi.category
    })));
  }, [poiSuggestions])

  const handleClick = (suggestion_ID) => {
    if (suggestion_ID === expansionID) {
      setExpansionID(null);
    } else {
      setExpansionID(suggestion_ID)
    }
  }

  const handleListToggle = (listName) => {
    if (listName === expandedList && listName !== 'all') {
      setExpandedList('none');
    } else {
      setExpandedList(listName);
    }
  }

  return (
    <Container id="external-events" className='demo-app-sidebar'>
      <header>
        <h3 style={{marginBottom: 0, padding: 0}}>Saved Events</h3>
        <small style={{cursor: 'pointer'}}><span onClick={() =>handleListToggle('all')}>[Expand]</span>  <span onClick={() => handleListToggle('none')}>[Collapse]</span></small>
      </header>
      <div className='demo-app-sidebar-section'>
        <H4 onClick={() => { handleListToggle('hotels') }}>{(expandedList === 'all' || expandedList === 'hotels') ? ' - ' : ' + '}Hotels ({hotels.length})</H4>
        <UL show={(expandedList === 'all' || expandedList === 'hotels')}>
          {hotels.map((event, i) => {
            return (
              <LI key={'event-' + i} onClick={() => { handleClick(event.suggestion_id) }} style={{ border: '2px double #56a54d' }}>
                <div
                  className="fc-event"
                  title={event.title}
                  startDate={event.start}
                  endDate={event.end}
                  username={event.username}
                  style={{ marginLeft: '3px', marginRight: '3px',   textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textTransform: 'capitalize',
                  marginTop: '.25rem',
                  marginBottom: '.25rem' }}
                  type={'hotel'}
                  suggestion_id={event.suggestion_id}
                >
                  {event.title}
                </div>
                <Expansion expanded={event.suggestion_id === expansionID}>
                  <Price style={{ borderBottom: '2px solid #56a54d', borderTop: '2px solid #56a54d' }}>Price: {event.price}</Price>
                  <ExpansionHeader>
                    <StartEnd>
                      <small>{'Check in: '}</small>{event.start}
                    </StartEnd>
                    <StartEnd>
                      <small>{'Check out: '}</small>{event.end}
                    </StartEnd>
                  </ExpansionHeader>
                  <ExpansionBody>
                    <ExpansionRow><small>RoomType: </small>{event.room_type}</ExpansionRow>
                    <ExpansionRow><small>Nights: </small>{event.num_of_nights}</ExpansionRow>
                    <ExpansionRow><small>Suggested By: </small>{event.username}</ExpansionRow>
                  </ExpansionBody>
                </Expansion>

              </LI>
            )
          })}
        </UL>
        <H4 onClick={() => { handleListToggle('flights') }}>{(expandedList === 'all' || expandedList === 'flights') ? ' - ' : ' + '}Flights ({flights.length})</H4>
        <UL show={(expandedList === 'all' || expandedList === 'flights')}>
          {flights.map((event, i) => {
            return (
              <LI key={'event-' + i} onClick={() => { handleClick(event.suggestion_id) }} style={{ border: '2px double #bb9ffc' }}>
                <div
                  className="fc-event"
                  title={event.title}
                  startDate={event.start}
                  endDate={event.end}
                  username={event.username}
                  style={{ marginLeft: '3px', marginRight: '3px' }}
                  type={'flight'}
                  suggestion_id={event.suggestion_id}
                >
                  {event.title}
                </div>
                <Expansion expanded={event.suggestion_id === expansionID}>
                  <Price style={{ borderBottom: '2px solid #bb9ffc', borderTop: '2px solid #bb9ffc' }}>Price: {event.price}</Price>
                  <ExpansionHeader>
                    <StartEnd>
                      <small>{'Departing: '}</small>{event.start}
                    </StartEnd>
                    <StartEnd>
                      <small>{'Returning: '}</small>{event.end}
                    </StartEnd>
                  </ExpansionHeader>
                  <ExpansionBody >
                    {/* <ExpansionRow><small>RoomType: </small>{event.room_type}</ExpansionRow> */}
                    {/* <ExpansionRow><small>Nights: </small>{event.num_of_nights}</ExpansionRow> */}
                    <ExpansionRow><small>Suggested By: </small>{event.username}</ExpansionRow>
                  </ExpansionBody>
                </Expansion>

              </LI>
            )
          })}
        </UL>
        <H4 onClick={() => { handleListToggle('pois') }}>{(expandedList === 'all' || expandedList === 'pois') ? ' - ' : ' + '}POIs ({pois.length})</H4>
        <UL show={(expandedList === 'all' || expandedList === 'pois')}>
          {pois.map((event, i) => {
            return (
              <LI key={'event-' + i} onClick={() => { handleClick(event.suggestion_id) }} style={{ border: '2px solid #d15151' }}>
                <div
                  className="fc-event"
                  title={event.title}
                  startDate={event.start}
                  endDate={event.end}
                  username={event.username}
                  style={{ marginLeft: '3px', marginRight: '3px' }}
                  suggestion_id={event.suggestion_id}
                  type={'poi'}
                >
                  {event.title}
                </div>
                <Expansion expanded={event.suggestion_id === expansionID}>
                  <ExpansionBody style={{ borderTop: '2px solid #d15151' }}>
                    <ExpansionRow><small>Category: </small>{event.category}</ExpansionRow>
                  </ExpansionBody>
                </Expansion>

              </LI>
            )
          })}
        </UL>
        {/* <button onClick={showCalendared}>Show Calendared</button> */}
      </div>
    </Container>
  );
};

export default EventList;