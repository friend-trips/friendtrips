import React, { useState, useEffect, useRef } from 'react';
import { Draggable } from '@fullcalendar/interaction'
import styled from 'styled-components';
import moment from 'moment'

const Container = styled.div`
  width: 15%;
  max-height: 400px;
  margin-left: 1rem;
  overflow-y: scroll;
`;

const UL = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LI = styled.li`
  border: 1px solid black;
`;

const EventList = ({ hotelSuggestions, flightSuggestions, poiSuggestions, selectedTrip, showCalendared, getSavedFlights, getSavedHotels, getSavedPOIs }) => {
  const [events, setEvents] = useState([]);

  const [hotels, setHotels] = useState([])
  const [flights, setFlights] = useState([])
  const [pois, setPOIs] = useState([])

  // const events = hotels.concat(...flights, ...pois);
  // console.log(hotels, flights, pois);

  useEffect(() => {
    console.log(hotelSuggestions)
    setHotels(hotelSuggestions.map((hotel) => ({
      title: 'Stay at ' + hotel.hotel_name,
      start: hotel.check_in_date,
      end: hotel.check_out_date,
      username: hotel.username,
      type: 'hotel',
      suggestion_id: hotel.offer_id
    })));
  }, [hotelSuggestions])

  useEffect(() => {
    setFlights(flightSuggestions.map((flight) => ({
      title: 'Flight from ' + flight.outgoing.departure_airport + ' to ' + flight.outgoing.arrival_airport,
      start: flight.outgoing.departure_date,
      end: flight.outgoing.departure_date,
      username: flight.meta.username,
      type: 'flight',
      suggestion_id: flight.meta.suggestion_id
    })))
  }, [flightSuggestions])

  useEffect(() => {
    setPOIs(poiSuggestions.map((poi) => ({
      title: poi.name,
      username: poi.user_id,
      suggestion_id: poi.poi_id,
      // start: moment(new Date()).format('l'),
      // end: moment(new Date()).format('l'),
      type: 'poi'
    })));
  }, [poiSuggestions])

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

  return (
    <Container id="external-events" className='demo-app-sidebar'>
      <div className='demo-app-sidebar-section'>
        <button onClick={showCalendared}>Show Calendared</button>
        <h4>Hotels ({hotels.length})</h4>
        <UL>
          {hotels.map((event, i) => {
            // console.log(event.start)
            return (
              <LI key={'event-' + i} >
                <div
                  className="fc-event"
                  title={event.title}
                  startDate={event.start}
                  endDate={event.end}
                  username={event.username}
                  type={'hotel'}
                  suggestion_id={event.suggestion_id}
                  >
                  {event.title}
                </div>
              </LI>
            )
          })}
        </UL>
        <h4>Flights ({flights.length})</h4>
        <UL>
          {flights.map((event, i) => {
            return (
              <LI key={'event-' + i} >
                <div
                  className="fc-event"
                  title={event.title}
                  startDate={event.start}
                  endDate={event.end}
                  username={event.username}
                  type={'flight'}
                  suggestion_id={event.suggestion_id}
                  >
                  {event.title}
                </div>
              </LI>
            )
          })}
        </UL>
        <h4>POIs ({pois.length})</h4>
        <UL>
          {pois.map((event, i) => {
            return (
              <LI key={'event-' + i} >
                <div
                  className="fc-event"
                  title={event.title}
                  startDate={event.start}
                  endDate={event.end}
                  username={event.username}
                  suggestion_id={event.suggestion_id}
                  type={'poi'}
                  >
                  {event.title}
                </div>
              </LI>
            )
          })}
        </UL>
      </div>
    </Container>
  );
};

export default EventList;