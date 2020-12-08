import React, { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Container = styled.li`
  width: 400px;
  height: 100px;
  margin: 0;
`;

const HotelContainer = styled.div`
  display: grid;
  grid-template-columns: 75% 25%;
  grid-template-rows: 1fr 1fr;
  border: solid 1px;
  border-radius: 7px;
  margin-bottom: 20px;
  height: 75px;
  width: 97%;
  padding: 10px;
  font-family: "cerapro-bold",sans-serif;
  position: relative
  background-color: ##E6DBFF;
`;

const User = styled.span`
  font-family: "cerapro-bold",sans-serif;
  font-weight: 200;
  font-size: 7px;
  line-height: 24px;
  grid-row-start: 1;
  grid-column-end: 3;
  justify-self: end;
`;

const HotelName = styled.div`
  grid-area: 1 / 1 / 2 / 2;
  justify-self: start;
  align-self: center;
  font-family: "cerapro-regular",sans-serif;
  font-weight: 170;
  font-size: 7px;
  line-height: 20px;
`;
const Rating = styled.div`
  grid-area: 2 / 1 / 3 / 2;
  justify-self: start;
  align-self: start;
`;
const Distance = styled.div`
  grid-area: 2 / 1 / 3 / 2;
  justify-self: start;
  align-self: end;
  font-family: "cerapro-regular",sans-serif;
  font-weight: 170;
  font-size: 7px;
  line-height: 20px;
`;

const Price = styled.div`
  height: 100%;
  grid-column: 2 / span 1;
  grid-row: 1 / span 2;
  justify-self: center;
  font-family: "cerapro-bold",sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
`;
const Amount = styled.span`
  vertical-align: middle;
  display: inline-block;
`;
const Upvote = styled.button`
  color: #ff6666;
  cursor: pointer;
  touch-action: manipulation;
  border-radius: 50%;
  border: none;
  background: transparent;
  transition: -ms-transform 0.25s ease 0s, -webkit-transform 0.25s ease 0s, transform 0.25s ease 0s;
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
  height: 7px;
  width: 7px;
  transform: rotate(90deg);
`
const DownArrow = styled.svg`
  height: 7px;
  width: 7px;
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

const ItineraryHotelSuggestion = ({ data, index }) => {

  console.log(data, "data from itinerary suggestion");
  console.log(data.suggestion_id, " data suggestion id hotel")
  return (
    <Draggable key={`draggable-${data.suggestion_id}`} index={index} draggableId={data.suggestion_id.toString()}>
      {(provided, snapshot) => {
        return (
          <Container
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <HotelContainer
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <User>
                Alex
              </User>
              <HotelName>{data.hotel_name}</HotelName>
              {data.rating ? <Rating>{data.rating}/5</Rating> : null}
              <Distance>{data.distance_from_city_center} miles from city center</Distance>
              <Price>
                <Amount>${data.price}</Amount>
                <Upvote>
                  <UpArrow viewBox="0 0 18 18" role="presentation" ariaHidden="true" focusable="false"><path d="m13.7 16.29a1 1 0 1 1 -1.42 1.41l-8-8a1 1 0 0 1 0-1.41l8-8a1 1 0 1 1 1.42 1.41l-7.29 7.29z" fillRule="evenodd"></path></UpArrow>
                </Upvote>
                <Downvote>
                  <DownArrow viewBox="0 0 18 18" role="presentation" ariaHidden="true" focusable="false"><path d="m13.7 16.29a1 1 0 1 1 -1.42 1.41l-8-8a1 1 0 0 1 0-1.41l8-8a1 1 0 1 1 1.42 1.41l-7.29 7.29z" fillRule="evenodd"></path></DownArrow>
                </Downvote>
                {data.upvotes > 0 ? <UpvoteTotals>{data.upvotes}</UpvoteTotals> : null}
                {data.downvotes > 0 ? <DownvoteTotals>{data.downvotes}</DownvoteTotals> : null}
              </Price>
          </HotelContainer>
          </Container>
        )
      }}
    </Draggable >
  );
};

export default ItineraryHotelSuggestion;