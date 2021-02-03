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

const Calendar = ({ getSavedEvents, saveEvent, updateEvent, deleteEvent, savedEvents, hotelSuggestions, flightSuggestions, poiSuggestions }) => {

  const [eventsByID, setEventsByID] = useState({});

  const [calendaredEvents, setCalendaredEvents] = useState(savedEvents);
  const [validStart, setValidStart] = useState(Date.now())
  const [validEnd, setValidEnd] = useState(Date.now() + 31557600000)
  const calendarComponentRef = useRef();
  const [undo, setUndo] = useState(null);

  useEffect(() => {
    let myEvents = { ...eventsByID };
    // console.log('before add', myEvents)
    hotelSuggestions.forEach((hotel) => {
      // if (!myEvents['hotel-' + hotel.offer_id]) {
      myEvents['hotel-' + hotel.offer_id] = hotel;
      // }
    })
    flightSuggestions.forEach((flight) => {
      // if (!myEvents['flight-' + flight.meta.suggestion_id]) {
      myEvents['flight-' + flight.meta.suggestion_id] = flight;
      // }
    })
    poiSuggestions.forEach((poi) => {
      // if (!myEvents['poi-' + poi.poi_id]) {
      myEvents['poi-' + poi.poi_id] = poi;
      // }
    })
    // console.log('myevents', myEvents)
    setEventsByID(myEvents);
  }, [hotelSuggestions, flightSuggestions, poiSuggestions])

  const getRecordFromEventList = (id) => {
    // console.log('EVENTS LIST', eventsByID)
    return eventsByID[id];
  }
  useEffect(() => {
    if (savedEvents) {
      let newEvents = savedEvents
        .map((event) => ({
          ...event, start: event.start_date, end: event.end_date
        }));
      setCalendaredEvents(newEvents);
    }
  }, [savedEvents])

  useEffect(() => {
    // console.log('new events', calendaredEvents)
  }, [calendaredEvents])

  useEffect(() => {
    let draggableEl = document.getElementById("external-events");
    const calendar = calendarComponentRef.current.getApi();
    new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: (eventEl) => {
        //pass only 'safe' data through element attributes
        const title = eventEl.getAttribute("title");
        const type = eventEl.getAttribute("type");
        const id = eventEl.getAttribute("suggestion_id");
        console.log(id)
        if (type === 'hotel') {
          let selectedHotel = hotelSuggestions.filter((hotel) => hotel.offer_id === id)[0];
          console.log(selectedHotel)
          const start = moment(selectedHotel.check_in_date);
          const end = moment(selectedHotel.check_out_date);
          const duration = moment(end.add(1, 'day').valueOf()).diff(start);
          setValidStart(start.format())
          setValidEnd(end.format())
          let newEvent = {
            title: title,
            start: start.format(),
            duration: duration,
            // end: end.add(1, 'day').valueOf(),
            type: type,
            id: id,
            event_id: id,
            allDay: true,
            constraint: (start && end) ? {
              start: start.subtract(1, 'day').format(),
              end: end.format()
            } : null
          };
          return newEvent;
        } else if (type === 'poi') {
          setValidStart(moment(Date.now()).format())
          setValidEnd(moment(Date.now()).add(1, 'year').valueOf())
          let newEvent = {
            title: title,
            type: type,
            id: id,
            event_id: id,
            allDay: true,
            startTime: { hours: 12 }
          }
          return newEvent;
        } else if (type === 'flight') {
          const selectedFlight = flightSuggestions.filter((flight) => flight.meta.suggestion_id === id)[0];
          const { outgoing, returning } = selectedFlight;
          const formattedOutgoingDepartureTime = moment(outgoing.departure_time, 'HH:mm a');
          const formattedOutgoingDuration = moment(outgoing.duration, 'HH:mm');
          const start = moment(outgoing.departure_date)
            .add(formattedOutgoingDepartureTime.hours(), 'hours')
            .add(formattedOutgoingDepartureTime.minutes(), 'minutes');
          const end = start
            .add(formattedOutgoingDuration.hours(), 'hours')
            .add(formattedOutgoingDuration.minutes(), 'minutes');
          setValidStart(moment(outgoing.departure_date).format())
          setValidEnd(moment(returning.departure_date).add(1, 'day').valueOf())
          const newEvent = {
            title: title,
            start: start.valueOf(),
            startTime: {
              hours: formattedOutgoingDepartureTime.hours(),
              minutes: formattedOutgoingDepartureTime.minutes()
            },
            duration: {
              hours: formattedOutgoingDuration.hours(),
              minutes: formattedOutgoingDuration.minutes()
            },
            type: type,
            id: id,
            event_id: id,
            groupId: id,
            returning: returning,
            constraint: (start && end) ? {
              start: start.subtract(1, 'day').format(),
              end: start.add(1, 'day').valueOf()
            } : null
          };
          // calendar.addEvent(newEvent);
          return newEvent;
        }
      }
    });

    if (savedEvents) {
      if (savedEvents.length === 0) {
        getSavedEvents(1);
      }
    }
  }, [])

  const handleeventRecieve = (info) => {
    //undo automated event add from Calendar -- we will handle the add ourselves
    info.revert();
    const calendar = calendarComponentRef.current.getApi();
    let newEvent = { ...info.event };
    console.log('newEvent,', newEvent)
    //this is dumb.. but if the start and end props are the same, then we should assume we are receiving a POI event -- we need to manually edit our dates.
    if (moment(info.event.start).diff(moment(info.event.end)) === 0) {
      newEvent = {
        ...newEvent,
        title: info.event.title,
        start: info.event.start,
        end: info.event.end
      }
    }
    if (newEvent._def.extendedProps.type === 'flight') {
      //if a flight event was dropped, create the return flight event from passed info
      const { returning } = newEvent._def.extendedProps;
      const formattedReturningDepartureTime = moment(returning.departure_time, 'HH:mm a');
      const formattedReturningDuration = moment(returning.duration, 'HH:mm');
      const start = moment(returning.departure_date)
        .add(formattedReturningDepartureTime.hours(), 'hours')
        .add(formattedReturningDepartureTime.minutes(), 'minutes');
      const end = start
        .add(formattedReturningDuration.hours(), 'hours')
        .add(formattedReturningDepartureTime.minutes(), 'minutes');
      console.log(returning.duration, 'return duration', formattedReturningDuration.hours(), formattedReturningDuration.minutes())
      const returningFlight = {
        title: 'Flight from ' + returning.departure_airport + ' to ' + returning.arrival_airport,
        start: start.valueOf(),
        backgroundColor: 'red',
        startTime: {
          hours: formattedReturningDepartureTime.hours(),
          minutes: formattedReturningDepartureTime.minutes()
        },
        duration: {
          hours: formattedReturningDuration.hours(),
          minutes: formattedReturningDuration.minutes()
        },
        type: newEvent._def.extendedProps.type,
        id: newEvent._def.extendedProps.event_id,
        event_id: newEvent._def.extendedProps.event_id,
        groupId: newEvent._def.extendedProps.event_id,
      }
      // calendar.addEvent(returningFlight);
      setCalendaredEvents(calendaredEvents.concat(returningFlight))

      let returningFlightRecord = {
        itinerary_id: 1,
        suggestion_id: info.event.id,
        title: returningFlight.title,
        type: returningFlight.type,
        description: info.event.description,
        start_date: start.format(),
        end_date: end.format()
      }
      saveEvent(returningFlightRecord, returningFlightRecord.itinerary_id)
    }
    //add new event to list of events on the calendar
    setCalendaredEvents(calendaredEvents.concat(newEvent));
    //save addition to the database
    let eventRecord = {
      itinerary_id: 1,
      suggestion_id: info.event.id,
      title: info.event.title,
      type: newEvent._def.extendedProps.type,
      description: info.event.description,
      start_date: info.event.start,
      end_date: info.event.end
    };
    // console.log('record to save', eventRecord);
    saveEvent(eventRecord, eventRecord.itinerary_id);
    //event is calendared -- reset validDate boundaries
    setValidStart(Date.now())
    setValidEnd(Date.now() + 31557600000)
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

  // const handleeventDrop = (eventDropInfo) => {
  //   console.log('drop event', eventDropInfo.event);
  //   setCalendaredEvents(calendaredEvents.map(event =>
  //     event.id === eventDropInfo.event.id
  //       ? Object.assign({}, event, {
  //         start: eventDropInfo.event.start,
  //         end: eventDropInfo.event.end
  //       })
  //       : event
  //   ))
  // };

  const handleEventChange = (eventChangeInfo) => {
    console.log('eventChange', eventChangeInfo);
    setCalendaredEvents(calendaredEvents.map(event => {
      return event.event_id === eventChangeInfo.event._def.extendedProps.event_id
        ? Object.assign({}, event, {
          start: eventChangeInfo.event.start,
          end: eventChangeInfo.event.end
        })
        : event
    }
    ))
    let eventRecord = {
      itinerary_id: 1,
      event_id: eventChangeInfo.event._def.extendedProps.event_id,
      suggestion_id: eventChangeInfo.event.id,
      title: eventChangeInfo.event.title,
      type: eventChangeInfo.event._def.extendedProps.type,
      description: eventChangeInfo.event.description,
      start_date: eventChangeInfo.event.start,
      end_date: eventChangeInfo.event.end
    };
    updateEvent(eventRecord, 1)
  };

  const handleEventClick = (eventClickInfo) => {
    console.log('event clicked, deleting...', eventClickInfo)
    console.log('event clicked, deleting...', eventClickInfo.event.extendedProps)
    // const elToDelete = calendarComponentRef.current.getApi().getEventById(eventClickInfo.event.id);
    // elToDelete.remove();
    setCalendaredEvents(events => events.filter(e => {
      console.log(e.suggestion_id, eventClickInfo.event._def.extendedProps.suggestion_id)
      if (e.suggestion_id === eventClickInfo.event._def.extendedProps.suggestion_id) {
        deleteEvent(e.event_id, 1);
      }
      return e.suggestion_id !== eventClickInfo.event._def.extendedProps.suggestion_id
    }));
    deleteEvent(eventClickInfo.event._def.extendedProps.event_id, 1)
  }

  const handleEventRemoved = (eventRemovedInfo) => {
    console.log('eventRemoved', eventRemovedInfo);
    console.log('eventID', eventRemovedInfo.event._def.extendedProps.event_id);
    // setCalendaredEvents(calendaredEvents.filter(e => {
    //   console.log('event remove check', e)
    //   return e.event_id !== eventRemovedInfo.event._def.extendedProps.event_id
    // }));
    // deleteEvent(eventRemovedInfo.event._def.extendedProps.event_id, 1)
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
          // eventDidMount={(mountArg) => {
          //   console.log('eventmounted, ', mountArg)
          // }}
          // events={calendaredEvents}
          eventResize={handleeventResize}
          // eventDrop={handleeventDrop}
          eventReceive={handleeventRecieve}
          validRange={() => ({
            start: validStart,
            end: validEnd
          })}
          headerToolbar={{
            start: "prev,next today",
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay list"
          }}
          rerenderDelay={10}
          eventDurationEditable={true}
          plugins={[
            interactionPlugin,
            dayGridPlugin,
            timeGridPlugin,
            list
          ]}
          select={(e) => { console.log('select', e) }}
          ref={calendarComponentRef}
          events={calendaredEvents}
          dateClick={(obj) => console.log('dateClicked', obj.dateStr)}
          editable={true}
          selectable={true}
          eventDragStart={(e) => { console.log('e drag start', e) }}
          eventOverlap={true}
          eventChange={handleEventChange}
          eventClick={handleEventClick}
          eventRemove={handleEventRemoved}
          initialView="dayGridMonth"
          droppable={true}
          timeZone={'local'}
        // defaultDate={new Date()}
        // currentDate={calendarDate}
        // draggable={true}
        // timeFormat={"H(:mm)"}
        // minTime={"07:00:00"}
        // maxTime={"19:00:00"}
        />
      </CalendarContainer>
    </Container>
  );
};

export default Calendar;