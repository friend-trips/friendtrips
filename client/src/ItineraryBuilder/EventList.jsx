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

const EventList = ({ hotelSuggestions, flightSuggestions, poiSuggestions, selectedTrip, showCalendared }) => {
  const [events, setEvents] = useState([]);

  const [hotels, setHotels] = useState([])
  const [flights, setFlights] = useState([])
  const [pois, setPOIs] = useState([])

  // const events = hotels.concat(...flights, ...pois);
  // console.log(hotels, flights, pois);

  useEffect(() => {
    const hotelEvents = hotelSuggestions.map((hotel) => ({
      title: 'Stay at ' + hotel.hotel_name,
      start: hotel.check_in_date,
      end: hotel.check_out_date,
      username: hotel.username,
      type: 'hotel',
      suggestion_id: hotel.hotel_id
    }));
    setHotels(hotelEvents);

    const flightEvents = flightSuggestions.map((flight) => ({
      title: 'Flight from ' + flight.outgoing.departure_airport + ' to ' + flight.outgoing.arrival_airport,
      start: flight.outgoing.departure_date,
      end: flight.outgoing.departure_date,
      username: flight.meta.username,
      type: 'flight',
      suggestion_id: flight.meta.suggestion_id
    }))
    console.log('event parsing in list', flightEvents);
    setFlights(flightEvents);
    console.log(poiSuggestions);
    const poiEvents = poiSuggestions.map((poi) => ({
      title: poi.name,
      username: poi.user_id,
      suggestion_id: poi.poi_id,
      // start: moment(new Date()).format('l'),
      // end: moment(new Date()).format('l'),
      type: 'poi'
    }))
    setPOIs(poiEvents);

  }, [])
  return (
    <Container id="external-events" className='demo-app-sidebar'>
      <div className='demo-app-sidebar-section'>
        <button onClick={showCalendared}>Show Calendared</button>
        <h4>Hotels ({hotels.length})</h4>
        <ul>
          {hotels.map((event, i) => {
            // console.log(event.start)
            return (
              <li key={'event-' + i} >
                <div
                  className="fc-event"
                  title={event.title}
                  startDate={event.start}
                  endDate={event.end}
                  username={event.username}
                  type={'hotel'}
                >
                  {event.title}
                </div>
              </li>
            )
          })}
        </ul>
        <h4>Flights ({flights.length})</h4>
        <ul>
          {flights.map((event, i) => {
            return (
              <li key={'event-' + i} >
                <div
                  className="fc-event"
                  title={event.title}
                  startDate={event.start}
                  endDate={event.end}
                  username={event.username}
                  type={'flight'}
                >
                  {event.title}
                </div>
              </li>
            )
          })}
        </ul>
        <h4>POIs ({pois.length})</h4>
        <ul>
          {pois.map((event, i) => {
            return (
              <li key={'event-' + i} >
                <div
                  className="fc-event"
                  title={event.title}
                  startDate={event.start}
                  endDate={event.end}
                  username={event.username}
                  type={'poi'}
                >
                  {event.title}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </Container>
  );
};

export default EventList;