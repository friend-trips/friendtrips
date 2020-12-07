import React from "react";
import HotelCard from "./HotelCard";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  border: .5px solid black;
  display: grid;
  max-height: 75%;
  grid-template-rows: 1fr 15fr;
`;
const FeedContainer = styled.div`
  overflow-y: scroll;
  display: grid;
`;

// display: grid;

export default function SearchResults(props) {
  return (
    <Container>
      <p>Hotel Search Results</p>
      <FeedContainer>
        {props.searchResults.length > 0
          ? props.searchResults.map((data, index) => {
              return <HotelCard key={index} HotelData={data} cityCode={props.cityCode} checkInDate={props.checkInDate} checkOutDate={props.checkOutDate} roomQuantity={props.roomQuantity} adults={props.adults}/>;
            })
          : null}
      </FeedContainer>
    </Container>
  );
}
