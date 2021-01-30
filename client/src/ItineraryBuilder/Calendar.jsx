import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import moment from 'moment';
import list from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction"; // needed for dayClick

import styled from 'styled-components';

import EventList from './containers/EventListContainer.js'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;
const CalendarContainer = styled.div`
  flex: 1;
  padding: 1rem;
`;


Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

const calendarDate = new Date();

const Calendar = ({ hotelSuggestions, flightSuggestions, poiSuggestions, selectedTrip, getSavedFlights, getSavedHotels, getSavedPOIs }) => {
  const [events, setEvents] = useState([].concat(...hotelSuggestions, ...flightSuggestions, ...poiSuggestions));
  const [hotels, setHotels] = useState([])
  const [flights, setFlights] = useState([])
  const [pois, setPOIs] = useState([])
  const [calendaredEvents, setCalendaredEvents] = useState([]);
  const [validStart, setValidStart] = useState(Date.now())
  const [validEnd, setValidEnd] = useState(Date.now() + 2629800000)
  const calendarComponentRef = useRef();
  const [undo, setUndo] = useState(null);

  useEffect(() => {
    let draggableEl = document.getElementById("external-events");
    const calendar = calendarComponentRef.current.getApi();
    new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: (eventEl) => {
        let title = eventEl.getAttribute("title");
        let start = eventEl.getAttribute("startdate");
        let end = eventEl.getAttribute("enddate");
        let type = eventEl.getAttribute("type");
        let username = eventEl.getAttribute("username");
        let id = eventEl.getAttribute("suggestion_id");
        let duration = moment(moment(end).add(1, 'day').valueOf()).diff(moment(start));
        setValidStart(moment(start).format())
        setValidEnd(moment(end).add(1, 'day').valueOf())
        let newEvent = {
          title: title,
          start: moment(start).format(),
          duration: duration,
          end: moment(end).add(1, 'day').valueOf(),
          type: type,
          id: id,
          suggestedBy: username,
          constraint: (start && end) ? {
            start: moment(start).format(),
            end: moment(end).add(1, 'day').valueOf()
          } : null
        };
        return newEvent;
      }
    });

    const hotelEvents = hotelSuggestions.map((hotel) => ({
      title: 'Stay at ' + hotel.hotel_name,
      start: moment(hotel.check_in_date).format(),
      end: moment(hotel.check_out_date).add(1, 'day').valueOf(),
      username: hotel.username,
      type: 'hotel',
      id: hotel.hotel_id
    }));
    setHotels(hotelEvents);

    const flightEvents = flightSuggestions.map((flight) => ({
      title: 'Flight from ' + flight.outgoing.departure_airport + ' to ' + flight.outgoing.arrival_airport,
      start: moment(flight.outgoing.departure_date).format(),
      end: moment(flight.outgoing.departure_date).add(1, 'day').valueOf(),
      username: flight.meta.username,
      type: 'flight',
      id: flight.meta.suggestion_id
    }))
    setFlights(flightEvents);

    const poiEvents = poiSuggestions.map((poi) => ({
      title: poi.name,
      username: poi.user_id,
      id: poi.poi_id,
      // start: moment(new Date()).format('l'),
      // end: moment(new Date()).format('l'),
      type: 'poi'
    }))
    setPOIs(poiEvents);

    setCalendaredEvents(hotelEvents.concat(...flightEvents));
  }, [])

  const handleeventRecieve = (info) => {
    const calendar = calendarComponentRef.current.getApi();

    // console.log('eventReceive', info.event, info.event.start, info.event.end);
    let newEvent = { ...info.event };
    //this is dumb.. but if the start and end props are the same, then we should assume we are receiving a POI event -- we need to manually edit our dates.
    if (moment(info.event.start).diff(moment(info.event.end)) === 0) {
      newEvent = {
        ...newEvent,
        title: info.event.title,
        start: info.event.start,
        end: info.event.end,
      }
    }
    setCalendaredEvents(calendaredEvents.concat(newEvent))
    setValidStart(Date.now())
    setValidEnd(Date.now() + 2629800000)
  };

  const handleeventResize = (eventResizeInfo) => {
    console.log('event resize')
    setCalendaredEvents(calendaredEvents.map(event =>
      event.id === eventResizeInfo.event.id
        ? Object.assign({}, event, {
          start: eventResizeInfo.event.start,
          end: eventResizeInfo.event.end
        })
        : event
    ))
  };

  const handleeventDrop = (eventDropInfo) => {
    console.log('drop event', eventDropInfo.event);
    setCalendaredEvents(calendaredEvents.map(event =>
      event.id === eventDropInfo.event.id
        ? Object.assign({}, event, {
          start: eventDropInfo.event.start,
          end: eventDropInfo.event.end
        })
        : event
    ))
  };

  const handleEventChange = (eventChangeInfo) => {
    console.log('eventChange', eventChangeInfo);
    setCalendaredEvents(calendaredEvents.map(event => {
      return event.id === eventChangeInfo.event.id
        ? Object.assign({}, event, {
          start: eventChangeInfo.event.start,
          end: eventChangeInfo.event.end
        })
        : event
    }
    ))
  };

  const handleEventClick = (eventClickInfo) => {
    console.log('event clicked, deleting...', eventClickInfo)
    const elToDelete = calendarComponentRef.current.getApi().getEventById(eventClickInfo.event.id);
    elToDelete.remove();
  }

  const handleEventRemoved = (eventRemovedInfo) => {
    console.log('eventRemoved', eventRemovedInfo);
    setCalendaredEvents(calendaredEvents.filter(e => e.id !== eventRemovedInfo.event.id));
    //would be nice if we could get this 'undo' function saved somewhere so we could call it again later... for now let's just call it again
    // setTimeout(eventRemovedInfo.revert, 1000);
  }

  const showCalendared = () => {
    calendaredEvents.forEach((event) => {
      if (!event._context) {

        console.log(event)
      } else if (event.start) {
        //poi events have different dates
        let itinEvent = {
          title: event._def.title,
          start: event.start,
          end: event.end,
          type: event._def.extendedProps.type,
          user_id: 7 || event._def.extendedProps.suggestedBy,
          trip_id: 1,
          itinerary_id: 1,
        }
        console.log(itinEvent);
      } else {
        let itinEvent = {
          title: event._def.title,
          start: event._instance.range.start,
          end: event._instance.range.end,
          type: event._def.extendedProps.type,
          user_id: 7 || event._def.extendedProps.suggestedBy,
          trip_id: 1,
          itinerary_id: 1,
        }
        console.log(itinEvent);
      }
    })
    console.log(calendaredEvents.length)
  }

  return (
    <Container>
      <EventList showCalendared={showCalendared} />
      {typeof undo === 'function' ?
      <button onClick={undo}>Undo</button>
        : null
    }
      <CalendarContainer className="demo-app-calendar">
        <FullCalendar
          // eventDidMount={(mountArg) => { console.log('eventmounted, ', mountArg) }}
          events={calendaredEvents}
          eventResize={handleeventResize}
          eventDrop={handleeventDrop}
          eventReceive={handleeventRecieve}
          timeFormat={"H(:mm)"}
          minTime={"07:00:00"}
          maxTime={"19:00:00"}
          defaultView="dayGridMonth"
          //eventRender={(info)=>console.log("hi")}
          validRange={ () => ({
            start: validStart,
            end: validEnd
          })}
          headerToolbar={{
            start: "prev,next today",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay list"
          }}
          rerenderDelay={10}
          eventDurationEditable={false}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            list,
            interactionPlugin
          ]}
          select={(e) => { console.log('select', e) }}
          ref={calendarComponentRef}
          // weekends={this.state.calendarWeekends}
          events={calendaredEvents}
          dateClick={(obj) => console.log('dateClicked', obj.dateStr)}
          currentDate={calendarDate}
          // defaultDate={new Date()}
          editable={true}
          selectable={true}
          eventDragStart={(e) => { console.log('e drag start', e) }}
          eventOverlap={true}
          eventChange={handleEventChange}
          eventClick={handleEventClick}
          eventRemove={handleEventRemoved}
          draggable={true}
        />
      </CalendarContainer>
    </Container>
  );
};

export default Calendar;