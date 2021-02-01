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

const Calendar = ({ getSavedEvents, saveEvent, updateEvent, deleteEvent, savedEvents }) => {
  // const [events, setEvents] = useState([].concat(...hotelSuggestions, ...flightSuggestions, ...poiSuggestions));

  const [calendaredEvents, setCalendaredEvents] = useState(savedEvents);
  const [validStart, setValidStart] = useState(Date.now())
  const [validEnd, setValidEnd] = useState(Date.now() + 31557600000)
  const calendarComponentRef = useRef();
  const [undo, setUndo] = useState(null);

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
    console.log('new events', calendaredEvents)
  }, [calendaredEvents])

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
        console.log('id to keep', id)
        setValidStart(moment(start).format())
        setValidEnd(moment(end).add(1, 'day').valueOf())
        let newEvent = {
          title: title,
          start: moment(start).format(),
          duration: duration,
          end: moment(end).add(1, 'day').valueOf(),
          type: type,
          id: id,
          event_id: id,
          suggestedBy: username,
          constraint: (start && end) ? {
            start: moment(start).format(),
            end: moment(end).add(1, 'day').valueOf()
          } : null
        };
        return newEvent;
      }
    });

    if (savedEvents) {
      if (savedEvents.length === 0) {
        getSavedEvents(1);
      }
    }
  }, [])

  const handleeventRecieve = (info) => {
    const calendar = calendarComponentRef.current.getApi();
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
    if (newEvent._def.extendedProps.type === 'flight') {
      console.log('FLIGHT RECEIVED IN CALENDAR');
      let fake = {
        title: 'fake event',
        start: moment(info.event.start).add(1, 'day').valueOf(),
        end: moment(info.event.end).add(1, 'day').valueOf()
      }
      calendar.addEvent(fake);
    }
    console.log(newEvent)
    setCalendaredEvents(calendaredEvents.concat(newEvent));
    let eventRecord = {
      itinerary_id: 1,
      suggestion_id: info.event.id,
      title: info.event.title,
      type: newEvent._def.extendedProps.type,
      description: info.event.description,
      start_date: info.event.start,
      end_date: info.event.end
    };
    console.log('record to save', eventRecord);
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
    console.log('event clicked, deleting...', eventClickInfo.event.id)
    const elToDelete = calendarComponentRef.current.getApi().getEventById(eventClickInfo.event.id);
    elToDelete.remove();
    setCalendaredEvents(events => events.filter(e => {
      return e.event_id !== eventClickInfo.event._def.extendedProps.event_id
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
          // eventDidMount={(mountArg) => { console.log('eventmounted, ', mountArg) }}
          events={calendaredEvents}
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