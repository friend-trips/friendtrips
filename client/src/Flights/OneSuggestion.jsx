import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from 'axios';

// this is the container for the div experiment
const Container = styled.div`
  display: grid;
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

const Upvote = styled.button`
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
  bottom: -5px;
  right: 44px;
`;
const UpArrow = styled.svg`
  height: 12px;
  width: 12px;
  transform: rotate(90deg);
`
const DownArrow = styled.svg`
  height: 12px;
  width: 12px;
  transform: rotate(270deg);
`
const Downvote = styled.button`
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
  bottom: -5px;
  right: 8px;
`;
const UpvoteTotals = styled.span`
  font-family: "cerapro-regular",sans-serif;
  font-weight: 170;
  font-size: 12px;
  color: #00b300;
  position: absolute;
  bottom: 0px;
  right: 40px;
`;
const DownvoteTotals = styled.span`
  font-family: "cerapro-regular",sans-serif;
  font-weight: 170;
  font-size: 12px;
  color: #e60000;
  position: absolute;
  bottom: 0px;
  right: 4px;
`;

const OneSuggestion = ({ data }) => {
  let {outgoing, returning, meta} = data;

  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  useEffect(() => {
    if (meta.upvote_names) {
      setUpvotes(meta.upvote_names.length)
    }
    if (meta.downvote_names) {
      setDownvotes(meta.downvote_names.length)
    }
  }, [])

  const upvote = function() {
    console.log(meta.suggestion_id, "meta suggestion id");
    axios({
      method: 'post',
      url: 'http://morning-bayou-59969.herokuapp.com/api/votes',
      header: {'Access-Control-Allow-Origin': '*'},
      data: {
        "type": "+",
        "user_id": meta.user_id,
        "suggestion_id": meta.suggestion_id,
        "trip_id": 1,
      }
    })
      .then(() => {
        setUpvotes(upvotes + 1);
      })
      .catch(console.log)
  }

  const downvote = function() {
    axios({
      method: 'post',
      url: 'http://morning-bayou-59969.herokuapp.com/api/votes',
      header: {'Access-Control-Allow-Origin': '*'},
      data: {
        "type": "-",
        "user_id": meta.user_id,
        "suggestion_id": meta.suggestion_id,
        "trip_id": 1
      }
    })
      .then(() => {
        setDownvotes(downvotes + 1);
      })
      .catch(console.log)
  }

  return (
    <Container>
      <User>
        {meta.username}
      </User>
      <Departing>
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
        <Upvote onClick={() => upvote()}>
          <UpArrow viewBox="0 0 18 18" role="presentation" ariaHidden="true" focusable="false"><path d="m13.7 16.29a1 1 0 1 1 -1.42 1.41l-8-8a1 1 0 0 1 0-1.41l8-8a1 1 0 1 1 1.42 1.41l-7.29 7.29z" fillRule="evenodd"></path></UpArrow>
        </Upvote>

        <Downvote onClick={() => downvote()}>
          <DownArrow viewBox="0 0 18 18" role="presentation" ariaHidden="true" focusable="false"><path d="m13.7 16.29a1 1 0 1 1 -1.42 1.41l-8-8a1 1 0 0 1 0-1.41l8-8a1 1 0 1 1 1.42 1.41l-7.29 7.29z" fillRule="evenodd"></path></DownArrow>
        </Downvote>
        {upvotes > 0 ? <UpvoteTotals>{upvotes}</UpvoteTotals> : null}
        {downvotes > 0 ? <DownvoteTotals>{downvotes}</DownvoteTotals> : null}
      </Price>
    </Container>

  );
};

export default OneSuggestion;
