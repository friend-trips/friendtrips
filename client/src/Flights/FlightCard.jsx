import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from 'axios';
import Modal from './Modal.jsx';

// this is the container for the div experiment
const Container = styled.div`
  display: flex;
  grid-template-columns: 75% 25%;
  grid-template-rows: 50% 50%;
  border: solid 1px;
  border-radius: 7px;
  margin-bottom: 20px;
  height: 150px;
  width: 97%;
  padding: 10px;
  font-family: "cerapro-bold",sans-serif;
  position: relative;
  background-color: #E6DBFF;
`;
const Direction = styled.h1``;
const FlightNumber = styled.span``;

const User = styled.span`
  font-family: "cerapro-bold",sans-serif;
  font-weight: 200;
  font-size: 14px;
  line-height: 24px;
  right: 4%;
  top: 2%;
  position: absolute;
`;
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
  font-size: 11px;
`;

const Amount = styled.span`
  vertical-align: middle;
  display: inline-block;
  font-size: 20px;
`;

const FlightCard = ({ data }) => {
  console.log('This is the data for a single saved flight suggestion ', data);
  let {outgoing, returning, meta} = data;

  return (
    <div>
      <Container>
        <Departing>
          Departing
          <DateAndCarrier>
            <Date>{outgoing.departure_date}</Date>
            <CarrierCode>{outgoing.abbreviated_carrier_code}</CarrierCode>
          </DateAndCarrier>
          <Time>
            {outgoing.departure_time} - {outgoing.arrival_time}
          </Time>
          <DurationAndAirports>
            <Airport>
              {outgoing.departure_airport} - {outgoing.arrival_airport}
            </Airport>
          </DurationAndAirports>
        </Departing>
        <Returning>
          Returning
          <DateAndCarrier>
            <Date>{returning.departure_date}</Date>
            <CarrierCode>{returning.abbreviated_carrier_code}</CarrierCode>
          </DateAndCarrier>
          <Time>
            {returning.departure_time} - {returning.arrival_time}
          </Time>
          <DurationAndAirports>
            <Airport>
              {returning.departure_airport} - {returning.arrival_airport}
            </Airport>
          </DurationAndAirports>
        </Returning>
        <Price>
          <Amount>${meta.total_price}</Amount>
          <Seats>{meta.num_of_seats} Seats Left</Seats>
        </Price>
      </Container>
    </div>

  );
};

export default FlightCard;
