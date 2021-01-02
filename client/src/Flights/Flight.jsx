import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import axios from 'axios';
import {AuthContext} from '../components/providers/AuthenticationProvider.jsx';
import {ApplicationContext} from '../components/providers/ApplicationProvider.jsx';


// this is the container for the div experiment
const Container = styled.div`
  display: grid;
  grid-template-columns: 75% 25%;
  grid-template-rows: 50% 50%;
  border: solid 1px;
  border-radius: 7px;
  margin-top: 10px
  margin-bottom: 10px;
  height: 150px;
  width: 97%;
  padding: 10px;
  background-color: #FFFFFF;
`;
const Direction = styled.h1``;
const FlightNumber = styled.span``;
const Date = styled.span`
  font-family: "cerapro-bold",sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  padding-bottom: 6px;
`;
const Duration = styled.span`
  font-family: "cerapro-bold",sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  padding-bottom: 6px;
`;
const Time = styled.span`
  font-family: "cerapro-bold",sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
`;
const Airport = styled.span`
  font-family: "cerapro-regular",sans-serif;
  font-weight: 170;
  font-size: 14px;
  line-height: 20px;
  color: #919191;
`;
const CarrierCode = styled.span`
  font-family: "cerapro-regular",sans-serif;
  font-weight: 170;
  font-size: 14px;
  line-height: 20px;
  color: #919191;
`;
const Class = styled.span``;
const Departing = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 0px 10px 10px;
  grid-row-end: 2;
  width: 100%;
  height: 50%;
  align-self: center;
`;
const Returning = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 0px 10px 10px;
  grid-row-start: 2;
  width: 100%;
  height: 50%;
  align-self: center;
`;
const DateAndCarrier = styled.div`
  height: 100%;
  width: 30%;
  float: left;
  display: grid;
`;
const DurationAndAirports = styled.div`
  height: 100%;
  width: 30%;
  float: right;
  display: grid;
  text-align: right;
`;
const Price = styled.div`
  height: 100%;
  grid-column: 2 / span 1;
  grid-row: 1 / span 2;
  justify-self: center;
  font-family: "cerapro-bold",sans-serif;
  line-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const Seats = styled.div`
  vertical-align: middle;
  display: inline-block;
  font-weight: 500;
  font-size: 14px;
`;

const Amount = styled.span`
  vertical-align: middle;
  display: inline-block;
  font-size: 20px;
  font-weight: 500;
`;
const Save = styled.button`
  color: #ff6666;
  cursor: pointer;
  touch-action: manipulation;
  border-radius: 50%;
  border: none;
  background: transparent;
  transition: -ms-transform 0.25s ease 0s, -webkit-transform 0.25s ease 0s, transform 0.25s ease 0s;
  &:hover{
    background-color: #F8F8F8;
  };
  width: 32px;
  height: 32px;
  text-align: center;
  justify-content: center;
  outline: none;
  position: absolute;
  top: 0;
  right: 0;
`;
const Suggest = styled.button`
  color: #ff6666;
  cursor: pointer;
  touch-action: manipulation;
  border-radius: 50%;
  border: none;
  background: transparent;
  transition: -ms-transform 0.25s ease 0s, -webkit-transform 0.25s ease 0s, transform 0.25s ease 0s;
  &:hover{
    background-color: #F8F8F8;
  };
  width: 32px;
  height: 32px;
  text-align: center;
  justify-content: center;
  outline: none;
  position: absolute;
  bottom: 0;
  right: 0;
`;

const Flights = ({ data, getNewSavedResult }) => {
  const authContext = useContext(AuthContext);
  const appContext = useContext(ApplicationContext);
  const save = function(isSuggested) {
    const flightData = {
      "meta": {
        "trip_id": appContext.selectedTrip.trip_id,
        "user_id": authContext.user,
        "adults": 1,
        "nonstop": "true",
        "is_suggested": isSuggested ? "true" : "false",
        "is_saved": "true",
        "total_price": data.totalPrice,
        // "username": authContext.username
      },
      "outgoing": {
        "duration": data.outgoingDuration,
        "arrival_airport": data.outgoingArrivalAirport,
        "arrival_time": data.outgoingArrivalTime,
        "departure_airport": data.outgoingDepartureAirport,
        "departure_time": data.outgoingDepartureTime,
        "departure_date": data.outgoingDepartureDate,
        "flight_number": data.outgoingFlightNumber,
        "number_of_stops": 0,
        "carrier_code": data.outgoingCarrierCode,
        "operating_carrier_code": data.outgoingOperatingCarrierCode,
        "class": data.outgoingClass,
        "abbreviated_carrier_code": data.outgoingAbbreviatedCarrierCode,
        "num_of_seats": data.bookableSeats
      },
      "returning": {
        "duration": data.returnDuration,
        "arrival_airport": data.returnArrivalAirport,
        "arrival_time": data.returnArrivalTime,
        "departure_airport": data.returnDepartureAirport,
        "departure_time": data.returnDepartureTime,
        "departure_date": data.returnDepartureDate,
        "flight_number": data.returnFlightNumber,
        "number_of_stops": 0,
        "carrier_code": data.returnCarrierCode,
        "operating_carrier_code": data.returnOperatingCarrierCode,
        "class": data.returnClass,
        "abbreviated_carrier_code": data.returnAbbreviatedCarrierCode,
        "num_of_seats": data.bookableSeats
      }
    }

    console.log(flightData);

    axios({
      method: 'post',
      url: 'http://morning-bayou-59969.herokuapp.com/flights',
      data: flightData,
      header: {'Access-Control-Allow-Origin': '*'}
    })
      .then((data) => {
        console.log(data.data,"data from flight.jsx");
        flightData.meta.suggestion_id = data.data.outgoing.suggestion_id
        getNewSavedResult(flightData);

      })
      .catch(console.log)
  }


  return (
    <Container>
      <Departing>
        <DateAndCarrier>
          <Date>{data.outgoingDepartureDate}</Date>
          <CarrierCode>{data.outgoingCarrierCode} {data.outgoingFlightNumber}</CarrierCode>
        </DateAndCarrier>
        <Time>
          {data.outgoingDepartureTime} - {data.outgoingArrivalTime}
        </Time>
        <DurationAndAirports>
          <Duration>{data.outgoingDuration}</Duration>
          <Airport>
            {data.outgoingDepartureAirport} - {data.outgoingArrivalAirport}
          </Airport>
        </DurationAndAirports>
      </Departing>
      <Returning>
        <DateAndCarrier>
          <Date>{data.returnDepartureDate}</Date>
          <CarrierCode>{data.returnCarrierCode} {data.returnFlightNumber}</CarrierCode>
        </DateAndCarrier>
        <Time>
          {data.returnDepartureTime} - {data.returnArrivalTime}
        </Time>
        <DurationAndAirports>
          <Duration>{data.returnDuration}</Duration>
          <Airport>
            {data.returnDepartureAirport} - {data.returnArrivalAirport}
          </Airport>
        </DurationAndAirports>
      </Returning>
      <Price>
        <Amount>${data.totalPrice}</Amount>
          <Seats>{data.bookableSeats} Seats Left</Seats>
        <Save onClick={() => save(false)}>
          <svg aria-hidden="true" role="presentation" focusable="false" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="sc-fzqzlV sc-fzqLLg kCMTKY"><path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z"></path></svg>
        </Save>
        <Suggest onClick={() => save(true)}>
          <svg aria-hidden="true" role="presentation" focusable="false" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="sc-fzqzlV gMJRj"><g vectorEffect="non-scaling-stroke" transform="translate(0,0)scale(1,1)" fill="none" fillRule="evenodd" stroke="#000" strokeWidth="2"><path d="m27 18v9c0 1.1045695-.8954305 2-2 2h-18c-1.1045695 0-2-.8954305-2-2v-9"></path><path d="m4.5 14.5h23z" transform="matrix(0 1 -1 0 30.5 -1.5)"></path><path d="m6 13 9.2928932-9.29289322c.3905243-.39052429 1.0236893-.39052429 1.4142136 0l9.2928932 9.29289322"></path></g></svg>
        </Suggest>
      </Price>
    </Container>

  );
};

export default Flights;
