import React from "react";
import HotelCard from "./HotelCard";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  border-top: .5px solid black;
  border-right: .5px solid black;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  height: 100%;
  width: 64%;
  overflow-y: scroll;
`;
const FeedContainer = styled.div`
  height: 100%;
  width: 99%;
  overflow-x: hidden;
`;
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  width: 99%;
  padding: 10px;
  text-align: center;
  border-bottom: .5px solid black;
`;
const Loader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 50%
`;

// display: grid;

export default function SearchResults(props) {
  return (
    <Container>
      <Header>Search Results</Header>
      {props.isLoading ? <Loader><img src={`./assets/loadingwheel.gif`}></img></Loader> : null}
      {/* <FeedContainer> */}
        {props.searchResults
          ? props.searchResults.map((data, index) => {
              return (<HotelCard key={index} HotelData={data} cityCode={props.cityCode} checkInDate={props.checkInDate} checkOutDate={props.checkOutDate} roomQuantity={props.roomQuantity} adults={props.adults} getNewSavedResult={props.getNewSavedResult}/>)
            })
          : null}
      {/* </FeedContainer> */}
    </Container>
  );
}
